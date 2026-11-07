import { describe, expect, it, vi } from 'vitest'
import { gqlAnonymous } from '~/lib/gql.server'
import { action, loader } from '~/routes/login'

const tokens = {
    accessToken: 'a',
    refreshToken: 'r',
    accessTokenExpiresAt: '2030-01-01T00:00:00.000Z',
}

describe('login loader', () => {
    it('reads redirectTo from the normalized url, not the raw .data request', async () => {
        const raw = new Request('http://x/login.data?redirectTo=%2Fteams&_routes=routes%2Flogin')
        const result = await loader({
            request: raw,
            url: new URL('http://x/login?redirectTo=%2Fteams'),
            params: {},
            context: {},
        } as never)
        expect(result).toEqual({ redirectTo: '/teams' })
    })

    it('falls back to / for an off-site redirectTo', async () => {
        const href = 'http://x/login?redirectTo=%2F%2Fevil.example'
        const result = await loader({
            request: new Request(href),
            url: new URL(href),
            params: {},
            context: {},
        } as never)
        expect(result).toEqual({ redirectTo: '/' })
    })
})

describe('login action', () => {
    const post = (fields: Record<string, string>) => {
        const body = new FormData()
        for (const [k, v] of Object.entries(fields)) body.set(k, v)
        const request = new Request('http://x/login.data', { method: 'POST', body })
        return action({ request, url: new URL('http://x/login'), params: {}, context: {} } as never)
    }

    it('sends the user to the page they asked for, with the session cookie', async () => {
        vi.mocked(gqlAnonymous).mockResolvedValueOnce({ login: tokens })
        const res = await post({
            email: 'a@b.c',
            password: 'correct horse battery',
            redirectTo: '/account?tab=email',
        }).catch((e) => e)
        expect(res).toBeInstanceOf(Response)
        expect(res.status).toBe(302)
        expect(res.headers.get('Location')).toBe('/account?tab=email')
        expect(res.headers.get('Set-Cookie')).toMatch(/^_session=/)
    })

    it('never redirects off-site', async () => {
        vi.mocked(gqlAnonymous).mockResolvedValueOnce({ login: tokens })
        const res = await post({
            email: 'a@b.c',
            password: 'correct horse battery',
            redirectTo: 'https://evil.example/',
        }).catch((e) => e)
        expect(res.headers.get('Location')).toBe('/')
    })
})
