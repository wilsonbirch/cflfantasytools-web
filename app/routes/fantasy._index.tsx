import { Button } from '@heroui/react'
import { Form, Link } from 'react-router'
import type { Route } from './+types/fantasy._index'
import { type Column, DataTable } from '~/components/DataTable'
import { PageHeader } from '~/components/PageHeader'
import { graphql } from '~/graphql/generated'
import { type FantasyPlayersQuery, PlayerPosition } from '~/graphql/generated/graphql'
import { fmtDelta, fmtEpa, fmtPts, fmtSalary, parseYear, POSITION_LABEL } from '~/lib/format'
import { gqlAnonymous } from '~/lib/gql.server'

export const meta: Route.MetaFunction = () => [{ title: 'Fantasy — 3 Down Fantasy' }]

const FANTASY = graphql(`
    query FantasyPlayers(
        $year: Int!
        $gameweekId: Int
        $position: PlayerPosition
        $teamSlug: String
    ) {
        seasons
        teams {
            slug
            name
            abbreviation
        }
        gameweeks(year: $year) {
            id
            week
            name
            status
            startDate
        }
        fantasyPlayers(
            gameweekId: $gameweekId
            position: $position
            teamSlug: $teamSlug
            limit: 400
        ) {
            id
            name
            position
            team {
                slug
                abbreviation
            }
            salary
            weekSalaryChange
            gameZoneProjection
            seasonPoints
            avgPoints
            lastGameweekPoints
            isLocked
            injuredText
            status
            value
            projection {
                points
                epa
                opponent {
                    abbreviation
                }
            }
        }
    }
`)

const POSITIONS = Object.values(PlayerPosition)
const isPosition = (p: unknown): p is PlayerPosition => POSITIONS.includes(p as PlayerPosition)

type Row = FantasyPlayersQuery['fantasyPlayers'][number]

/** Sort whitelist: the numeric columns, nulls last. */
const SORTS = {
    salary: (r: Row) => r.salary,
    gz: (r: Row) => r.gameZoneProjection,
    proj: (r: Row) => r.projection?.points,
    epa: (r: Row) => r.projection?.epa,
    value: (r: Row) => r.value,
    last: (r: Row) => r.lastGameweekPoints,
    season: (r: Row) => r.seasonPoints,
    avg: (r: Row) => r.avgPoints,
} satisfies Record<string, (r: Row) => number | null | undefined>
type SortKey = keyof typeof SORTS
const isSortKey = (k: string | null): k is SortKey => k != null && Object.hasOwn(SORTS, k)

export async function loader({ request }: Route.LoaderArgs) {
    const q = new URL(request.url).searchParams
    const year = parseYear(q.get('year'))
    const gwRaw = q.get('gw')
    const gameweekId = gwRaw && /^\d+$/.test(gwRaw) ? Number(gwRaw) : null
    const position = isPosition(q.get('pos')) ? (q.get('pos') as PlayerPosition) : null
    const team = q.get('team') ?? ''
    const sort: SortKey = isSortKey(q.get('sort')) ? (q.get('sort') as SortKey) : 'salary'

    const { seasons, teams, gameweeks, fantasyPlayers } = await gqlAnonymous(FANTASY, {
        year,
        gameweekId,
        position,
        teamSlug: team || null,
    })
    // The api resolves an omitted gameweek to the first not yet complete; mirror that for the selector.
    const current = gameweeks.find((g) => g.status !== 'complete') ?? gameweeks.at(-1) ?? null
    const selected = gameweeks.find((g) => g.id === gameweekId) ?? current
    const pick = SORTS[sort]
    const rows = [...fantasyPlayers].sort((a, b) => (pick(b) ?? -Infinity) - (pick(a) ?? -Infinity))
    return { year, seasons, teams, gameweeks, selected, position, team, sort, rows }
}

