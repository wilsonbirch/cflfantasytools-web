import { data, redirect } from 'react-router'
import type { Route } from './+types/login'
import { AuthForm } from '~/components/AuthForm'
import { graphql } from '~/graphql/generated'
import { getViewer, safeRedirect } from '~/lib/auth.server'
import { parseCredentials } from '~/lib/credentials.server'
import { gqlAnonymous, tokensFrom } from '~/lib/gql.server'
import { commitSession, getSession } from '~/lib/session.server'

export const meta: Route.MetaFunction = () => [{ title: 'Log in — 3 Down Fantasy' }]

const LOGIN = graphql(`
    mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            accessToken
            refreshToken
        }
    }
`)

export async function loader({ request }: Route.LoaderArgs) {
    const { viewer } = await getViewer(request)
    if (viewer) throw redirect('/account')
    return { redirectTo: safeRedirect(new URL(request.url).searchParams.get('redirectTo')) }
}

export async function action({ request }: Route.ActionArgs) {
    const form = await request.formData()
    const redirectTo = safeRedirect(form.get('redirectTo'))
    const parsed = parseCredentials(form)
    if ('error' in parsed) return data({ error: parsed.error, redirectTo }, { status: 400 })

    let payload
    try {
        payload = (await gqlAnonymous(LOGIN, parsed)).login
    } catch {
        return data({ error: 'Invalid email or password', redirectTo }, { status: 401 })
    }
    const session = await getSession(request)
    session.set('tokens', tokensFrom(payload))
    throw redirect(redirectTo, { headers: { 'Set-Cookie': await commitSession(session) } })
}

export default function Login({ loaderData, actionData }: Route.ComponentProps) {
    return (
        <AuthForm
            title="Log in"
            submitLabel="Log in"
            redirectTo={actionData?.redirectTo ?? loaderData.redirectTo}
            error={actionData?.error}
            alternate={{ text: 'No account yet?', to: '/register', label: 'Register' }}
        />
    )
}
