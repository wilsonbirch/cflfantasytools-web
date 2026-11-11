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
    // Values as safeRedirect receives them: URLSearchParams and FormData have
    // already percent-decoded them once, so `%5C` in the address bar is `\` here.
    it.each([
        ['non-string', 42],
        ['null', null],
        ['undefined', undefined],
        ['a File', new File([''], 'x')],
        ['empty', ''],
        ['relative path', 'teams'],
        ['protocol-relative', '//evil.test'],
        ['protocol-relative with path', '//evil.test/teams'],
        ['triple slash', '///evil.test'],
        ['backslash after slash', '/\\evil.test'],
        ['backslash after slash, with path', '/\\evil.test/teams'],
        ['double backslash', '/\\\\evil.test'],
        ['backslash later in the path', '/teams\\x'],
        ['tab between slashes', '/\t/evil.test'],
        ['newline between slashes', '/\n/evil.test'],
        ['carriage return between slashes', '/\r/evil.test'],
        ['NUL', '/\0/evil.test'],
        ['DEL', '/\x7f/evil.test'],
        ['leading space', ' /teams'],
        ['trailing space', '/teams '],
        ['leading tab', '\t/teams'],
        ['inner space', '/teams /evil'],
        ['non-breaking space', '/ /evil.test'],
        ['line separator', '/ /evil.test'],
        ['https URL', 'https://evil.test'],
        ['scheme-relative http', 'http:evil.test'],
        ['javascript URL', 'javascript:alert(1)'],
        ['data URL', 'data:text/html,<script>alert(1)</script>'],
        ['encoded double slash', '/%2F/evil.test'],
        ['encoded double slash at the start', '%2F%2Fevil.test'],
        ['encoded backslash', '/%5Cevil.test'],
        ['encoded backslash in the query', '/teams?x=%5C'],
        ['encoded tab', '/%09/evil.test'],
        ['encoded newline', '/%0A/evil.test'],
        ['encoded NUL', '/%00'],
        ['malformed escape', '/teams%'],
        ['dot segments collapsing to //', '/..//evil.test'],
        ['single dot collapsing to //', '/.//evil.test'],
        ['encoded dot segments collapsing to //', '/%2e%2e//evil.test'],
        ['nested dot segments collapsing to //', '/a/..//evil.test'],
        // Accepted as input, but normalise to a value safeRedirect itself rejects.
        ['dot segment exposing an encoded slash', '/./%2Fevil.test/x'],
        ['encoded dot segments exposing an encoded slash', '/x/%2e%2e/%2Fevil.test/x'],
        ['dot segment exposing encoded double slash', '/./%2f%2fevil.test/x'],
        ['over 2048 characters', '/' + 'a'.repeat(2048)],
    ])('rejects %s', (_, to) => {
        expect(safeRedirect(to)).toBe('/')
        expect(safeRedirect(to, '/account')).toBe('/account')
    })

    it.each([
        ['root', '/', '/'],
        ['plain path', '/teams', '/teams'],
        ['nested path', '/teams/bc-lions/2026', '/teams/bc-lions/2026'],
        ['query string', '/account?tab=email', '/account?tab=email'],
        ['index param', '/teams?index', '/teams?index'],
        ['hash', '/games/12#plays', '/games/12#plays'],
        ['query and hash', '/stats?y=2026&w=3#top', '/stats?y=2026&w=3#top'],
        [
            'encoded characters',
            '/fantasy/players/J%C3%A9r%C3%B4me',
            '/fantasy/players/J%C3%A9r%C3%B4me',
        ],
        ['encoded space in the query', '/teams?q=bc%20lions', '/teams?q=bc%20lions'],
        ['encoded slash inside a segment', '/teams/a%2Fb', '/teams/a%2Fb'],
        ['requireUser round trip', '/teams/bc-lions?y=2026', '/teams/bc-lions?y=2026'],
        ['harmless dot segments, normalised', '/teams/../account', '/account'],
        ['exactly 2048 characters', '/' + 'a'.repeat(2047), '/' + 'a'.repeat(2047)],
    ])('accepts %s', (_, to, expected) => {
        expect(safeRedirect(to)).toBe(expected)
    })
})
