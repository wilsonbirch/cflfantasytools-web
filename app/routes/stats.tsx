import type { Route } from './+types/stats'
import { type Column, DataTable } from '~/components/DataTable'
import { PageHeader } from '~/components/PageHeader'
import { SeasonFilter } from '~/components/SeasonFilter'
import { graphql } from '~/graphql/generated'
import { fmtEpa, parseYear } from '~/lib/format'
import { gqlAnonymous } from '~/lib/gql.server'

export const meta: Route.MetaFunction = () => [{ title: 'Season stats — 3 Down Fantasy' }]

const SEASON_STATS = graphql(`
    query SeasonStats($year: Int!, $teamSlug: String) {
        seasons
        teams {
            slug
            name
            abbreviation
        }
        playerSeasonStats(year: $year, teamSlug: $teamSlug, limit: 200) {
            player
            primaryAlignment
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
    ['games', 'G', 'Games'],
    ['passAttempts', 'Att', 'Pass attempts'],
    ['completions', 'Cmp', 'Completions'],
    ['passingYards', 'Pass yds', 'Passing yards'],
    ['passingTouchdowns', 'Pass TD', 'Passing touchdowns'],
    ['interceptions', 'INT', 'Interceptions'],
    ['rushAttempts', 'Rush', 'Rush attempts'],
    ['rushingYards', 'Rush yds', 'Rushing yards'],
    ['rushingTouchdowns', 'Rush TD', 'Rushing touchdowns'],
    ['targets', 'Tgt', 'Targets'],
    ['receptions', 'Rec', 'Receptions'],
    ['receivingYards', 'Rec yds', 'Receiving yards'],
    ['receivingTouchdowns', 'Rec TD', 'Receiving touchdowns'],
    ['epa', 'EPA', 'Expected points added'],
] as const
type SortKey = (typeof COLUMNS)[number][0]
const isSortKey = (k: string | null): k is SortKey => COLUMNS.some(([c]) => c === k)

export async function loader({ request }: Route.LoaderArgs) {
    const url = new URL(request.url)
    const year = parseYear(url.searchParams.get('year'))
    const team = url.searchParams.get('team') ?? ''
    const sortParam = url.searchParams.get('sort')
    const sort = isSortKey(sortParam) ? sortParam : null
    const { seasons, teams, playerSeasonStats } = await gqlAnonymous(SEASON_STATS, {
        year,
        teamSlug: team || null,
    })
    // The api sorts by volume; sort the page we have by any column on request.
    const rows = sort ? [...playerSeasonStats].sort((a, b) => b[sort] - a[sort]) : playerSeasonStats
    return { year, team, sort, seasons, teams, rows }
}

type Row = Route.ComponentProps['loaderData']['rows'][number]

const columns: Column<Row>[] = [
    {
        key: 'player',
        label: 'Player',
        cellClass: (s) => `team-${s.team.slug}`,
        cell: (s) => (
            <>
                {s.player} <span className="team-link text-xs">{s.team.abbreviation}</span>
            </>
        ),
    },
    {
        key: 'pos',
        label: 'Pos',
        title: 'Most common chart alignment, outside-in; S strong side, WK weak side',
        cell: (s) => s.primaryAlignment ?? '—',
    },
    ...COLUMNS.map(([key, label, title]): Column<Row> => ({
        key,
        label,
        title,
        num: true,
        sortable: true,
        cell: (s) => (key === 'epa' ? fmtEpa(s.epa) : s[key]),
    })),
]

export default function Stats({
    loaderData: { year, team, sort, seasons, teams, rows },
}: Route.ComponentProps) {
    return (
        <div className="flex flex-col gap-4">
            <PageHeader title="Season leaders" context={year}>
                Per-player production from parsed play-by-play; EPA is era-scoped.
            </PageHeader>
            <SeasonFilter year={year} seasons={seasons} team={team} teams={teams} />
            <DataTable
                caption={`${year} season leaders`}
                columns={columns}
                rows={rows}
                rowKey={(s) => s.player + s.team.slug}
                sort={{ key: sort, href: (key) => `?year=${year}&team=${team}&sort=${key}` }}
                empty={`No parsed games for ${year}.`}
            />
        </div>
    )
}
