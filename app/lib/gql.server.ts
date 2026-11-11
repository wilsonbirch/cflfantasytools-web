import type { TypedDocumentNode } from '@graphql-typed-document-node/core'
import { Kind, parse, print, type DocumentNode, type OperationDefinitionNode } from 'graphql'
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

/** One entry of a GraphQL response's `errors` array, as graphql-yoga sends it. */
export type GraphQLErrorEntry = {
    message: string
    locations?: { line: number; column: number }[]
    path?: (string | number)[]
    extensions?: Record<string, unknown>
}

/**
 * Thrown for every failed operation: a non-empty `errors` array (even with
 * `data` alongside), a non-2xx status, or a body that is not a GraphQL JSON
 * result. A network failure from `fetch` itself propagates as-is.
 *
 * The shape follows graphql-request's ClientError, which this replaced, so
 * `err.response.errors[0].extensions.code` reads the same. Unlike ClientError,
 * the message is just the api's first error message, and the variables are not
 * kept: they carry passwords and refresh tokens, and an uncaught error is logged.
 */
export class GraphQLRequestError extends Error {
    override name = 'GraphQLRequestError'

    constructor(
        message: string,
        readonly response: {
            status: number
            headers: Headers
            body: string
            data?: Record<string, unknown> | null
            errors?: GraphQLErrorEntry[]
            extensions?: Record<string, unknown>
        },
        readonly request: { query: string; operationName?: string },
        options?: ErrorOptions,
    ) {
        super(message, options)
    }
}

// graphql-request sent exactly this, and graphql-yoga picks its response
// content type (and so its HTTP status codes for request errors) from it.
const ACCEPT = 'application/graphql-response+json, application/json'

const isObject = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null && !Array.isArray(value)

/** The name of the document's operation when it holds exactly one, as graphql-request sent it. */
function operationNameOf(document: DocumentNode): string | undefined {
    const ops = document.definitions.filter(
        (d): d is OperationDefinitionNode => d.kind === Kind.OPERATION_DEFINITION,
    )
    return ops.length === 1 ? ops[0].name?.value : undefined
}

function toRequest(document: DocumentNode | string): { query: string; operationName?: string } {
    if (typeof document !== 'string') {
        return { query: print(document), operationName: operationNameOf(document) }
    }
    // A raw string is sent verbatim; the server reports any syntax error.
    let operationName: string | undefined
    try {
        operationName = operationNameOf(parse(document))
    } catch {
        operationName = undefined
    }
    return { query: document, operationName }
}

/**
 * POST one operation to the api and return its `data`, or throw a
 * GraphQLRequestError. (Not called `request`: gqlAsViewer takes a `request`.)
 */
async function send<T, V>(
    document: Doc<T, V>,
    variables: V | undefined,
    headers?: Record<string, string>,
): Promise<T> {
    const req = toRequest(document)
    const res = await fetch(endpoint, {
        method: 'POST',
        headers: { ...headers, accept: ACCEPT, 'content-type': 'application/json' },
        body: JSON.stringify({ ...req, variables }),
    })
    const body = await res.text()
    const base = { status: res.status, headers: res.headers, body }
    const fail = (
        message: string,
        extra?: Partial<GraphQLRequestError['response']>,
        cause?: unknown,
    ) =>
        new GraphQLRequestError(
            message,
            { ...base, ...extra },
            req,
            cause === undefined ? undefined : { cause },
        )

    // Like graphql-request, only a JSON content type is parsed; anything else
    // (a proxy's HTML error page, say) is not a GraphQL result.
    const contentType = res.headers.get('content-type')?.toLowerCase() ?? ''
    let result: unknown
    let parseError: unknown
    if (
        contentType.includes('application/json') ||
        contentType.includes('application/graphql-response+json')
    ) {
        try {
            result = JSON.parse(body)
        } catch (e) {
            parseError = e
        }
    }

    if (
        !isObject(result) ||
        ('data' in result && result.data !== null && !isObject(result.data)) ||
        ('errors' in result && !Array.isArray(result.errors) && !isObject(result.errors))
    ) {
        const why = res.ok ? 'Invalid GraphQL response' : `GraphQL Error (Code: ${res.status})`
        throw fail(why, undefined, parseError)
    }

    const data = result.data as Record<string, unknown> | null | undefined
    const extensions = isObject(result.extensions) ? result.extensions : undefined
    // A lone error object (not spec, but graphql-request accepted it) counts too.
    const errors = (
        Array.isArray(result.errors) ? result.errors : result.errors ? [result.errors] : []
    ) as GraphQLErrorEntry[]

    if (errors.length > 0 || !res.ok) {
        const message = errors[0]?.message ?? `GraphQL Error (Code: ${res.status})`
        throw fail(message, { data, errors: errors.length ? errors : undefined, extensions })
    }
    // A success with no data (`{}`, `{"data":null}`) is not one. graphql-request
    // resolved these, and yoga never sends them; refuse rather than hand a
    // caller `undefined` typed as T.
    if (data == null) throw fail('Invalid GraphQL response: no data', { data, extensions })
    return data as T
}

const REFRESH = graphql(`
    mutation Refresh($refreshToken: String!) {
        refresh(refreshToken: $refreshToken) {
            accessToken
            refreshToken
            accessTokenExpiresAt
        }
    }
`)

/** Build the cookie payload from an AuthPayload. The api states the expiry; the JWT is opaque to us. */
export function tokensFrom(payload: {
    accessToken: string
    refreshToken: string
    accessTokenExpiresAt: string
}): SessionTokens {
    return {
        accessToken: payload.accessToken,
        refreshToken: payload.refreshToken,
        accessTokenExpiresAt: Date.parse(payload.accessTokenExpiresAt),
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
    return {
        data: await send(document, variables, {
            authorization: `Bearer ${tokens.accessToken}`,
        }),
        headers,
    }
}

/** Unauthenticated operations — public pages, and login/signup themselves. */
export async function gqlAnonymous<T, V extends Record<string, unknown> | undefined = undefined>(
    document: Doc<T, V>,
    variables?: V,
): Promise<T> {
    return send(document, variables)
}
