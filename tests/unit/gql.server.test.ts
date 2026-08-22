import { describe, expect, it, vi, beforeEach } from 'vitest'

// The real module, not the setup-file mock — this file is testing it.
vi.unmock('~/lib/gql.server')

const request = vi.fn()
vi.mock('graphql-request', () => ({
    GraphQLClient: class {
        constructor(
            public url: string,
            public options?: { headers?: Record<string, string> },
        ) {}
        request(...args: unknown[]) {
            return request(this.options?.headers, ...args)
        }
    },
}))

process.env.SESSION_SECRET = 'test-session-secret'

const { gqlAnonymous, gqlAsViewer, tokensFrom } = await import('~/lib/gql.server')
const { commitSession, getSession } = await import('~/lib/session.server')

beforeEach(() => request.mockReset())

const jwt = (exp: number) => `h.${Buffer.from(JSON.stringify({ exp })).toString('base64url')}.s`

async function requestWithTokens(tokens: {
    accessToken: string
    refreshToken: string
    accessTokenExpiresAt: number
}) {
    const session = await getSession(new Request('http://x/'))
    session.set('tokens', tokens)
    const cookie = (await commitSession(session)).split(';')[0]
    return new Request('http://x/', { headers: { Cookie: cookie } })
}

describe('gqlAnonymous', () => {
    it('sends no authorization header', async () => {
        request.mockResolvedValue({ isUp: true })
        await gqlAnonymous('{ isUp }')
        const [headers] = request.mock.calls[0]
        expect(headers?.authorization).toBeUndefined()
    })

    it('returns the api payload unwrapped', async () => {
        request.mockResolvedValue({ isUp: true })
        await expect(gqlAnonymous<{ isUp: boolean }>('{ isUp }')).resolves.toEqual({ isUp: true })
    })
})

describe('tokensFrom', () => {
    it('reads the expiry from the JWT exp claim', () => {
        const exp = Math.floor(Date.now() / 1000) + 600
        expect(tokensFrom({ accessToken: jwt(exp), refreshToken: 'r' }).accessTokenExpiresAt).toBe(
            exp * 1000,
        )
    })

    it('falls back to a default ttl when the token is opaque', () => {
        const { accessTokenExpiresAt } = tokensFrom({ accessToken: 'opaque', refreshToken: 'r' })
        expect(accessTokenExpiresAt).toBeGreaterThan(Date.now())
    })
})

describe('gqlAsViewer', () => {
    it('sends the bearer token and no cookie when the token is fresh', async () => {
        request.mockResolvedValue({ me: null })
        const req = await requestWithTokens({
            accessToken: 'a1',
            refreshToken: 'r1',
            accessTokenExpiresAt: Date.now() + 600_000,
        })
        const { headers } = await gqlAsViewer(req, '{ me { email } }')
        expect(request.mock.calls[0][0]).toEqual({ authorization: 'Bearer a1' })
        expect(headers).toBeUndefined()
    })

    it('rotates once for parallel loaders and returns a Set-Cookie', async () => {
        request.mockImplementation(async (headers) => {
            if (!headers) return { refresh: { accessToken: 'a2', refreshToken: 'r2' } }
            return { me: { email: 'x' } }
        })
        const req = await requestWithTokens({
            accessToken: 'a1',
            refreshToken: 'r1',
            accessTokenExpiresAt: Date.now() + 1_000,
        })
        const results = await Promise.all([
            gqlAsViewer(req, '{ me { email } }'),
            gqlAsViewer(req, '{ me { email } }'),
        ])
        const refreshCalls = request.mock.calls.filter(([h]) => h === undefined)
        expect(refreshCalls).toHaveLength(1)
        for (const r of results) {
            expect(r.headers).toEqual({ 'Set-Cookie': expect.stringContaining('_session=') })
        }
        const bearer = request.mock.calls.filter(([h]) => h).map(([h]) => h.authorization)
        expect(bearer).toEqual(['Bearer a2', 'Bearer a2'])
    })

    it('falls back to anonymous and clears the cookie when refresh is rejected', async () => {
        request.mockImplementationOnce(async () => {
            throw new Error('revoked')
        })
        request.mockResolvedValue({ isUp: true })
        const req = await requestWithTokens({
            accessToken: 'a1',
            refreshToken: 'r-dead',
            accessTokenExpiresAt: 0,
        })
        const { headers } = await gqlAsViewer(req, '{ isUp }')
        expect(headers).toEqual({
            'Set-Cookie': expect.stringContaining('Expires=Thu, 01 Jan 1970'),
        })
        // Second call was the anonymous fallback.
        expect(request.mock.calls[1][0]).toBeUndefined()
    })
})
