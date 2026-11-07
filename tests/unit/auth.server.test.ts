import { describe, expect, it, vi } from 'vitest'
import { gqlAsViewer } from '~/lib/gql.server'
import { commitSession, getSession } from '~/lib/session.server'
import { requireAdmin, requireUser, safeRedirect } from '~/lib/auth.server'

const mocked = vi.mocked(gqlAsViewer)

async function signedIn(path = '/account') {
    const session = await getSession(new Request('http://x/'))
    session.set('tokens', { accessToken: 'a', refreshToken: 'r', accessTokenExpiresAt: 1 })
    const cookie = (await commitSession(session)).split(';')[0]
    return new Request(`http://x${path}`, { headers: { Cookie: cookie } })
}

describe('requireUser', () => {
    it('redirects to login with the original path when there is no session', async () => {
        const href = 'http://x/teams/bc-lions?y=2026'
        const err = await requireUser(new Request(href), new URL(href)).catch((e) => e)
        expect(err).toBeInstanceOf(Response)
        expect(err.headers.get('Location')).toBe('/login?redirectTo=%2Fteams%2Fbc-lions%3Fy%3D2026')
        expect(mocked).not.toHaveBeenCalled()
    })

    it('returns to the page, not the .data fetch, after a client-side navigation', async () => {
        // With v8_passThroughRequests (v8's default) a <Link> to /account reaches
        // the loader as the raw single-fetch request; `url` is the page itself.
        const raw = new Request('http://x/account.data?tab=email&_routes=root%2Croutes%2Faccount')
        const err = await requireUser(raw, new URL('http://x/account?tab=email')).catch((e) => e)
        expect(err.headers.get('Location')).toBe('/login?redirectTo=%2Faccount%3Ftab%3Demail')
    })

    it('returns the viewer when me resolves', async () => {
        mocked.mockResolvedValueOnce({ data: { me: { email: 'a@b.c', role: 'USER' } } })
        await expect(
            requireUser(await signedIn(), new URL('http://x/account')),
        ).resolves.toMatchObject({
            viewer: { email: 'a@b.c' },
        })
    })
})

describe('requireAdmin', () => {
    it('throws 403 for a plain user', async () => {
        mocked.mockResolvedValueOnce({ data: { me: { email: 'a@b.c', role: 'USER' } } })
        const err = await requireAdmin(await signedIn('/admin'), new URL('http://x/admin')).catch(
            (e) => e,
        )
        expect(err.init.status).toBe(403)
    })
})

describe('safeRedirect', () => {
    it('only allows same-origin paths', () => {
        expect(safeRedirect('/teams')).toBe('/teams')
        expect(safeRedirect('//evil.example')).toBe('/')
        expect(safeRedirect('https://evil.example')).toBe('/')
        expect(safeRedirect(null)).toBe('/')
    })
})
