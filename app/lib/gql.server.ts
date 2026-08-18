import { GraphQLClient } from 'graphql-request'
import { getSession } from './session.server'

/**
 * The single place web talks to the api — and, once phase 2 lands auth, the
 * single place token refresh will happen. No loader implements either.
 *
 * On Fly this resolves over private networking, so tokens never traverse the
 * public internet and the browser never receives one.
 */
const endpoint = process.env.API_GRAPHQL_URL ?? 'http://localhost:4000/graphql'

export type GqlResult<T> = {
    data: T
    /**
     * Set when the session cookie changed and the caller must return it on the
     * response. Always undefined today; phase 2 populates it when a rotated
     * refresh token has to be persisted.
     */
    setCookie?: string
}

/**
 * Run an operation as the signed-in account.
 *
 * Phase 2 adds refresh-before-expiry here: compare the stored expiry against a
 * ~60s skew, call the `refresh` mutation when it is close, persist the rotated
 * pair, and return the Set-Cookie. SSR runs loaders in parallel, so that will
 * also need single-flight de-duplication keyed on the refresh token — two
 * loaders presenting the same token in one tick must not race to rotate it.
 */
export async function gqlAsViewer<T>(
    request: Request,
    document: string,
    variables?: Record<string, unknown>,
): Promise<GqlResult<T>> {
    const session = await getSession(request)
    const tokens = session.get('tokens')
    if (!tokens) {
        return { data: await gqlAnonymous<T>(document, variables) }
    }

    const client = new GraphQLClient(endpoint, {
        headers: { authorization: `Bearer ${tokens.accessToken}` },
    })
    return { data: await client.request<T>(document, variables) }
}

/** Unauthenticated operations — public pages, and login/signup themselves. */
export async function gqlAnonymous<T>(
    document: string,
    variables?: Record<string, unknown>,
): Promise<T> {
    return new GraphQLClient(endpoint).request<T>(document, variables)
}
