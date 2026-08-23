import { Chip } from '@heroui/react'
import { data, Link } from 'react-router'
import type { Route } from './+types/teams.$slug.$year'
import { graphql } from '~/graphql/generated'
import { gqlAnonymous } from '~/lib/gql.server'

const CHARTS = graphql(`
    query DepthChartLists($teamSlug: String!, $year: Int!) {
        team(slug: $teamSlug) {
            coachingStaff(year: $year) {
                id
                role
                person
                effectiveFrom
                effectiveTo
            }
        }
        depthChartLists(teamSlug: $teamSlug, year: $year) {
            year
            updatedAt
            charts {
                id
                title
                url
                season
                week
                publishedAt
                detectedAt
                parseStatus
                files {
                    id
                    sha256
                    size
                    fetchedAt
                    url
                }
            }
        }
    }
`)

export async function loader({ params }: Route.LoaderArgs) {
    const year = Number(params.year)
    if (!Number.isInteger(year) || year < 2000 || year > 2100) {
        throw data('Bad year', { status: 400 })
    }
    const { team, depthChartLists } = await gqlAnonymous(CHARTS, { teamSlug: params.slug, year })
    return {
        year,
        staff: team?.coachingStaff ?? [],
        charts: depthChartLists.flatMap((l) => l.charts),
    }
}

const ROLES = ['HC', 'OC', 'DC'] as const

const fmt = (iso: string) => new Date(iso).toISOString().slice(0, 10)
const fmtKb = (bytes: number) => `${Math.max(1, Math.round(bytes / 1024))} KB`
const statusColor = (s: string) => (s === 'OK' ? 'success' : s === 'FAILED' ? 'danger' : 'default')

export default function TeamYear({
    loaderData: { year, staff, charts },
    params,
}: Route.ComponentProps) {
    return (
        <>
            <p className="text-sm">
                <Link to={`/teams/${params.slug}`} className="underline">
                    All seasons
                </Link>{' '}
                <span className="text-default-500">/ {year}</span>{' '}
                <Link to={`/teams/${params.slug}/${year}/alignment`} className="ml-3 underline">
                    Receiver alignment
                </Link>
            </p>
            {staff.length > 0 && (
                <dl className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
                    {ROLES.map((role) => {
                        const people = staff.filter((s) => s.role === role)
                        return people.length === 0 ? null : (
                            <div key={role} className="flex gap-2">
                                <dt className="text-default-500">{role}</dt>
                                <dd>
                                    {people.map((s) => (
                                        <span key={s.id} className="block">
                                            {s.person}
                                            {(s.effectiveTo || people.length > 1) && (
                                                <span className="text-default-500">
                                                    {' '}
                                                    ({fmt(s.effectiveFrom)} –{' '}
                                                    {s.effectiveTo ? fmt(s.effectiveTo) : 'now'})
                                                </span>
                                            )}
                                        </span>
                                    ))}
                                </dd>
                            </div>
                        )
                    })}
                </dl>
            )}
            {charts.length === 0 ? (
                <p className="text-default-500">No depth charts for {year}.</p>
            ) : (
                <div className="table-wrap">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Chart</th>
                                <th>Season</th>
                                <th className="num">Week</th>
                                <th>Published</th>
                                <th>Detected</th>
                                <th>Parse</th>
                                <th>Archived copies</th>
                            </tr>
                        </thead>
                        <tbody>
                            {charts.map((c) => (
                                <tr key={c.id}>
                                    <td>
                                        <a
                                            href={c.url}
                                            className="team-link underline"
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            {c.title}
                                        </a>
                                    </td>
                                    <td>{c.season}</td>
                                    <td className="num">{c.week}</td>
                                    <td>{fmt(c.publishedAt)}</td>
                                    <td>{fmt(c.detectedAt)}</td>
                                    <td>
                                        {c.parseStatus ? (
                                            <Chip size="sm" color={statusColor(c.parseStatus)}>
                                                {c.parseStatus}
                                            </Chip>
                                        ) : (
                                            <span className="text-default-500">—</span>
                                        )}
                                    </td>
                                    <td>
                                        {c.files.length === 0 ? (
                                            <span className="text-default-500">—</span>
                                        ) : (
                                            <ul className="flex flex-col gap-0.5 text-xs">
                                                {c.files.map((f) => (
                                                    <li key={f.id}>
                                                        <a
                                                            href={f.url}
                                                            className="underline"
                                                            target="_blank"
                                                            rel="noreferrer"
                                                        >
                                                            {fmt(f.fetchedAt)}
                                                        </a>{' '}
                                                        <span className="text-default-500">
                                                            {fmtKb(f.size)} ·{' '}
                                                            <code>{f.sha256.slice(0, 8)}</code>
                                                        </span>
                                                    </li>
                                                ))}
                                                {c.files.length > 1 && (
                                                    <li className="text-warning">
                                                        Replaced at same URL
                                                    </li>
                                                )}
                                            </ul>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    )
}
