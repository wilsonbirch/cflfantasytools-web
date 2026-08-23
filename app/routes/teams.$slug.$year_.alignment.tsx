import { data, Link } from 'react-router'
import type { Route } from './+types/teams.$slug.$year_.alignment'
import { graphql } from '~/graphql/generated'
import { alignmentOrder, fmtDate } from '~/lib/format'
import { gqlAnonymous } from '~/lib/gql.server'

const ALIGNMENT = graphql(`
    query TeamAlignment($teamSlug: String!, $year: Int!, $week: Int) {
        teamAlignment(teamSlug: $teamSlug, year: $year, week: $week) {
            week
            chart {
                title
                url
                publishedAt
            }
            positions {
                position
                depth
                player
                jersey
            }
        }
        depthChartLists(teamSlug: $teamSlug, year: $year) {
            charts {
                week
                parseStatus
            }
        }
    }
`)

const DEPTHS = [1, 2, 3]

export async function loader({ request, params }: Route.LoaderArgs) {
    const year = Number(params.year)
    if (!Number.isInteger(year) || year < 2000 || year > 2100) {
        throw data('Bad year', { status: 400 })
    }
    const rawWeek = new URL(request.url).searchParams.get('week')
    const week = rawWeek && /^\d{1,2}$/.test(rawWeek) ? Number(rawWeek) : null
    const { teamAlignment, depthChartLists } = await gqlAnonymous(ALIGNMENT, {
        teamSlug: params.slug,
        year,
        week,
    })
    // No weeks field exists; the parsed charts are the weeks that have an alignment.
    const weeks = [
        ...new Set(
            depthChartLists
                .flatMap((l) => l.charts)
                .filter((c) => c.parseStatus === 'OK' && c.week != null)
                .map((c) => c.week as number),
        ),
    ].sort((a, b) => a - b)
    const slots = new Map<string, Map<number, string>>()
    for (const p of teamAlignment?.positions ?? []) {
        if (!slots.has(p.position)) slots.set(p.position, new Map())
        slots
            .get(p.position)!
            .set(p.depth, p.jersey == null ? p.player : `#${p.jersey} ${p.player}`)
    }
    const rows = [...slots]
        .sort(([a], [b]) => alignmentOrder(a) - alignmentOrder(b) || a.localeCompare(b))
        .map(([position, byDepth]) => ({ position, names: DEPTHS.map((d) => byDepth.get(d)) }))
    return { year, weeks, alignment: teamAlignment, rows }
}

export default function TeamAlignment({
    loaderData: { year, weeks, alignment, rows },
    params,
}: Route.ComponentProps) {
    const base = `/teams/${params.slug}/${year}`
    return (
        <>
            <p className="text-sm">
                <Link to={`/teams/${params.slug}`} className="underline">
                    All seasons
                </Link>{' '}
                <Link to={base} className="underline">
                    / {year}
                </Link>{' '}
                <span className="text-default-500">/ Receiver alignment</span>
            </p>
            {weeks.length > 0 && (
                <nav aria-label="Week" className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="text-default-500">Week</span>
                    {weeks.map((w) => (
                        <Link
                            key={w}
                            to={`${base}/alignment?week=${w}`}
                            className="team-button"
                            aria-current={alignment?.week === w ? 'page' : undefined}
                        >
                            {w}
                        </Link>
                    ))}
                </nav>
            )}
            {!alignment ? (
                <p className="text-default-500">No parsed depth chart for {year}.</p>
            ) : (
                <>
                    <p className="text-sm text-default-500">
                        Week {alignment.week} ·{' '}
                        <a
                            href={alignment.chart.url}
                            className="underline"
                            target="_blank"
                            rel="noreferrer"
                        >
                            {alignment.chart.title}
                        </a>{' '}
                        · published {fmtDate(alignment.chart.publishedAt)}. Slots count outside-in:
                        1S is the widest receiver on the strong/field side, 2WK the second from the
                        outside on the weak/boundary side.
                    </p>
                    <div className="table-wrap">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Slot</th>
                                    <th>Starter</th>
                                    <th>2nd</th>
                                    <th>3rd</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((r) => (
                                    <tr key={r.position}>
                                        <th scope="row">{r.position}</th>
                                        {r.names.map((n, i) => (
                                            <td key={i}>{n ?? '—'}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </>
    )
}
