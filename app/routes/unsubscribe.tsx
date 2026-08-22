import { Link } from 'react-router'
import type { Route } from './+types/unsubscribe'
import { graphql } from '~/graphql/generated'
import { gqlAnonymous } from '~/lib/gql.server'

export const meta: Route.MetaFunction = () => [{ title: 'Unsubscribe — 3 Down Fantasy' }]

const UNSUBSCRIBE_WITH_TOKEN = graphql(`
    mutation UnsubscribeWithToken($token: String!) {
        unsubscribeWithToken(token: $token)
    }
`)

// Reached from a link in a notification email, so it has to work on GET. The
// token is signed by the api; a forged or stale one simply fails.
export async function loader({ request }: Route.LoaderArgs) {
    const token = new URL(request.url).searchParams.get('token')
    if (!token || token.length > 512) return { ok: false }
    const ok = await gqlAnonymous(UNSUBSCRIBE_WITH_TOKEN, { token })
        .then((r) => r.unsubscribeWithToken)
        .catch(() => false)
    return { ok }
}

export default function Unsubscribe({ loaderData: { ok } }: Route.ComponentProps) {
    return (
        <div className="mx-auto max-w-sm text-center">
            <h1 className="mb-2 text-2xl font-semibold">
                {ok ? 'You are unsubscribed' : 'That link did not work'}
            </h1>
            <p className="text-default-500">
                {ok
                    ? 'You will not get more depth chart emails for that team.'
                    : 'The link may have expired. You can manage subscriptions from each team page.'}
            </p>
            <Link to="/teams" className="mt-4 inline-block underline">
                Teams
            </Link>
        </div>
    )
}
