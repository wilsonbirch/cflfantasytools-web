import { Link } from 'react-router'
import type { Route } from './+types/games._index'
import { SeasonFilter } from '~/components/SeasonFilter'
import { graphql } from '~/graphql/generated'
import { fmtDate, parseYear } from '~/lib/format'
import { gqlAnonymous } from '~/lib/gql.server'

export const meta: Route.MetaFunction = () => [{ title: 'Games — 3 Down Fantasy' }]

const GAMES = graphql(`
    query Games($year: Int!, $teamSlug: String) {
        teams {
            slug
            name
            abbreviation
        }
        games(year: $year, teamSlug: $teamSlug, limit: 100) {
            id
            date
            homeScore
            awayScore
            homeTeam {
                slug
                abbreviation
            }
            awayTeam {
                slug
                abbreviation
            }
        }
    }
`)

export async function loader({ request }: Route.LoaderArgs) {
    const url = new URL(request.url)
    const year = parseYear(url.searchParams.get('year'))
    const team = url.searchParams.get('team') ?? ''
    const { teams, games } = await gqlAnonymous(GAMES, { year, teamSlug: team || null })
    return { year, team, teams, games }
}

export default function Games({ loaderData: { year, team, teams, games } }: Route.ComponentProps) {
    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-semibold">Games</h1>
            <SeasonFilter year={year} team={team} teams={teams} />
            {games.length === 0 ? (
                <p className="text-default-500">No parsed games for {year}.</p>
            ) : (
                <div className="table-wrap">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Away</th>
                                <th>Home</th>
                                <th className="num">Score</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {games.map((g) => (
                                <tr key={g.id}>
                                    <td>{fmtDate(g.date)}</td>
                                    <td className={`team-${g.awayTeam?.slug}`}>
                                        <span className="team-link">
                                            {g.awayTeam?.abbreviation ?? '?'}
                                        </span>
                                    </td>
                                    <td className={`team-${g.homeTeam?.slug}`}>
                                        <span className="team-link">
                                            {g.homeTeam?.abbreviation ?? '?'}
                                        </span>
                                    </td>
                                    <td className="num">
                                        {g.awayScore ?? '–'}–{g.homeScore ?? '–'}
                                    </td>
                                    <td>
                                        <Link to={`/games/${g.id}`} className="underline">
                                            Box score
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
