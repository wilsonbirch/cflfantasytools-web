import type { TypedDocumentNode } from '@graphql-typed-document-node/core'
import { GraphQLClient } from 'graphql-request'
import { graphql } from '~/graphql/generated'
import { commitSession, destroySession, getSession, type SessionTokens } from './session.server'

/**
 * The single place web talks to the api, and the single place token refresh
 * happens. No loader implements either.
 *
 * On Fly this resolves over private networking, so tokens never traverse the
 * public internet and the browser never receives one.
 */
const endpoint = process.env.API_GRAPHQL_URL ?? 'http://localhost:4000/graphql'

/** Refresh when the access token has less than this left. */
const REFRESH_SKEW_MS = 60_000
/** Used when the access token carries no readable `exp`. */
const DEFAULT_ACCESS_TTL_MS = 15 * 60_000

export type GqlResult<T> = {
    data: T
    /**
     * Set when the session cookie changed and the caller must return it on the
     * response: `return data(payload, { headers })`. React Router forwards
     * Set-Cookie from every loader, so parallel loaders are fine.
     */
    headers?: HeadersInit
}

type Doc<T, V> = TypedDocumentNode<T, V> | string

const REFRESH = graphql(`
    mutation Refresh($refreshToken: String!) {
        refresh(refreshToken: $refreshToken) {
            accessToken
            refreshToken
        }
    }
`)

/** Build the cookie payload from an AuthPayload. Expiry is read from the JWT. */
export function tokensFrom(payload: { accessToken: string; refreshToken: string }): SessionTokens {
    return {
        accessToken: payload.accessToken,
        refreshToken: payload.refreshToken,
        accessTokenExpiresAt:
            jwtExpiryMs(payload.accessToken) ?? Date.now() + DEFAULT_ACCESS_TTL_MS,
    }
}

function jwtExpiryMs(token: string): number | undefined {
    try {
        const claims = JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString())
        return typeof claims.exp === 'number' ? claims.exp * 1000 : undefined
    } catch {
        return undefined
    }
}

type Fresh = { tokens: SessionTokens | null; setCookie?: string }

// SSR runs loaders in parallel, and the refresh token is one-time use, so every
// loader presenting the same stale token must join one rotation rather than
// race. Entries linger briefly so a loader that arrives after the rotation
// resolved still joins it instead of presenting the burnt token.
const inflight = new Map<string, Promise<Fresh>>()

async function rotate(request: Request, refreshToken: string): Promise<Fresh> {
    const session = await getSession(request)
    try {
        const { refresh } = await gqlAnonymous(REFRESH, { refreshToken })
        const tokens = tokensFrom(refresh)
        session.set('tokens', tokens)
        return { tokens, setCookie: await commitSession(session) }
    } catch {
        // Revoked or reused: the session is dead. Fall back to anonymous and
        // clear the cookie so the next request does not try again.
        return { tokens: null, setCookie: await destroySession(session) }
    }
}

async function freshTokens(request: Request): Promise<Fresh> {
    const tokens = (await getSession(request)).get('tokens')
    if (!tokens) return { tokens: null }
    if (tokens.accessTokenExpiresAt - Date.now() > REFRESH_SKEW_MS) return { tokens }

    let pending = inflight.get(tokens.refreshToken)
    if (!pending) {
        pending = rotate(request, tokens.refreshToken)
        inflight.set(tokens.refreshToken, pending)
        setTimeout(() => inflight.delete(tokens.refreshToken), 30_000)
    }
    return pending
}

/** Run an operation as the signed-in account, refreshing the token first if it is about to expire. */
export async function gqlAsViewer<T, V extends Record<string, unknown> | undefined = undefined>(
    request: Request,
    document: Doc<T, V>,
    variables?: V,
): Promise<GqlResult<T>> {
    const { tokens, setCookie } = await freshTokens(request)
    const headers = setCookie ? { 'Set-Cookie': setCookie } : undefined
    if (!tokens) {
        return { data: await gqlAnonymous(document, variables), headers }
    }
    const client = new GraphQLClient(endpoint, {
        headers: { authorization: `Bearer ${tokens.accessToken}` },
    })
    return {
        data: await client.request<T>(document as TypedDocumentNode<T, V>, variables),
        headers,
    }
}

/** Unauthenticated operations — public pages, and login/signup themselves. */
export async function gqlAnonymous<T, V extends Record<string, unknown> | undefined = undefined>(
    document: Doc<T, V>,
    variables?: V,
): Promise<T> {
    return new GraphQLClient(endpoint).request<T>(document as TypedDocumentNode<T, V>, variables)
}
