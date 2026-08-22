import { Alert, Button, Chip } from '@heroui/react'
import { data, Form } from 'react-router'
import type { Route } from './+types/admin._index'
import { graphql } from '~/graphql/generated'
import { requireAdmin } from '~/lib/auth.server'
import { gqlAsViewer } from '~/lib/gql.server'

const SCRAPERS = graphql(`
    query AdminScrapers {
        scrapeRuns(limit: 100) {
            id
            status
            itemCount
            addedCount
            error
            startedAt
            finishedAt
            team {
                slug
                abbreviation
                name
            }
        }
        teamSources {
            id
            kind
            url
            strategy
            config
            requiresBrowser
            enabled
            lastOkAt
            lastError
            lastItemCount
            team {
                slug
                name
            }
        }
    }
`)

const UPDATE_SOURCE = graphql(`
    mutation UpdateTeamSource($id: Int!, $input: TeamSourceInput!) {
        updateTeamSource(id: $id, input: $input) {
            id
        }
    }
`)

export async function loader({ request }: Route.LoaderArgs) {
    await requireAdmin(request)
    const { data: d, headers } = await gqlAsViewer(request, SCRAPERS)
    // Newest first, so the first run seen per team is its latest.
    const latest = new Map<string, (typeof d.scrapeRuns)[number]>()
    for (const run of d.scrapeRuns) if (!latest.has(run.team.slug)) latest.set(run.team.slug, run)
    return data(
        { latest: [...latest.values()], runs: d.scrapeRuns, sources: d.teamSources },
        { headers },
    )
}

export async function action({ request }: Route.ActionArgs) {
    await requireAdmin(request)
    const form = await request.formData()
    const id = Number(form.get('id'))
    if (!Number.isInteger(id) || id <= 0)
        return data({ error: 'Bad source id', id: 0 }, { status: 400 })

    const url = String(form.get('url') ?? '').trim()
    const strategy = String(form.get('strategy') ?? '').trim()
    if (!URL.canParse(url) || !strategy)
        return data({ error: 'URL and strategy are required', id }, { status: 400 })
    let config: unknown
    try {
        config = JSON.parse(String(form.get('config') || '{}'))
    } catch {
        return data({ error: 'Config must be valid JSON', id }, { status: 400 })
    }
    const input = {
        url,
        strategy,
        config,
        requiresBrowser: form.get('requiresBrowser') === 'on',
        enabled: form.get('enabled') === 'on',
    }
    const { headers } = await gqlAsViewer(request, UPDATE_SOURCE, { id, input })
    return data({ error: null, id }, { headers })
}

const fmt = (iso: string | null | undefined) => (iso ? iso.replace('T', ' ').slice(0, 16) : '—')
const statusColor = (s: string) => (s === 'OK' ? 'success' : s === 'FAILED' ? 'danger' : 'warning')

export default function AdminScrapers({
    loaderData: { latest, runs, sources },
    actionData,
}: Route.ComponentProps) {
    return (
        <div className="flex flex-col gap-8">
            <section className="flex flex-col gap-2">
                <h2 className="text-lg font-medium">Latest scrape per team</h2>
                <div className="table-wrap">
                    <RunsTable runs={latest} />
                </div>
                <details>
                    <summary className="cursor-pointer text-sm text-default-500">
                        Last {runs.length} runs
                    </summary>
                    <div className="table-wrap mt-2">
                        <RunsTable runs={runs} />
                    </div>
                </details>
            </section>

            <section className="flex flex-col gap-4">
                <h2 className="text-lg font-medium">Team sources</h2>
                {sources.map((s) => {
                    const mine = actionData?.id === s.id
                    return (
                        <Form
                            key={s.id}
                            method="post"
                            className={`team-${s.team.slug} flex flex-col gap-2 rounded border border-default-200 p-3`}
                        >
                            <input type="hidden" name="id" value={s.id} />
                            <h3 className="font-medium">
                                <span className="team-link">{s.team.name}</span>{' '}
                                <span className="text-sm text-default-500">{s.kind}</span>
                            </h3>
                            <p className="text-xs text-default-500">
                                Last OK {fmt(s.lastOkAt)} · items {s.lastItemCount ?? '—'}
                                {s.lastError && (
                                    <span className="text-danger"> · {s.lastError}</span>
                                )}
                            </p>
                            {mine && actionData?.error && (
                                <Alert status="danger" role="alert">
                                    <Alert.Content>
                                        <Alert.Title>{actionData.error}</Alert.Title>
                                    </Alert.Content>
                                </Alert>
                            )}
                            {mine && !actionData?.error && (
                                <Alert status="success" role="status">
                                    <Alert.Content>
                                        <Alert.Title>Saved</Alert.Title>
                                    </Alert.Content>
                                </Alert>
                            )}
                            <div className="grid gap-2 sm:grid-cols-2">
                                <label className="flex flex-col text-sm">
                                    <span className="text-default-500">URL</span>
                                    <input
                                        name="url"
                                        type="url"
                                        required
                                        defaultValue={s.url}
                                        className="input input--primary"
                                    />
                                </label>
                                <label className="flex flex-col text-sm">
                                    <span className="text-default-500">Strategy</span>
                                    <input
                                        name="strategy"
                                        required
                                        defaultValue={s.strategy}
                                        className="input input--primary"
                                    />
                                </label>
                                <label className="flex flex-col text-sm sm:col-span-2">
                                    <span className="text-default-500">Config (JSON)</span>
                                    <textarea
                                        name="config"
                                        rows={3}
                                        defaultValue={JSON.stringify(s.config, null, 2)}
                                        className="input input--primary font-mono text-xs"
                                    />
                                </label>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-sm">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name="requiresBrowser"
                                        defaultChecked={s.requiresBrowser}
                                    />
                                    Requires browser
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name="enabled"
                                        defaultChecked={s.enabled}
                                    />
                                    Enabled
                                </label>
                                <Button
                                    type="submit"
                                    size="sm"
                                    variant="primary"
                                    className="ml-auto"
                                >
                                    Save
                                </Button>
                            </div>
                        </Form>
                    )
                })}
            </section>
        </div>
    )
}

function RunsTable({ runs }: { runs: Route.ComponentProps['loaderData']['runs'] }) {
    return (
        <table className="data-table">
            <thead>
                <tr>
                    <th>Team</th>
                    <th>Status</th>
                    <th className="num">Items</th>
                    <th className="num">Added</th>
                    <th>Started</th>
                    <th>Error</th>
                </tr>
            </thead>
            <tbody>
                {runs.map((r) => (
                    <tr key={r.id} className={r.status === 'OK' ? '' : 'bg-danger/10'}>
                        <td className={`team-${r.team.slug}`}>
                            <span className="team-link">{r.team.abbreviation}</span>
                        </td>
                        <td>
                            <Chip size="sm" color={statusColor(r.status)}>
                                {r.status}
                            </Chip>
                        </td>
                        <td className="num">{r.itemCount ?? '—'}</td>
                        <td className="num">{r.addedCount ?? '—'}</td>
                        <td>{fmt(r.startedAt)}</td>
                        <td className="whitespace-normal text-xs text-danger">{r.error}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
