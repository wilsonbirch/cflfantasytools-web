import { data, Link } from 'react-router'
import type { Route } from './+types/teams.$slug.$year'
import { graphql } from '~/graphql/generated'
import { gqlAnonymous } from '~/lib/gql.server'

const CHARTS = graphql(`
    query DepthChartLists($teamSlug: String!, $year: Int!) {
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
            }
        }
    }
`)

export async function loader({ params }: Route.LoaderArgs) {
    const year = Number(params.year)
    if (!Number.isInteger(year) || year < 2000 || year > 2100) {
        throw data('Bad year', { status: 400 })
    }
    const { depthChartLists } = await gqlAnonymous(CHARTS, { teamSlug: params.slug, year })
    return { year, charts: depthChartLists.flatMap((l) => l.charts) }
}

const fmt = (iso: string) => new Date(iso).toISOString().slice(0, 10)

export default function TeamYear({ loaderData: { year, charts }, params }: Route.ComponentProps) {
    return (
        <>
            <p className="text-sm">
                <Link to={`/teams/${params.slug}`} className="underline">
                    All seasons
                </Link>{' '}
                <span className="text-default-500">/ {year}</span>
            </p>
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
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    )
}
