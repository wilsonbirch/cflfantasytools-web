import { describe, expect, it, vi } from 'vitest'
import { gqlAsViewer } from '~/lib/gql.server'
import { action } from '~/routes/admin.staff'

vi.mock('~/lib/auth.server', () => ({ requireAdmin: vi.fn(async () => ({})) }))

const post = (fields: Record<string, string>) => {
    const body = new FormData()
    for (const [k, v] of Object.entries(fields)) body.set(k, v)
    return new Request('http://x/admin/staff', { method: 'POST', body })
}
const run = (fields: Record<string, string>) =>
    action({ request: post(fields), params: {}, context: {} } as never)

describe('admin staff action', () => {
    it('rejects an upsert missing its natural key', async () => {
        const res = (await run({ intent: 'upsert', teamSlug: 'bc-lions', role: 'HC' })) as never
        expect(res).toMatchObject({ init: { status: 400 } })
        expect(gqlAsViewer).not.toHaveBeenCalled()
    })

    it('turns the date inputs into DateTimes and leaves an open end date null', async () => {
        await run({
            intent: 'upsert',
            teamSlug: 'bc-lions',
            role: 'OC',
            person: 'Jordan Maksymic',
            effectiveFrom: '2026-01-15',
            effectiveTo: '',
        })
        expect(vi.mocked(gqlAsViewer).mock.calls[0][2]).toEqual({
            input: {
                teamSlug: 'bc-lions',
                role: 'OC',
                person: 'Jordan Maksymic',
                effectiveFrom: '2026-01-15T00:00:00.000Z',
                effectiveTo: null,
            },
        })
    })
})
