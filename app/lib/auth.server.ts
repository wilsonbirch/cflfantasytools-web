import { data, redirect } from 'react-router'
import { graphql } from '~/graphql/generated'
import type { Role } from '~/graphql/generated/graphql'
import { gqlAsViewer } from './gql.server'
import { hasSession } from './session.server'

export type Viewer = { email: string; role: Role }

const ME = graphql(`
    query Me {
        me {
            email
            role
        }
    }
`)

/** The signed-in account, or null. Never hits the api when there is no session. */
export async function getViewer(
    request: Request,
): Promise<{ viewer: Viewer | null; headers?: HeadersInit }> {
    if (!(await hasSession(request))) return { viewer: null }
    const { data, headers } = await gqlAsViewer(request, ME)
    return { viewer: data?.me ?? null, headers }
}

/**
 * `url` is the loader/action `url` arg: the location the user asked for, with
 * React Router's `.data` suffix and `_routes`/`index` params removed. Never
 * derive the return path from `request.url`: on a client-side navigation that
 * is the raw `/account.data?_routes=…` fetch (always, from v8 on), and logging
 * in would land the user on the turbo-stream payload instead of the page.
 */
export async function requireUser(request: Request, url: URL) {
    const result = await getViewer(request)
    if (!result.viewer) {
        throw redirect(`/login?redirectTo=${encodeURIComponent(url.pathname + url.search)}`)
    }
    return { ...result, viewer: result.viewer }
}

export async function requireAdmin(request: Request, url: URL) {
    const result = await requireUser(request, url)
    if (result.viewer.role !== 'ADMIN') throw data('Forbidden', { status: 403 })
    return result
}

// A fixed origin no real request can have: resolving a target against it shows
// whether a browser would leave the site when following it as a Location.
const INTERNAL_ORIGIN = 'http://internal.invalid'

/** C0 controls, DEL and backslash; with `whitespace`, any whitespace as well. */
function hasUnsafeChar(s: string, whitespace: boolean) {
    for (const ch of s) {
        const code = ch.charCodeAt(0)
        if (code < 0x20 || code === 0x7f || ch === '\\') return true
        if (whitespace && /\s/u.test(ch)) return true
    }
    return false
}

// Far longer than any path a route builds; a longer redirectTo is not ours.
const MAX_REDIRECT_LENGTH = 2048

/**
 * Only same-origin paths may be used as a post-login destination; anything
 * else becomes `fallback`.
 *
 * Browsers strip tabs and newlines from a URL and treat `\` as `/`, so a
 * prefix check alone lets `/\evil.test` or `/<tab>/evil.test` through as the
 * protocol-relative `//evil.test`. The value has already been percent-decoded
 * once (URLSearchParams / FormData), so it is rejected outright if it is over
 * MAX_REDIRECT_LENGTH or has any whitespace, control character or backslash,
 * and again if a further decode would produce a control character, a
 * backslash or a leading `//`. What is left is resolved against a fixed
 * origin, and the normalised path, query and hash are returned only if the
 * origin is unchanged and the path does not collapse to `//…` (`/..//x`
 * does).
 *
 * Normalising can turn an accepted input into one these checks would reject
 * (`/./%2Fevil.test` resolves to `/%2Fevil.test`), so a resolved value that
 * differs from the input must pass the same checks before it is returned.
 */
export function safeRedirect(to: unknown, fallback = '/') {
    const resolved = resolveInternal(to)
    if (resolved === null) return fallback
    if (resolved === to) return resolved
    // One more pass, not recursion: URL normalisation is idempotent, so a value
    // that still changes on its second resolution is not one we produced.
    return resolveInternal(resolved) === resolved ? resolved : fallback
}

/** The normalised same-origin path + query + hash for `to`, or null. */
function resolveInternal(to: unknown): string | null {
    if (typeof to !== 'string' || to.length > MAX_REDIRECT_LENGTH) return null
    if (!to.startsWith('/') || to.startsWith('//')) return null
    if (hasUnsafeChar(to, true)) return null

    let decoded: string
    try {
        decoded = decodeURIComponent(to)
    } catch {
        return null
    }
    if (decoded.startsWith('//') || hasUnsafeChar(decoded, false)) return null

    let url: URL
    try {
        url = new URL(to, INTERNAL_ORIGIN)
    } catch {
        return null
    }
    if (url.origin !== INTERNAL_ORIGIN || url.pathname.startsWith('//')) return null
    return url.pathname + url.search + url.hash
}
