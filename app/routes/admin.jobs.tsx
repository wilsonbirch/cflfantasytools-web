import { Button, Chip } from '@heroui/react'
import { data, Form } from 'react-router'
import type { Route } from './+types/admin.jobs'
import { graphql } from '~/graphql/generated'
import { JobStatus } from '~/graphql/generated/graphql'
import { requireAdmin } from '~/lib/auth.server'
import { gqlAsViewer } from '~/lib/gql.server'

const JOBS = graphql(`
    query AdminJobs($status: JobStatus) {
        jobs(status: $status, limit: 100) {
            id
            kind
            status
            attempts
            error
            runAt
            startedAt
            finishedAt
        }
        jobHealth {
            kind
        }
    }
`)

const ENQUEUE = graphql(`
    mutation EnqueueJob($kind: String!) {
        enqueueJob(kind: $kind) {
            id
        }
    }
`)

const STATUSES = Object.values(JobStatus)
const isStatus = (s: string | null): s is JobStatus => STATUSES.includes(s as JobStatus)

export async function loader({ request }: Route.LoaderArgs) {
    await requireAdmin(request)
    const raw = new URL(request.url).searchParams.get('status')
    const status = isStatus(raw) ? raw : null
    const { data: d, headers } = await gqlAsViewer(request, JOBS, { status })
    return data({ status, jobs: d.jobs, kinds: d.jobHealth.map((h) => h.kind) }, { headers })
}

export async function action({ request }: Route.ActionArgs) {
    await requireAdmin(request)
    const kind = String((await request.formData()).get('kind') ?? '')
    if (!/^[a-z0-9-]{1,64}$/.test(kind))
        return data({ error: 'Bad job kind', queued: null }, { status: 400 })
    const { data: d, headers } = await gqlAsViewer(request, ENQUEUE, { kind })
    return data({ error: null, queued: d.enqueueJob.id }, { headers })
}

const fmt = (iso: string | null | undefined) => (iso ? iso.replace('T', ' ').slice(0, 16) : '—')
const color = (s: JobStatus) =>
    s === 'SUCCEEDED'
        ? 'success'
        : s === 'FAILED'
          ? 'danger'
          : s === 'RUNNING'
            ? 'accent'
            : 'default'

export default function AdminJobs({
    loaderData: { status, jobs, kinds },
    actionData,
}: Route.ComponentProps) {
    return (
        <div className="flex flex-col gap-6">
            <section className="flex flex-col gap-2">
                <h2 className="text-lg font-medium">Run a job</h2>
                <Form method="post" className="flex flex-wrap gap-2">
                    {kinds.map((kind) => (
                        <Button
                            key={kind}
                            type="submit"
                            name="kind"
                            value={kind}
                            size="sm"
                            variant="secondary"
                        >
                            {kind}
                        </Button>
                    ))}
                </Form>
                {actionData?.queued && (
                    <p role="status" className="text-sm text-success">
                        Queued job #{actionData.queued}.
                    </p>
                )}
                {actionData?.error && (
                    <p role="alert" className="text-sm text-danger">
                        {actionData.error}
                    </p>
                )}
            </section>

            <section className="flex flex-col gap-2">
                <Form method="get" className="flex flex-wrap items-end gap-2">
                    <label className="flex flex-col text-sm">
                        <span className="text-default-500">Status</span>
                        <select
                            name="status"
                            defaultValue={status ?? ''}
                            className="input input--primary"
                        >
                            <option value="">All</option>
                            {STATUSES.map((s) => (
                                <option key={s} value={s}>
                                    {s}
                                </option>
                            ))}
                        </select>
                    </label>
                    <Button type="submit" size="sm" variant="secondary">
                        Filter
                    </Button>
                </Form>
                <div className="table-wrap">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th className="num">#</th>
                                <th>Kind</th>
                                <th>Status</th>
                                <th className="num">Attempts</th>
                                <th>Run at</th>
                                <th>Started</th>
                                <th>Finished</th>
                                <th>Error</th>
                            </tr>
                        </thead>
                        <tbody>
                            {jobs.map((j) => (
                                <tr
                                    key={j.id}
                                    className={j.status === 'FAILED' ? 'bg-danger/10' : ''}
                                >
                                    <td className="num">{j.id}</td>
                                    <td>{j.kind}</td>
                                    <td>
                                        <Chip size="sm" color={color(j.status)}>
                                            {j.status}
                                        </Chip>
                                    </td>
                                    <td className="num">{j.attempts}</td>
                                    <td>{fmt(j.runAt)}</td>
                                    <td>{fmt(j.startedAt)}</td>
                                    <td>{fmt(j.finishedAt)}</td>
                                    <td className="whitespace-normal text-xs text-danger">
                                        {j.error}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    )
}