const columns: Column<Row>[] = [
    {
        key: 'player',
        label: 'Player',
        cellClass: (r) => (r.team ? `team-${r.team.slug}` : undefined),
        cell: (r) => (
            <>
                <Link to={`/fantasy/players/${r.id}`} className="underline">
                    {r.name}
                </Link>{' '}
                <span className="team-link text-xs">{r.team?.abbreviation ?? 'FA'}</span>
            </>
        ),
    },
    { key: 'pos', label: 'Pos', cell: (r) => POSITION_LABEL[r.position] ?? r.position },
    {
        key: 'status',
        label: 'Status',
        cell: (r) =>
            r.isLocked ? (
                <span className="text-default-500">Locked</span>
            ) : r.injuredText ? (
                <span className="text-warning" title={r.injuredText}>
                    {r.status ?? 'Injured'}
                </span>
            ) : (
                ''
            ),
    },
    { key: 'opp', label: 'Opp', cell: (r) => r.projection?.opponent?.abbreviation ?? '—' },
    { key: 'salary', label: 'Salary', num: true, sortable: true, cell: (r) => fmtSalary(r.salary) },
    {
        key: 'delta',
        label: 'Δ$',
        title: 'Salary change this week',
        num: true,
        cell: (r) => fmtDelta(r.weekSalaryChange),
    },
    {
        key: 'gz',
        label: 'GZ proj',
        title: "Game Zone's own projection",
        num: true,
        sortable: true,
        cell: (r) => fmtPts(r.gameZoneProjection),
    },
    {
        key: 'proj',
        label: 'Our proj',
        title: 'Our projection: role baseline + player quality + OC and opposing DC offsets',
        num: true,
        sortable: true,
        cell: (r) => fmtPts(r.projection?.points),
    },
    {
        key: 'epa',
        label: 'Proj EPA',
        title: 'Expected EPA of the plays the player throws, carries or is targeted on',
        num: true,
        sortable: true,
        cell: (r) => fmtEpa(r.projection?.epa),
    },
    {
        key: 'value',
        label: 'Value',
        title: 'Our projected points per $1,000 of salary',
        num: true,
        sortable: true,
        cell: (r) => (r.value == null ? '—' : r.value.toFixed(2)),
    },
    {
        key: 'last',
        label: 'Last GW',
        title: 'Points in the most recent completed gameweek',
        num: true,
        sortable: true,
        cell: (r) => fmtPts(r.lastGameweekPoints),
    },
    {
        key: 'season',
        label: 'Season',
        num: true,
        sortable: true,
        cell: (r) => fmtPts(r.seasonPoints),
    },
    {
        key: 'avg',
        label: 'Avg',
        title: 'Points per game played',
        num: true,
        sortable: true,
        cell: (r) => fmtPts(r.avgPoints),
    },
]

export default function Fantasy({
    loaderData: { year, seasons, teams, gameweeks, selected, position, team, sort, rows },
}: Route.ComponentProps) {
    const base = `?year=${year}&gw=${selected?.id ?? ''}&pos=${position ?? ''}&team=${team}`
    const years = seasons.includes(year) ? seasons : [year, ...seasons]
    return (
        <div className="flex flex-col gap-4">
            <PageHeader
                title="Fantasy"
                context={selected ? `${year} · Week ${selected.week}` : year}
            >
                Game Zone salaries and projections beside ours. A companion: pick here, enter your
                lineup on Game Zone yourself.
            </PageHeader>
            <Form method="get" className="flex flex-wrap items-end gap-3">
                <label className="flex flex-col text-sm">
                    <span className="text-default-500">Season</span>
                    <select name="year" defaultValue={year} className="input input--primary">
                        {years.map((y) => (
                            <option key={y} value={y}>
                                {y}
                            </option>
                        ))}
                    </select>
                </label>
                <label className="flex flex-col text-sm">
                    <span className="text-default-500">Gameweek</span>
                    <select
                        name="gw"
                        defaultValue={selected?.id ?? ''}
                        className="input input--primary"
                    >
                        {gameweeks.map((g) => (
                            <option key={g.id} value={g.id}>
                                Week {g.week} · {g.name}
                                {g.status === 'complete' ? ' (final)' : ''}
                            </option>
                        ))}
                    </select>
                </label>
                <label className="flex flex-col text-sm">
                    <span className="text-default-500">Position</span>
                    <select
                        name="pos"
                        defaultValue={position ?? ''}
                        className="input input--primary"
                    >
                        <option value="">All</option>
                        {POSITIONS.map((p) => (
                            <option key={p} value={p}>
                                {POSITION_LABEL[p]}
                            </option>
                        ))}
                    </select>
                </label>
                <label className="flex flex-col text-sm">
                    <span className="text-default-500">Team</span>
                    <select name="team" defaultValue={team} className="input input--primary">
                        <option value="">All teams</option>
                        {teams.map((t) => (
                            <option key={t.slug} value={t.slug}>
                                {t.name}
                            </option>
                        ))}
                    </select>
                </label>
                <input type="hidden" name="sort" value={sort} />
                <Button type="submit" variant="secondary" size="sm">
                    Show
                </Button>
            </Form>
            <DataTable
                caption={`Fantasy players, ${year}${selected ? ` week ${selected.week}` : ''}`}
                columns={columns}
                rows={rows}
                rowKey={(r) => r.id}
                sort={{ key: sort, href: (k) => `${base}&sort=${k}` }}
                empty={`No Game Zone players synced for ${year}.`}
            />
        </div>
    )
}
