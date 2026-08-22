import { data, Link } from 'react-router'
import type { Route } from './+types/games.$id'
import { graphql } from '~/graphql/generated'
import { fmtDate, fmtEpa, ZONES, zoneLabel } from '~/lib/format'
import { gqlAnonymous } from '~/lib/gql.server'

export const meta: Route.MetaFunction = ({ data }) => [
    {
        title: data?.game
            ? `${data.game.awayTeam?.abbreviation} @ ${data.game.homeTeam?.abbreviation} ${data.game.year} — 3 Down Fantasy`
            : 'Game — 3 Down Fantasy',
    },
]

const GAME = graphql(`
    query Game($id: Int!) {
        game(id: $id) {
            id
            year
            date
            homeScore
            awayScore
            homeTeam {
                slug
                abbreviation
                name
            }
            awayTeam {
                slug
                abbreviation
                name
            }
            boxScore {
                team {
                    slug
                    abbreviation
                }
                points
                plays
                totalYards
                passAttempts
                completions
                passingYards
                rushAttempts
                rushingYards
                firstDowns
                turnovers
                epa
            }
            playerStats {
                player
                team {
                    slug
                    abbreviation
                }
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
                targetsByZone {
                    depth
                    direction
                    targets
                    receptions
                    yards
                    epa
                }
            }
        }
    }
`)

export async function loader({ params }: Route.LoaderArgs) {
    const id = Number(params.id)
    if (!Number.isInteger(id) || id <= 0) throw data('Bad game id', { status: 400 })
    const { game } = await gqlAnonymous(GAME, { id })
    if (!game) throw data('Game not found', { status: 404 })
    return { game }
}

type Stats = Route.ComponentProps['loaderData']['game']['playerStats'][number]

const Player = ({ s }: { s: Stats }) => (
    <td className={`team-${s.team.slug}`}>
        {s.player} <span className="team-link text-xs">{s.team.abbreviation}</span>
    </td>
)

export default function Game({ loaderData: { game } }: Route.ComponentProps) {
    const passers = game.playerStats.filter((s) => s.passAttempts > 0)
    const rushers = game.playerStats.filter((s) => s.rushAttempts > 0)
    const receivers = game.playerStats.filter((s) => s.targets > 0)

    return (
        <div className="flex flex-col gap-6">
            <p className="text-sm">
                <Link to={`/games?year=${game.year}`} className="underline">
                    {game.year} games
                </Link>
            </p>
            <h1 className="text-2xl font-semibold">
                <span className={`team-${game.awayTeam?.slug}`}>
                    <span className="team-link">{game.awayTeam?.name ?? '?'}</span> {game.awayScore}
                </span>{' '}
                <span className="text-default-500">@</span>{' '}
                <span className={`team-${game.homeTeam?.slug}`}>
                    <span className="team-link">{game.homeTeam?.name ?? '?'}</span> {game.homeScore}
                </span>
                <span className="ml-3 text-base font-normal text-default-500">
                    {fmtDate(game.date)}
                </span>
            </h1>

            <Section title="Box score">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Team</th>
                            <th className="num">Pts</th>
                            <th className="num">Plays</th>
                            <th className="num">Yds</th>
                            <th className="num">Cmp/Att</th>
                            <th className="num">Pass yds</th>
                            <th className="num">Rush</th>
                            <th className="num">Rush yds</th>
                            <th className="num">1st downs</th>
                            <th className="num">TO</th>
                            <th className="num">EPA</th>
                        </tr>
                    </thead>
                    <tbody>
                        {game.boxScore.map((b) => (
                            <tr key={b.team.slug} className={`team-${b.team.slug}`}>
                                <td>
                                    <span className="team-link">{b.team.abbreviation}</span>
                                </td>
                                <td className="num">{b.points}</td>
                                <td className="num">{b.plays}</td>
                                <td className="num">{b.totalYards}</td>
                                <td className="num">
                                    {b.completions}/{b.passAttempts}
                                </td>
                                <td className="num">{b.passingYards}</td>
                                <td className="num">{b.rushAttempts}</td>
                                <td className="num">{b.rushingYards}</td>
                                <td className="num">{b.firstDowns}</td>
                                <td className="num">{b.turnovers}</td>
                                <td className="num">{fmtEpa(b.epa)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Section>

            <Section title="Passing">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Player</th>
                            <th className="num">Cmp/Att</th>
                            <th className="num">Yds</th>
                            <th className="num">TD</th>
                            <th className="num">INT</th>
                            <th className="num">EPA</th>
                        </tr>
                    </thead>
                    <tbody>
                        {passers.map((s) => (
                            <tr key={s.player + s.team.slug}>
                                <Player s={s} />
                                <td className="num">
                                    {s.completions}/{s.passAttempts}
                                </td>
                                <td className="num">{s.passingYards}</td>
                                <td className="num">{s.passingTouchdowns}</td>
                                <td className="num">{s.interceptions}</td>
                                <td className="num">{fmtEpa(s.epa)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Section>

            <Section title="Rushing">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Player</th>
                            <th className="num">Att</th>
                            <th className="num">Yds</th>
                            <th className="num">TD</th>
                            <th className="num">EPA</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rushers.map((s) => (
                            <tr key={s.player + s.team.slug}>
                                <Player s={s} />
                                <td className="num">{s.rushAttempts}</td>
                                <td className="num">{s.rushingYards}</td>
                                <td className="num">{s.rushingTouchdowns}</td>
                                <td className="num">{fmtEpa(s.epa)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Section>

            <Section title="Receiving">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Player</th>
                            <th className="num">Tgt</th>
                            <th className="num">Rec</th>
                            <th className="num">Yds</th>
                            <th className="num">TD</th>
                            <th className="num">EPA</th>
                        </tr>
                    </thead>
                    <tbody>
                        {receivers.map((s) => (
                            <tr key={s.player + s.team.slug}>
                                <Player s={s} />
                                <td className="num">{s.targets}</td>
                                <td className="num">{s.receptions}</td>
                                <td className="num">{s.receivingYards}</td>
                                <td className="num">{s.receivingTouchdowns}</td>
                                <td className="num">{fmtEpa(s.epa)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Section>

            <Section title="Targets by zone" hint="rec/tgt, yards in brackets">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Player</th>
                            {ZONES.map(([d, dir]) => (
                                <th key={d + dir} className="num">
                                    {zoneLabel(d, dir)}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {receivers.map((s) => (
                            <tr key={s.player + s.team.slug}>
                                <Player s={s} />
                                {ZONES.map(([d, dir]) => {
                                    const z = s.targetsByZone.find(
                                        (z) => z.depth === d && z.direction === dir,
                                    )
                                    return (
                                        <td key={d + dir} className="num">
                                            {z ? `${z.receptions}/${z.targets} (${z.yards})` : '·'}
                                        </td>
                                    )
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Section>
        </div>
    )
}

function Section({
    title,
    hint,
    children,
}: {
    title: string
    hint?: string
    children: React.ReactNode
}) {
    return (
        <section className="flex flex-col gap-2">
            <h2 className="text-lg font-medium">
                {title}{' '}
                {hint && <span className="text-sm font-normal text-default-500">{hint}</span>}
            </h2>
            <div className="table-wrap">{children}</div>
        </section>
    )
}
