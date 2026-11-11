import { describe, expect, it, vi } from 'vitest'
import { gqlAnonymous } from '~/lib/gql.server'
import { action, loader } from '~/routes/login'
import { action as registerAction } from '~/routes/register'

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

    it.each([
        '%2F%5Cevil.test%2Fteams',
        '%2F%09%2Fevil.test',
        '%2F%2E%2E%2F%2Fevil.test',
        '%2F%252F%2Fevil.test',
    ])('falls back to / for the normalisation trick redirectTo=%s', async (q) => {
        const href = `http://x/login?redirectTo=${q}`
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

    // `/\evil.test` (read as `//evil.test`) and a raw tab before the host
    // (stripped by Chromium on a no-JS login) were the real off-site redirects.
    // `Headers` refuses LF, so `/\n/…` could never reach a Location header, and
    // `/..//evil.test` stays on-site as a raw Location; it is here because
    // safeRedirect returns the normalised path, which would be `//evil.test`.
    it.each(['/\\evil.test/teams', '/\t/evil.test', '/\n/evil.test', '/..//evil.test'])(
        'sends a successful login with redirectTo %j to / instead',
        async (redirectTo) => {
            vi.mocked(gqlAnonymous).mockResolvedValueOnce({ login: tokens })
            const res = await post({
                email: 'a@b.c',
                password: 'correct horse battery',
                redirectTo,
            }).catch((e) => e)
            expect(res).toBeInstanceOf(Response)
            expect(res.status).toBe(302)
            expect(res.headers.get('Location')).toBe('/')
        },
    )

    it('echoes only the safe fallback back into the form on a failed login', async () => {
        vi.mocked(gqlAnonymous).mockRejectedValueOnce(new Error('bad credentials'))
        const res = await post({
            email: 'a@b.c',
            password: 'wrong horse battery',
            redirectTo: '/\\evil.test',
        })
        expect(res).toMatchObject({ data: { redirectTo: '/' }, init: { status: 401 } })
    })
})

describe('register action', () => {
    it('never redirects off-site via backslash normalisation', async () => {
        vi.mocked(gqlAnonymous).mockResolvedValueOnce({ register: tokens })
        const body = new FormData()
        body.set('email', 'a@b.c')
        body.set('password', 'correct horse battery')
        body.set('redirectTo', '/\\evil.test/teams')
        const request = new Request('http://x/register.data', { method: 'POST', body })
        const res = await registerAction({
            request,
            url: new URL('http://x/register'),
            params: {},
            context: {},
        } as never).catch((e) => e)
        expect(res).toBeInstanceOf(Response)
        expect(res.headers.get('Location')).toBe('/')
    })
})
