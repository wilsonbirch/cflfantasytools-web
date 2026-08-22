import { redirect } from 'react-router'
import type { Route } from './+types/logout'
import { graphql } from '~/graphql/generated'
import { gqlAnonymous } from '~/lib/gql.server'
import { destroySession, getSession } from '~/lib/session.server'

const LOGOUT = graphql(`
    mutation Logout($refreshToken: String!) {
        logout(refreshToken: $refreshToken)
    }
`)

// Logging out is a state change, so it is POST-only; a GET just goes home.
export const loader = () => redirect('/')

export async function action({ request }: Route.ActionArgs) {
    const session = await getSession(request)
    const tokens = session.get('tokens')
    // Best effort: the cookie is destroyed either way, and the api's session
    // expires on its own if revocation does not reach it.
    if (tokens) await gqlAnonymous(LOGOUT, { refreshToken: tokens.refreshToken }).catch(() => {})
    throw redirect('/', { headers: { 'Set-Cookie': await destroySession(session) } })
}
