import { Chip } from '@heroui/react'
import type { Route } from './+types/status'
import { type Column, DataTable } from '~/components/DataTable'
import { PageHeader } from '~/components/PageHeader'
import { StatTile } from '~/components/StatTile'
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

type Job = Route.ComponentProps['loaderData']['jobs'][number]

const columns: Column<Job>[] = [
    { key: 'kind', label: 'Job', cell: (j) => j.kind },
    {
        key: 'state',
        label: 'State',
        cell: (j) => (
            <Chip size="sm" color={j.isStale ? 'danger' : 'success'}>
                {j.isStale ? 'Stale' : 'Fresh'}
            </Chip>
        ),
    },
    { key: 'age', label: 'Age (min)', num: true, cell: (j) => j.ageMinutes ?? '—' },
    { key: 'every', label: 'Expected every (min)', num: true, cell: (j) => j.expectedEveryMinutes },
    {
        key: 'last',
        label: 'Last success (UTC)',
        cell: (j) => (j.lastSuccessAt ? j.lastSuccessAt.replace('T', ' ').slice(0, 16) : 'never'),
    },
]

export default function Status({ loaderData: { jobs } }: Route.ComponentProps) {
    const stale = jobs.filter((j) => j.isStale).length
    return (
        <div className="flex flex-col gap-4">
            <PageHeader title="Status">
                {stale === 0
                    ? 'All scheduled jobs are fresh.'
                    : `${stale} stale job${stale === 1 ? '' : 's'}.`}
            </PageHeader>
            <div className="stat-tiles">
                <StatTile label="Scheduled jobs" value={jobs.length} />
                <StatTile
                    label="Stale"
                    value={stale}
                    hint="never succeeded, or over twice its interval"
                    className={stale > 0 ? 'text-danger' : undefined}
                />
            </div>
            <DataTable
                caption="Scheduled job health"
                columns={columns}
                rows={jobs}
                rowKey={(j) => j.kind}
                rowClass={(j) => (j.isStale ? 'bg-danger/10' : undefined)}
                empty="No scheduled jobs reported."
            />
        </div>
    )
}
