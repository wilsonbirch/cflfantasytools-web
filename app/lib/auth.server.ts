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

export async function requireUser(request: Request) {
    const result = await getViewer(request)
    if (!result.viewer) {
        const { pathname, search } = new URL(request.url)
        throw redirect(`/login?redirectTo=${encodeURIComponent(pathname + search)}`)
    }
    return { ...result, viewer: result.viewer }
}

export async function requireAdmin(request: Request) {
    const result = await requireUser(request)
    if (result.viewer.role !== 'ADMIN') throw data('Forbidden', { status: 403 })
    return result
}

/** Only same-origin paths may be used as a post-login destination. */
export function safeRedirect(to: FormDataEntryValue | string | null, fallback = '/') {
    return typeof to === 'string' && to.startsWith('/') && !to.startsWith('//') ? to : fallback
}
