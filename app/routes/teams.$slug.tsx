import { Button } from '@heroui/react'
import { data, Form, Outlet, redirect } from 'react-router'
import type { Route } from './+types/teams.$slug'
import { graphql } from '~/graphql/generated'
import { gqlAnonymous, gqlAsViewer } from '~/lib/gql.server'
import { hasSession } from '~/lib/session.server'

export const meta: Route.MetaFunction = ({ data }) => [
    { title: `${data?.team.name ?? 'Team'} — 3 Down Fantasy` },
]

const TEAM = graphql(`
    query Team($slug: String!) {
        team(slug: $slug) {
            slug
            name
            abbreviation
        }
        depthChartYears(teamSlug: $slug)
    }
`)

const MY_SUBSCRIPTIONS = graphql(`
    query MySubscriptions {
        mySubscriptions {
            enabled
            team {
                slug
            }
        }
    }
`)

const SUBSCRIBE = graphql(`
    mutation Subscribe($teamSlug: String!) {
        subscribe(teamSlug: $teamSlug) {
            enabled
        }
    }
`)

const UNSUBSCRIBE = graphql(`
    mutation Unsubscribe($teamSlug: String!) {
        unsubscribe(teamSlug: $teamSlug) {
            enabled
        }
    }
`)

export async function loader({ request, params }: Route.LoaderArgs) {
    const { team, depthChartYears } = await gqlAnonymous(TEAM, { slug: params.slug })
    if (!team) throw data('Team not found', { status: 404 })

    let signedIn = false
    let subscribed = false
    let headers: HeadersInit | undefined
    if (await hasSession(request)) {
        // A dead session falls back to anonymous, and mySubscriptions is
        // signed-in only — treat that as "not subscribed", not as an error.
        const result = await gqlAsViewer(request, MY_SUBSCRIPTIONS).catch(() => null)
        headers = result?.headers
        signedIn = result !== null
        subscribed =
            result?.data.mySubscriptions.some((s) => s.enabled && s.team.slug === team.slug) ??
            false
    }
    return data({ team, years: depthChartYears, signedIn, subscribed }, { headers })
}

export async function action({ request, params }: Route.ActionArgs) {
    const intent = (await request.formData()).get('intent')
    if (intent !== 'subscribe' && intent !== 'unsubscribe') {
        throw data('Unknown intent', { status: 400 })
    }
    if (!(await hasSession(request))) {
        throw redirect(`/login?redirectTo=${encodeURIComponent(`/teams/${params.slug}`)}`)
    }
    const vars = { teamSlug: params.slug }
    const { headers } =
        intent === 'subscribe'
            ? await gqlAsViewer(request, SUBSCRIBE, vars)
            : await gqlAsViewer(request, UNSUBSCRIBE, vars)
    return data({ ok: true }, { headers })
}

export default function Team({
    loaderData: { team, signedIn, subscribed },
    params,
}: Route.ComponentProps) {
    return (
        <div className={`team-${team.slug} flex flex-col gap-4`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-2xl font-semibold">
                    <span className="team-link">{team.name}</span>{' '}
                    <span className="text-default-500">{team.abbreviation}</span>
                </h1>
                {signedIn ? (
                    <Form method="post">
                        <input
                            type="hidden"
                            name="intent"
                            value={subscribed ? 'unsubscribe' : 'subscribe'}
                        />
                        <Button
                            type="submit"
                            variant={subscribed ? 'secondary' : 'primary'}
                            size="sm"
                        >
                            {subscribed ? 'Unsubscribe from updates' : 'Subscribe to updates'}
                        </Button>
                    </Form>
                ) : (
                    <a
                        href={`/login?redirectTo=${encodeURIComponent(`/teams/${params.slug}`)}`}
                        className="text-sm underline"
                    >
                        Log in to get depth chart emails
                    </a>
                )}
            </div>
            <Outlet />
        </div>
    )
}
