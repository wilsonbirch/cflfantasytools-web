import { Button } from '@heroui/react'
import { data, Form } from 'react-router'
import type { Route } from './+types/admin.staff'
import { graphql } from '~/graphql/generated'
import { CoachingRole } from '~/graphql/generated/graphql'
import { requireAdmin } from '~/lib/auth.server'
import { fmtDate } from '~/lib/format'
import { gqlAsViewer } from '~/lib/gql.server'

const STAFF = graphql(`
    query AdminStaff {
        teams {
            slug
            name
            abbreviation
            coachingStaff {
                id
                role
                person
                effectiveFrom
                effectiveTo
            }
        }
    }
`)

const UPSERT = graphql(`
    mutation UpsertCoachingStaff($input: CoachingStaffInput!) {
        upsertCoachingStaff(input: $input) {
            id
        }
    }
`)

const DELETE = graphql(`
    mutation DeleteCoachingStaff($id: Int!) {
        deleteCoachingStaff(id: $id)
    }
`)

const ROLES = Object.values(CoachingRole)
const isRole = (r: unknown): r is CoachingRole => ROLES.includes(r as CoachingRole)
const RANK = { HC: 0, OC: 1, DC: 2 }

/** <input type="date"> gives YYYY-MM-DD; the api wants a DateTime. */
const toDateTime = (v: FormDataEntryValue | null) =>
    typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) ? `${v}T00:00:00.000Z` : null

export async function loader({ request }: Route.LoaderArgs) {
    await requireAdmin(request)
    const { data: d, headers } = await gqlAsViewer(request, STAFF)
    const rows = d.teams
        .flatMap((t) => t.coachingStaff.map((s) => ({ ...s, team: t })))
        .sort(
            (a, b) =>
                a.team.name.localeCompare(b.team.name) ||
                RANK[a.role] - RANK[b.role] ||
                b.effectiveFrom.localeCompare(a.effectiveFrom),
        )
    return data({ teams: d.teams, rows }, { headers })
}

export async function action({ request }: Route.ActionArgs) {
    await requireAdmin(request)
    const form = await request.formData()
    const intent = form.get('intent')

    if (intent === 'delete') {
        const id = Number(form.get('id'))
        if (!Number.isInteger(id) || id <= 0) return data({ error: 'Bad id' }, { status: 400 })
        const { headers } = await gqlAsViewer(request, DELETE, { id })
        return data({ error: null }, { headers })
    }

    const role = form.get('role')
    const teamSlug = String(form.get('teamSlug') ?? '')
    const person = String(form.get('person') ?? '').trim()
    const effectiveFrom = toDateTime(form.get('effectiveFrom'))
    const effectiveTo = toDateTime(form.get('effectiveTo'))
    if (!isRole(role) || !teamSlug || !person || !effectiveFrom)
        return data({ error: 'Team, role, person and start date are required' }, { status: 400 })
    const { headers } = await gqlAsViewer(request, UPSERT, {
        input: { teamSlug, role, person, effectiveFrom, effectiveTo },
    })
    return data({ error: null }, { headers })
}

export default function AdminStaff({
    loaderData: { teams, rows },
    actionData,
}: Route.ComponentProps) {
    return (
        <div className="flex flex-col gap-6">
            <section className="flex flex-col gap-2">
                <h2 className="text-lg font-medium">Add staff</h2>
                <p className="text-sm text-default-500">
                    Same team, role, person and start date updates the row; co-coordinators are two
                    rows.
                </p>
                <Form method="post" className="flex flex-wrap items-end gap-3">
                    <label className="flex flex-col text-sm">
                        <span className="text-default-500">Team</span>
                        <select name="teamSlug" required className="input input--primary">
                            {teams.map((t) => (
                                <option key={t.slug} value={t.slug}>
                                    {t.name}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="flex flex-col text-sm">
                        <span className="text-default-500">Role</span>
                        <select name="role" required className="input input--primary">
                            {ROLES.map((r) => (
                                <option key={r} value={r}>
                                    {r}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="flex flex-col text-sm">
                        <span className="text-default-500">Person</span>
                        <input name="person" required className="input input--primary" />
                    </label>
                    <label className="flex flex-col text-sm">
                        <span className="text-default-500">From</span>
                        <input
                            name="effectiveFrom"
                            type="date"
                            required
                            className="input input--primary"
                        />
                    </label>
                    <label className="flex flex-col text-sm">
                        <span className="text-default-500">To</span>
                        <input name="effectiveTo" type="date" className="input input--primary" />
                    </label>
                    <Button type="submit" name="intent" value="upsert" size="sm" variant="primary">
                        Save
                    </Button>
                </Form>
                {actionData?.error && (
                    <p role="alert" className="text-sm text-danger">
                        {actionData.error}
                    </p>
                )}
            </section>

            <section className="flex flex-col gap-2">
                <h2 className="text-lg font-medium">All staff</h2>
                <div className="table-wrap">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Team</th>
                                <th>Role</th>
                                <th>Person</th>
                                <th>From</th>
                                <th>To</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((s) => (
                                <tr key={s.id}>
                                    <td className={`team-${s.team.slug}`}>
                                        <span className="team-link">{s.team.abbreviation}</span>
                                    </td>
                                    <td>{s.role}</td>
                                    <td>{s.person}</td>
                                    <td>{fmtDate(s.effectiveFrom)}</td>
                                    <td colSpan={2}>
                                        {/* One form per row: editing the end date re-upserts on the natural key. */}
                                        <Form method="post" className="flex items-center gap-2">
                                            <input type="hidden" name="id" value={s.id} />
                                            <input
                                                type="hidden"
                                                name="teamSlug"
                                                value={s.team.slug}
                                            />
                                            <input type="hidden" name="role" value={s.role} />
                                            <input type="hidden" name="person" value={s.person} />
                                            <input
                                                type="hidden"
                                                name="effectiveFrom"
                                                value={fmtDate(s.effectiveFrom)}
                                            />
                                            <input
                                                name="effectiveTo"
                                                type="date"
                                                aria-label={`End date for ${s.person}`}
                                                defaultValue={
                                                    s.effectiveTo ? fmtDate(s.effectiveTo) : ''
                                                }
                                                className="input input--primary"
                                            />
                                            <Button
                                                type="submit"
                                                name="intent"
                                                value="upsert"
                                                size="sm"
                                                variant="secondary"
                                            >
                                                Save
                                            </Button>
                                            <Button
                                                type="submit"
                                                name="intent"
                                                value="delete"
                                                size="sm"
                                                variant="danger"
                                            >
                                                Delete
                                            </Button>
                                        </Form>
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
