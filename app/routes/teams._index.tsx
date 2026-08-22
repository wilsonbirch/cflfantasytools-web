import { Link } from 'react-router'
import type { Route } from './+types/teams._index'
import { graphql } from '~/graphql/generated'
import { gqlAnonymous } from '~/lib/gql.server'

export const meta: Route.MetaFunction = () => [{ title: 'Teams — 3 Down Fantasy' }]

const TEAMS = graphql(`
    query Teams {
        teams {
            slug
            name
            abbreviation
            isActive
        }
    }
`)

export async function loader() {
    const { teams } = await gqlAnonymous(TEAMS)
    return { teams: teams.filter((t) => t.isActive) }
}

export default function Teams({ loaderData: { teams } }: Route.ComponentProps) {
    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-semibold">Depth charts</h1>
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {teams.map((team) => (
                    <li key={team.slug} className={`team-${team.slug}`}>
                        <Link to={`/teams/${team.slug}`} className="team-button w-full">
                            {team.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}
