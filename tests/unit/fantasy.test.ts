import { describe, expect, it, vi } from 'vitest'
import { gqlAnonymous } from '~/lib/gql.server'
import { loader } from '~/routes/fantasy._index'

const player = (id: number, over: Record<string, unknown>) => ({
    id,
    name: `P${id}`,
    position: 'WIDE_RECEIVER',
    team: null,
    salary: 5000,
    weekSalaryChange: 0,
    gameZoneProjection: null,
    seasonPoints: null,
    avgPoints: null,
    lastGameweekPoints: null,
    isLocked: false,
    injuredText: null,
    status: null,
    value: null,
    projection: null,
    ...over,
})

const run = (qs: string) =>
    loader({ request: new Request(`http://x/fantasy${qs}`), params: {}, context: {} } as never)

describe('fantasy loader', () => {
    it('defaults to the first incomplete gameweek and sorts by salary', async () => {
        vi.mocked(gqlAnonymous).mockResolvedValueOnce({
            seasons: [2026],
            teams: [],
            gameweeks: [
                { id: 1, week: 1, name: 'GW1', status: 'complete', startDate: null },
                { id: 2, week: 2, name: 'GW2', status: 'scheduled', startDate: null },
            ],
            fantasyPlayers: [player(1, { salary: 4000 }), player(2, { salary: 9000 })],
        })
        const r = await run('?year=2026')
        expect(r.selected?.id).toBe(2)
        expect(r.sort).toBe('salary')
        expect(r.rows.map((p) => p.id)).toEqual([2, 1])
        expect(vi.mocked(gqlAnonymous).mock.calls.at(-1)?.[1]).toMatchObject({
            year: 2026,
            gameweekId: null,
            position: null,
            teamSlug: null,
        })
    })

    it('only honours whitelisted sort keys and positions, nulls last', async () => {
        vi.mocked(gqlAnonymous).mockResolvedValueOnce({
            seasons: [2026],
            teams: [],
            gameweeks: [],
            fantasyPlayers: [
                player(1, { value: null }),
                player(2, { value: 1.5 }),
                player(3, { value: 2.5 }),
            ],
        })
        const r = await run('?sort=value&pos=QUARTERBACK&gw=7')
        expect(r.rows.map((p) => p.id)).toEqual([3, 2, 1])
        expect(vi.mocked(gqlAnonymous).mock.calls.at(-1)?.[1]).toMatchObject({
            gameweekId: 7,
            position: 'QUARTERBACK',
        })

        vi.mocked(gqlAnonymous).mockResolvedValueOnce({
            seasons: [],
            teams: [],
            gameweeks: [],
            fantasyPlayers: [],
        })
        const bad = await run('?sort=__proto__&pos=KICKER&gw=abc')
        expect(bad.sort).toBe('salary')
        expect(bad.position).toBeNull()
        expect(vi.mocked(gqlAnonymous).mock.calls.at(-1)?.[1]).toMatchObject({
            gameweekId: null,
            position: null,
        })
    })
})
