import { Link } from 'react-router'
import type { Route } from './+types/stats'
import { SeasonFilter } from '~/components/SeasonFilter'
import { graphql } from '~/graphql/generated'
import { fmtEpa, parseYear } from '~/lib/format'
import { gqlAnonymous } from '~/lib/gql.server'

export const meta: Route.MetaFunction = () => [{ title: 'Season stats — 3 Down Fantasy' }]

const SEASON_STATS = graphql(`
    query SeasonStats($year: Int!, $teamSlug: String) {
        teams {
            slug
            name
            abbreviation
        }
        playerSeasonStats(year: $year, teamSlug: $teamSlug, limit: 200) {
            player
            team {
                slug
                abbreviation
            }
            games
            passAttempts
            completions
            passingYards
            passingTouchdowns
            interceptions
            rushAttempts
            rushingYards
            rushingTouchdowns
            targets
            receptions
            receivingYards
            receivingTouchdowns
            epa
        }
    }
`)

const COLUMNS = [
    ['games', 'G'],
    ['passAttempts', 'Att'],
    ['completions', 'Cmp'],
    ['passingYards', 'Pass yds'],
    ['passingTouchdowns', 'Pass TD'],
    ['interceptions', 'INT'],
    ['rushAttempts', 'Rush'],
    ['rushingYards', 'Rush yds'],
    ['rushingTouchdowns', 'Rush TD'],
    ['targets', 'Tgt'],
    ['receptions', 'Rec'],
    ['receivingYards', 'Rec yds'],
    ['receivingTouchdowns', 'Rec TD'],
    ['epa', 'EPA'],
] as const
type SortKey = (typeof COLUMNS)[number][0]
const isSortKey = (k: string | null): k is SortKey => COLUMNS.some(([c]) => c === k)

export async function loader({ request }: Route.LoaderArgs) {
    const url = new URL(request.url)
    const year = parseYear(url.searchParams.get('year'))
    const team = url.searchParams.get('team') ?? ''
    const sortParam = url.searchParams.get('sort')
    const sort = isSortKey(sortParam) ? sortParam : null
    const { teams, playerSeasonStats } = await gqlAnonymous(SEASON_STATS, {
        year,
        teamSlug: team || null,
    })
    // The api sorts by volume; sort the page we have by any column on request.
    const rows = sort ? [...playerSeasonStats].sort((a, b) => b[sort] - a[sort]) : playerSeasonStats
    return { year, team, sort, teams, rows }
}

export default function Stats({
    loaderData: { year, team, sort, teams, rows },
}: Route.ComponentProps) {
    const href = (key: SortKey) => `?year=${year}&team=${team}&sort=${key}`
    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-semibold">Season leaders</h1>
            <SeasonFilter year={year} team={team} teams={teams} />
            {rows.length === 0 ? (
                <p className="text-default-500">No parsed games for {year}.</p>
            ) : (
                <div className="table-wrap">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Player</th>
                                {COLUMNS.map(([key, label]) => (
                                    <th
                                        key={key}
                                        className="num"
                                        aria-sort={sort === key ? 'descending' : undefined}
                                    >
                                        <Link to={href(key)} className="hover:underline">
                                            {label}
                                            {sort === key ? ' ↓' : ''}
                                        </Link>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((s) => (
                                <tr key={s.player + s.team.slug}>
                                    <td className={`team-${s.team.slug}`}>
                                        {s.player}{' '}
                                        <span className="team-link text-xs">
                                            {s.team.abbreviation}
                                        </span>
                                    </td>
                                    {COLUMNS.map(([key]) => (
                                        <td key={key} className="num">
                                            {key === 'epa' ? fmtEpa(s.epa) : s[key]}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
