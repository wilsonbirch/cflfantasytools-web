import { Chip } from '@heroui/react'
import type { Route } from './+types/status'
import { graphql } from '~/graphql/generated'
import { gqlAnonymous } from '~/lib/gql.server'

export const meta: Route.MetaFunction = () => [{ title: 'Status — 3 Down Fantasy' }]

const JOB_HEALTH = graphql(`
    query JobHealth {
        jobHealth {
            kind
            ageMinutes
            expectedEveryMinutes
            isStale
            lastSuccessAt
        }
    }
`)

export async function loader() {
    const { jobHealth } = await gqlAnonymous(JOB_HEALTH)
    return { jobs: jobHealth }
}

export default function Status({ loaderData: { jobs } }: Route.ComponentProps) {
    const stale = jobs.filter((j) => j.isStale).length
    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-semibold">Status</h1>
            <p className="text-default-500">
                {stale === 0
                    ? 'All scheduled jobs are fresh.'
                    : `${stale} stale job${stale === 1 ? '' : 's'}.`}
            </p>
            <div className="table-wrap">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Job</th>
                            <th>State</th>
                            <th className="num">Age (min)</th>
                            <th className="num">Expected every (min)</th>
                            <th>Last success (UTC)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobs.map((j) => (
                            <tr key={j.kind} className={j.isStale ? 'bg-danger/10' : ''}>
                                <td>{j.kind}</td>
                                <td>
                                    <Chip size="sm" color={j.isStale ? 'danger' : 'success'}>
                                        {j.isStale ? 'Stale' : 'Fresh'}
                                    </Chip>
                                </td>
                                <td className="num">{j.ageMinutes ?? '—'}</td>
                                <td className="num">{j.expectedEveryMinutes}</td>
                                <td>
                                    {j.lastSuccessAt
                                        ? j.lastSuccessAt.replace('T', ' ').slice(0, 16)
                                        : 'never'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
