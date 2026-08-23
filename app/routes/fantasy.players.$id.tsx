import { data, Link } from 'react-router'
import type { Route } from './+types/fantasy.players.$id'
import { Bars } from '~/components/Bars'
import { type Column, DataTable } from '~/components/DataTable'
import { PageHeader } from '~/components/PageHeader'
import { StatTile } from '~/components/StatTile'
import { graphql } from '~/graphql/generated'
import { fmtDate, fmtDelta, fmtEpa, fmtPts, fmtSalary, POSITION_LABEL } from '~/lib/format'
import { gqlAnonymous } from '~/lib/gql.server'

export const meta: Route.MetaFunction = ({ data }) => [
    { title: `${data?.player.name ?? 'Player'} — Fantasy — 3 Down Fantasy` },
]

const PLAYER = graphql(`
    query FantasyPlayer($id: Int!, $gameweekId: Int) {
        fantasyPlayer(id: $id, gameweekId: $gameweekId) {
            id
            name
            position
            team {
                slug
                name
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
            pointsHistory {
                points
                gameweek {
                    id
                    week
                    year
                }
            }
            salaryHistory {
                capturedAt
                salary
                weekSalaryChange
                gameZoneProjection
            }
            projection {
                points
                epa
                alignment
                games
                fittedAt
                gameweek {
                    week
                    year
                }
                opponent {
                    slug
                    abbreviation
                }
                passAttempts
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
            }
        }
    }
`)

export async function loader({ request, params }: Route.LoaderArgs) {
    const id = Number(params.id)
    if (!Number.isInteger(id) || id <= 0) throw data('Bad player id', { status: 400 })
    const gwRaw = new URL(request.url).searchParams.get('gw')
    const gameweekId = gwRaw && /^\d+$/.test(gwRaw) ? Number(gwRaw) : null
    const { fantasyPlayer } = await gqlAnonymous(PLAYER, { id, gameweekId })
    if (!fantasyPlayer) throw data('Player not found', { status: 404 })
    return { player: fantasyPlayer }
}

type Snapshot = Route.ComponentProps['loaderData']['player']['salaryHistory'][number]

const salaryColumns: Column<Snapshot>[] = [
    { key: 'at', label: 'Captured', cell: (s) => fmtDate(s.capturedAt) },
    { key: 'salary', label: 'Salary', num: true, cell: (s) => fmtSalary(s.salary) },
    { key: 'delta', label: 'Δ$', num: true, cell: (s) => fmtDelta(s.weekSalaryChange) },
    { key: 'gz', label: 'GZ proj', num: true, cell: (s) => fmtPts(s.gameZoneProjection) },
]

/** Projected stat lines in the order the box score uses; zero-only lines are hidden. */
const STAT_LINES = [
    ['passAttempts', 'Pass att'],
    ['passingYards', 'Pass yds'],
    ['passingTouchdowns', 'Pass TD'],
    ['interceptions', 'INT'],
    ['rushAttempts', 'Rush att'],
    ['rushingYards', 'Rush yds'],
    ['rushingTouchdowns', 'Rush TD'],
    ['targets', 'Targets'],
    ['receptions', 'Rec'],
    ['receivingYards', 'Rec yds'],
    ['receivingTouchdowns', 'Rec TD'],
] as const

export default function FantasyPlayerPage({ loaderData: { player: p } }: Route.ComponentProps) {
    const proj = p.projection
    const lines = proj ? STAT_LINES.filter(([k]) => proj[k] > 0.05) : []
    return (
        <div className={`flex flex-col gap-6 ${p.team ? `team-${p.team.slug}` : ''}`}>
            <p className="text-sm">
                <Link to="/fantasy" className="underline">
                    Fantasy
                </Link>{' '}
                <span className="text-default-500">/ {p.name}</span>
            </p>
            <PageHeader
                title={p.name}
                context={
                    <>
                        {POSITION_LABEL[p.position] ?? p.position} ·{' '}
                        <span className="team-link">{p.team?.name ?? 'Free agent'}</span>
                        {p.isLocked && ' · Locked'}
                    </>
                }
            >
                {p.injuredText ? `${p.status ?? 'Injured'}: ${p.injuredText}` : p.status}
            </PageHeader>

            <div className="stat-tiles">
                <StatTile
                    label="Salary"
                    value={fmtSalary(p.salary)}
                    hint={fmtDelta(p.weekSalaryChange)}
                />
                <StatTile label="Season points" value={fmtPts(p.seasonPoints)} />
                <StatTile label="Avg / game" value={fmtPts(p.avgPoints)} />
                <StatTile label="Last GW" value={fmtPts(p.lastGameweekPoints)} />
                <StatTile label="GZ projection" value={fmtPts(p.gameZoneProjection)} />
                <StatTile
                    label="Our projection"
                    value={fmtPts(proj?.points)}
                    hint={proj ? `week ${proj.gameweek.week}` : 'not fitted'}
                />
                <StatTile
                    label="Value"
                    value={p.value == null ? '—' : p.value.toFixed(2)}
                    hint="pts per $1,000"
                />
            </div>

            <section className="flex flex-col gap-2">
                <h2 className="text-lg font-medium">Points by gameweek</h2>
                {p.pointsHistory.length === 0 ? (
                    <p className="text-default-500">No points yet this season.</p>
                ) : (
                    <Bars
                        ariaLabel={`${p.name} fantasy points by gameweek`}
                        bars={p.pointsHistory.map((h) => ({
                            label: `W${h.gameweek.week}`,
                            value: Number(h.points.toFixed(1)),
                        }))}
                    />
                )}
            </section>

            <section className="flex flex-col gap-2">
                <h2 className="text-lg font-medium">
                    Projection breakdown{' '}
                    {proj && (
                        <span className="text-sm font-normal text-default-500">
                            week {proj.gameweek.week}
                            {proj.opponent && ` vs ${proj.opponent.abbreviation}`} · fitted{' '}
                            {fmtDate(proj.fittedAt)}
                        </span>
                    )}
                </h2>
                {!proj ? (
                    <p className="text-default-500">
                        No projection fitted for this player and gameweek.
                    </p>
                ) : (
                    <>
                        <p className="text-sm text-default-500">
                            Role baseline{proj.alignment ? ` from the ${proj.alignment} slot` : ''}{' '}
                            + player quality over {proj.games} game{proj.games === 1 ? '' : 's'}{' '}
                            (fewer games, more pooling) + OC and opposing DC offsets. Points under
                            Game Zone scoring.
                        </p>
                        <dl className="grid max-w-md grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-sm">
                            {lines.map(([k, label]) => (
                                <div key={k} className="contents">
                                    <dt className="text-default-500">{label}</dt>
                                    <dd className="num text-right tabular-nums">
                                        {proj[k].toFixed(1)}
                                    </dd>
                                </div>
                            ))}
                            <dt className="text-default-500">EPA</dt>
                            <dd className="text-right tabular-nums">{fmtEpa(proj.epa)}</dd>
                            <dt className="font-medium">Points</dt>
                            <dd className="text-right font-medium tabular-nums">
                                {fmtPts(proj.points)}
                            </dd>
                        </dl>
                    </>
                )}
            </section>

            <section className="flex flex-col gap-2">
                <h2 className="text-lg font-medium">Salary trend</h2>
                <DataTable
                    caption={`${p.name} salary history`}
                    columns={salaryColumns}
                    rows={p.salaryHistory}
                    rowKey={(s) => s.capturedAt}
                    empty="No salary history yet."
                />
            </section>
        </div>
    )
}
