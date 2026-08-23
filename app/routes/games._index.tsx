import { Link } from 'react-router'
import type { Route } from './+types/games._index'
import { type Column, DataTable } from '~/components/DataTable'
import { PageHeader } from '~/components/PageHeader'
import { SeasonFilter } from '~/components/SeasonFilter'
import { graphql } from '~/graphql/generated'
import { fmtDate, parseYear } from '~/lib/format'
import { gqlAnonymous } from '~/lib/gql.server'

export const meta: Route.MetaFunction = () => [{ title: 'Games — 3 Down Fantasy' }]

const GAMES = graphql(`
    query Games($year: Int!, $teamSlug: String) {
        seasons
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
    const { seasons, teams, games } = await gqlAnonymous(GAMES, { year, teamSlug: team || null })
    return { year, team, seasons, teams, games }
}

type Game = Route.ComponentProps['loaderData']['games'][number]

const columns: Column<Game>[] = [
    { key: 'date', label: 'Date', cell: (g) => fmtDate(g.date) },
    {
        key: 'away',
        label: 'Away',
        cellClass: (g) => `team-${g.awayTeam?.slug}`,
        cell: (g) => <span className="team-link">{g.awayTeam?.abbreviation ?? '?'}</span>,
    },
    {
        key: 'home',
        label: 'Home',
        cellClass: (g) => `team-${g.homeTeam?.slug}`,
        cell: (g) => <span className="team-link">{g.homeTeam?.abbreviation ?? '?'}</span>,
    },
    {
        key: 'score',
        label: 'Score',
        num: true,
        cell: (g) => `${g.awayScore ?? '–'}–${g.homeScore ?? '–'}`,
    },
    {
        key: 'box',
        label: '',
        cell: (g) => (
            <Link to={`/games/${g.id}`} className="underline">
                Box score
            </Link>
        ),
    },
]

export default function Games({
    loaderData: { year, team, seasons, teams, games },
}: Route.ComponentProps) {
    return (
        <div className="flex flex-col gap-4">
            <PageHeader title="Games" context={year} />
            <SeasonFilter year={year} seasons={seasons} team={team} teams={teams} />
            <DataTable
                caption={`${year} games`}
                columns={columns}
                rows={games}
                rowKey={(g) => g.id}
                empty={`No parsed games for ${year}.`}
            />
        </div>
    )
}
