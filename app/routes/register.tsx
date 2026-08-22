import { data, redirect } from 'react-router'
import type { Route } from './+types/register'
import { AuthForm } from '~/components/AuthForm'
import { graphql } from '~/graphql/generated'
import { getViewer, safeRedirect } from '~/lib/auth.server'
import { parseCredentials } from '~/lib/credentials.server'
import { gqlAnonymous, tokensFrom } from '~/lib/gql.server'
import { commitSession, getSession } from '~/lib/session.server'

export const meta: Route.MetaFunction = () => [{ title: 'Register — 3 Down Fantasy' }]

const REGISTER = graphql(`
    mutation Register($email: String!, $password: String!) {
        register(email: $email, password: $password) {
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
        payload = (await gqlAnonymous(REGISTER, parsed)).register
    } catch {
        return data({ error: 'Could not register with that email', redirectTo }, { status: 400 })
    }
    const session = await getSession(request)
    session.set('tokens', tokensFrom(payload))
    throw redirect(redirectTo, { headers: { 'Set-Cookie': await commitSession(session) } })
}

export default function Register({ loaderData, actionData }: Route.ComponentProps) {
    return (
        <AuthForm
            title="Register"
            submitLabel="Register"
            redirectTo={actionData?.redirectTo ?? loaderData.redirectTo}
            error={actionData?.error}
            alternate={{ text: 'Already have an account?', to: '/login', label: 'Log in' }}
        />
    )
}
