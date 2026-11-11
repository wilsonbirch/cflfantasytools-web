import { print } from 'graphql'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { LoginDocument } from '~/graphql/generated/graphql'

// The real module, not the setup-file mock — this file is testing it, and the
// routes imported below get the real client too, so their catch paths run
// against real thrown errors.
vi.unmock('~/lib/gql.server')

// The api boundary is `fetch` itself; nothing here reaches a network.
const fetchMock = vi.fn<typeof fetch>()
vi.stubGlobal('fetch', fetchMock)

process.env.SESSION_SECRET = 'test-session-secret'

const { GraphQLRequestError, gqlAnonymous, gqlAsViewer, tokensFrom } =
    await import('~/lib/gql.server')
const { commitSession, getSession } = await import('~/lib/session.server')

const ENDPOINT = process.env.API_GRAPHQL_URL ?? 'http://localhost:4000/graphql'

/** A graphql-yoga style response. A fresh Response per call: a body reads once. */
const reply = (payload: unknown, status = 200, contentType = 'application/graphql-response+json') =>
    new Response(typeof payload === 'string' ? payload : JSON.stringify(payload), {
        status,
        headers: { 'content-type': `${contentType}; charset=utf-8` },
    })

type Sent = {
    url: string
    method?: string
    headers: Headers
    body: { query: string; variables?: unknown; operationName?: string }
}

function sent(): Sent[] {
    return fetchMock.mock.calls.map(([url, init]) => ({
        url: String(url),
        method: init?.method,
        headers: new Headers(init?.headers),
        body: JSON.parse(String(init?.body)),
    }))
}

const bearerOf = (call: Sent) => call.headers.get('authorization')

// Braces matter: a function returned from beforeEach runs as teardown, and
// mockReset() returns the mock itself.
beforeEach(() => {
    fetchMock.mockReset()
})

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

/** Catch what a promise rejects with, failing the test if it resolves. */
async function rejection(promise: Promise<unknown>): Promise<unknown> {
    return promise.then(
        (value) => {
            throw new Error(`expected a rejection, got ${JSON.stringify(value)}`)
        },
        (e: unknown) => e,
    )
}

describe('wire format (what graphql-request sent)', () => {
    it('POSTs JSON with the accept header yoga negotiates on', async () => {
        fetchMock.mockResolvedValue(reply({ data: { isUp: true } }))
        await gqlAnonymous('{ isUp }')
        const [call] = sent()
        expect(call.url).toBe(ENDPOINT)
        expect(call.method).toBe('POST')
        expect(call.headers.get('content-type')).toBe('application/json')
        expect(call.headers.get('accept')).toBe(
            'application/graphql-response+json, application/json',
        )
    })

    it('prints a generated document and names its operation', async () => {
        fetchMock.mockResolvedValue(reply({ data: { login: null } }))
        const vars = { email: 'a@b.c', password: 'correct horse' }
        await gqlAnonymous(LoginDocument, vars)
        const [{ body }] = sent()
        expect(body).toEqual({
            query: print(LoginDocument),
            variables: vars,
            operationName: 'Login',
        })
        expect(body.query).toContain('mutation Login($email: String!, $password: String!)')
    })

    it('sends a string verbatim, naming the operation only when it has a name', async () => {
        fetchMock.mockImplementation(async () => reply({ data: {} }))
        await gqlAnonymous('query Up { isUp }')
        await gqlAnonymous('{ isUp }')
        const [named, anonymous] = sent()
        expect(named.body).toEqual({ query: 'query Up { isUp }', operationName: 'Up' })
        // No variables and no operationName keys at all, as JSON.stringify drops undefined.
        expect(anonymous.body).toEqual({ query: '{ isUp }' })
    })
})

describe('gqlAnonymous', () => {
    it('sends no authorization header', async () => {
        fetchMock.mockResolvedValue(reply({ data: { isUp: true } }))
        await gqlAnonymous('{ isUp }')
        expect(bearerOf(sent()[0])).toBeNull()
    })

    it('returns the api payload unwrapped', async () => {
        fetchMock.mockResolvedValue(reply({ data: { isUp: true } }))
        await expect(gqlAnonymous<{ isUp: boolean }>('{ isUp }')).resolves.toEqual({ isUp: true })
    })

    it('treats an empty errors array as success', async () => {
        fetchMock.mockResolvedValue(reply({ data: { isUp: true }, errors: [] }))
        await expect(gqlAnonymous('{ isUp }')).resolves.toEqual({ isUp: true })
    })
})

describe('errors throw', () => {
    it('throws on GraphQL errors even when data is present, keeping the api message and code', async () => {
        fetchMock.mockResolvedValue(
            reply({
                data: { me: { email: 'x' }, jobs: null },
                errors: [
                    {
                        message: 'Admin access required',
                        path: ['jobs'],
                        extensions: { code: 'FORBIDDEN' },
                    },
                ],
            }),
        )
        const err = await rejection(gqlAnonymous('{ me { email } jobs { id } }'))
        expect(err).toBeInstanceOf(GraphQLRequestError)
        const e = err as InstanceType<typeof GraphQLRequestError>
        expect(e.message).toBe('Admin access required')
        expect(e.response.status).toBe(200)
        expect(e.response.data).toEqual({ me: { email: 'x' }, jobs: null })
        expect(e.response.errors?.[0].extensions?.code).toBe('FORBIDDEN')
        expect(e.request.query).toBe('{ me { email } jobs { id } }')
    })

    it('does not put variables (passwords, refresh tokens) on the error', async () => {
        fetchMock.mockResolvedValue(
            reply({ data: null, errors: [{ message: 'Invalid email or password' }] }),
        )
        const err = await rejection(
            gqlAnonymous(LoginDocument, { email: 'a@b.c', password: 'hunter2hunter2' }),
        )
        expect(JSON.stringify(err)).not.toContain('hunter2hunter2')
        expect(String(err)).not.toContain('hunter2hunter2')
        expect((err as Error).message).toBe('Invalid email or password')
    })

    it('throws on a non-2xx GraphQL response (yoga request errors), with its errors', async () => {
        fetchMock.mockResolvedValue(
            reply({ errors: [{ message: 'Cannot query field "nope" on type "Query".' }] }, 400),
        )
        const err = (await rejection(gqlAnonymous('{ nope }'))) as InstanceType<
            typeof GraphQLRequestError
        >
        expect(err).toBeInstanceOf(GraphQLRequestError)
        expect(err.response.status).toBe(400)
        expect(err.message).toBe('Cannot query field "nope" on type "Query".')
    })

    it('throws on a non-2xx response with no GraphQL body', async () => {
        fetchMock.mockResolvedValue(reply('<html>bad gateway</html>', 502, 'text/html'))
        const err = (await rejection(gqlAnonymous('{ isUp }'))) as InstanceType<
            typeof GraphQLRequestError
        >
        expect(err).toBeInstanceOf(GraphQLRequestError)
        expect(err.message).toBe('GraphQL Error (Code: 502)')
        expect(err.response.status).toBe(502)
        expect(err.response.body).toBe('<html>bad gateway</html>')
    })

    it('throws on a non-2xx response even when it carries data and no errors', async () => {
        fetchMock.mockResolvedValue(reply({ data: { isUp: true } }, 500))
        const err = (await rejection(gqlAnonymous('{ isUp }'))) as InstanceType<
            typeof GraphQLRequestError
        >
        expect(err.message).toBe('GraphQL Error (Code: 500)')
    })

    it('throws on a 2xx response that is not JSON', async () => {
        fetchMock.mockResolvedValue(reply('ok', 200, 'text/plain'))
        await expect(gqlAnonymous('{ isUp }')).rejects.toThrow(GraphQLRequestError)
    })

    it('throws on a 2xx JSON content type with an unparseable body', async () => {
        fetchMock.mockResolvedValue(reply('{"data":', 200, 'application/json'))
        const err = (await rejection(gqlAnonymous('{ isUp }'))) as Error
        expect(err).toBeInstanceOf(GraphQLRequestError)
        expect(err.cause).toBeInstanceOf(SyntaxError)
    })

    it('throws on a 2xx JSON body that is not a GraphQL result', async () => {
        fetchMock.mockResolvedValue(reply(['not', 'a', 'result']))
        await expect(gqlAnonymous('{ isUp }')).rejects.toThrow(GraphQLRequestError)
        fetchMock.mockResolvedValue(reply({ data: 'nope' }))
        await expect(gqlAnonymous('{ isUp }')).rejects.toThrow(GraphQLRequestError)
    })

    // graphql-request resolved these with undefined or null; yoga never sends them.
    it.each([
        ['{}', {}],
        ['{"errors":[]}', { errors: [] }],
        ['{"extensions":{}}', { extensions: {} }],
        ['{"data":null}', { data: null }],
    ])('throws on a 2xx result with no data: %s', async (_label, payload) => {
        fetchMock.mockResolvedValue(reply(payload))
        const err = await rejection(gqlAnonymous('{ isUp }'))
        expect(err).toBeInstanceOf(GraphQLRequestError)
        expect((err as Error).message).toBe('Invalid GraphQL response: no data')
    })

    it('throws on a 204 with no body', async () => {
        fetchMock.mockResolvedValue(new Response(null, { status: 204 }))
        const err = (await rejection(gqlAnonymous('{ isUp }'))) as InstanceType<
            typeof GraphQLRequestError
        >
        expect(err).toBeInstanceOf(GraphQLRequestError)
        expect(err.message).toBe('Invalid GraphQL response')
        expect(err.response.status).toBe(204)
    })

    it('throws on a 200 with an empty body, with or without a JSON content type', async () => {
        fetchMock.mockResolvedValue(reply('', 200, 'application/json'))
        const typed = await rejection(gqlAnonymous('{ isUp }'))
        expect(typed).toBeInstanceOf(GraphQLRequestError)
        expect((typed as Error).cause).toBeInstanceOf(SyntaxError)
        fetchMock.mockResolvedValue(new Response('', { status: 200 }))
        const untyped = await rejection(gqlAnonymous('{ isUp }'))
        expect(untyped).toBeInstanceOf(GraphQLRequestError)
        expect((untyped as Error).message).toBe('Invalid GraphQL response')
    })

    it('lets a network failure from fetch propagate unchanged', async () => {
        const down = new TypeError('fetch failed')
        fetchMock.mockRejectedValue(down)
        await expect(gqlAnonymous('{ isUp }')).rejects.toBe(down)
    })
})

describe('tokensFrom', () => {
    it('takes the expiry the api states, as epoch ms', () => {
        const at = '2026-08-22T12:00:00.000Z'
        expect(
            tokensFrom({ accessToken: 'opaque', refreshToken: 'r', accessTokenExpiresAt: at })
                .accessTokenExpiresAt,
        ).toBe(Date.parse(at))
    })
})

describe('gqlAsViewer', () => {
    it('sends the bearer token and no cookie when the token is fresh', async () => {
        fetchMock.mockResolvedValue(reply({ data: { me: null } }))
        const req = await requestWithTokens({
            accessToken: 'a1',
            refreshToken: 'r1',
            accessTokenExpiresAt: Date.now() + 600_000,
        })
        const { data, headers } = await gqlAsViewer(req, '{ me { email } }')
        expect(data).toEqual({ me: null })
        expect(bearerOf(sent()[0])).toBe('Bearer a1')
        expect(headers).toBeUndefined()
    })

    it('throws the api error to the caller when the viewer operation fails', async () => {
        fetchMock.mockResolvedValue(
            reply({
                data: null,
                errors: [
                    {
                        message: 'You must be signed in to do that',
                        extensions: { code: 'UNAUTHENTICATED' },
                    },
                ],
            }),
        )
        const req = await requestWithTokens({
            accessToken: 'a1',
            refreshToken: 'r1',
            accessTokenExpiresAt: Date.now() + 600_000,
        })
        await expect(gqlAsViewer(req, '{ mySubscriptions { enabled } }')).rejects.toThrow(
            'You must be signed in to do that',
        )
    })

    it('rotates once for parallel loaders and returns a Set-Cookie', async () => {
        fetchMock.mockImplementation(async (_url, init) => {
            if (!new Headers(init?.headers).has('authorization'))
                return reply({
                    data: {
                        refresh: {
                            accessToken: 'a2',
                            refreshToken: 'r2',
                            accessTokenExpiresAt: new Date(Date.now() + 600_000).toISOString(),
                        },
                    },
                })
            return reply({ data: { me: { email: 'x' } } })
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
        const refreshCalls = sent().filter((c) => bearerOf(c) === null)
        expect(refreshCalls).toHaveLength(1)
        expect(refreshCalls[0].body.operationName).toBe('Refresh')
        expect(refreshCalls[0].body.variables).toEqual({ refreshToken: 'r1' })
        for (const r of results) {
            expect(r.headers).toEqual({ 'Set-Cookie': expect.stringContaining('_session=') })
        }
        const bearer = sent()
            .map(bearerOf)
            .filter((h) => h !== null)
        expect(bearer).toEqual(['Bearer a2', 'Bearer a2'])
    })

    // rotate() relies on the client throwing to destroy a dead session. Each
    // way the Refresh mutation can fail must end the same way.
    const deadRefresh: [string, () => Promise<Response>][] = [
        [
            'a GraphQL error (revoked or reused token)',
            async () =>
                reply({
                    data: null,
                    errors: [
                        {
                            message: 'Refresh token is invalid or expired',
                            extensions: { code: 'UNAUTHENTICATED' },
                        },
                    ],
                }),
        ],
        [
            // Only the error policy can catch this one: the data alone would
            // pass for a successful rotation.
            'a GraphQL error alongside complete data',
            async () =>
                reply({
                    data: {
                        refresh: {
                            accessToken: 'a-bogus',
                            refreshToken: 'r-bogus',
                            accessTokenExpiresAt: new Date(Date.now() + 600_000).toISOString(),
                        },
                    },
                    errors: [{ message: 'Refresh token is invalid or expired' }],
                }),
        ],
        ['an HTTP 500', async () => reply('Internal Server Error', 500, 'text/plain')],
        [
            'a network failure',
            async () => {
                throw new TypeError('fetch failed')
            },
        ],
    ]
    it.each(deadRefresh)(
        'falls back to anonymous and clears the cookie when refresh fails with %s',
        async (label, refreshResponse) => {
            fetchMock.mockImplementationOnce(refreshResponse)
            fetchMock.mockImplementation(async () => reply({ data: { isUp: true } }))
            const req = await requestWithTokens({
                accessToken: 'a1',
                // Unique per case: rotations are shared by refresh token for 30s.
                refreshToken: `r-dead-${label}`,
                accessTokenExpiresAt: 0,
            })
            const { data, headers } = await gqlAsViewer(req, '{ isUp }')
            expect(data).toEqual({ isUp: true })
            expect(headers).toEqual({
                'Set-Cookie': expect.stringContaining('Expires=Thu, 01 Jan 1970'),
            })
            // Second call was the anonymous fallback.
            const calls = sent()
            expect(calls).toHaveLength(2)
            expect(calls[0].body.operationName).toBe('Refresh')
            expect(bearerOf(calls[1])).toBeNull()
        },
    )
})

// Every route that catches a gql error, run against the real client. None of
// them reads anything off the error; each maps any failure to its own outcome.
describe('callers that catch api errors', () => {
    const apiError = (message: string, code: string) =>
        fetchMock.mockImplementation(async () =>
            reply({ data: null, errors: [{ message, extensions: { code } }] }),
        )
    const post = (fields: Record<string, string>, path: string, cookie?: string) => {
        const body = new FormData()
        for (const [k, v] of Object.entries(fields)) body.set(k, v)
        return new Request(`http://x${path}`, {
            method: 'POST',
            body,
            headers: cookie ? { Cookie: cookie } : undefined,
        })
    }
    const tokens = {
        accessToken: 'a',
        refreshToken: 'r',
        accessTokenExpiresAt: '2030-01-01T00:00:00.000Z',
    }
    const args = (request: Request, path: string) =>
        ({ request, url: new URL(`http://x${path}`), params: {}, context: {} }) as never

    it('login shows "Invalid email or password" when the api rejects the credentials', async () => {
        const { action } = await import('~/routes/login')
        apiError('Invalid email or password', 'UNAUTHENTICATED')
        const res = await action(
            args(post({ email: 'a@b.c', password: 'wrong password' }, '/login'), '/login'),
        )
        expect(res).toMatchObject({
            init: { status: 401 },
            data: { error: 'Invalid email or password', redirectTo: '/' },
        })
    })

    it('login refuses when the api reports an error alongside a token payload', async () => {
        const { action } = await import('~/routes/login')
        fetchMock.mockResolvedValue(
            reply({
                data: { login: tokens },
                errors: [{ message: 'Invalid email or password' }],
            }),
        )
        const res = await action(
            args(post({ email: 'a@b.c', password: 'wrong password' }, '/login'), '/login'),
        )
        expect(res).toMatchObject({ init: { status: 401 } })
    })

    it('login shows the same message when the api is down', async () => {
        const { action } = await import('~/routes/login')
        fetchMock.mockRejectedValue(new TypeError('fetch failed'))
        const res = await action(
            args(post({ email: 'a@b.c', password: 'wrong password' }, '/login'), '/login'),
        )
        expect(res).toMatchObject({ init: { status: 401 } })
    })

    it('register shows its message when the api refuses the email', async () => {
        const { action } = await import('~/routes/register')
        apiError('An account with that email already exists', 'BAD_USER_INPUT')
        const res = await action(
            args(post({ email: 'a@b.c', password: 'long enough' }, '/register'), '/register'),
        )
        expect(res).toMatchObject({
            init: { status: 400 },
            data: { error: 'Could not register with that email' },
        })
    })

    it('logout still clears the cookie when the api rejects the revoke', async () => {
        const { action } = await import('~/routes/logout')
        apiError('Refresh token is invalid or expired', 'UNAUTHENTICATED')
        const req = await requestWithTokens({
            accessToken: 'a1',
            refreshToken: 'r1',
            accessTokenExpiresAt: Date.now() + 600_000,
        })
        const cookie = req.headers.get('Cookie') ?? undefined
        const res = (await action(args(post({}, '/logout', cookie), '/logout')).catch(
            (e: unknown) => e,
        )) as Response
        expect(res).toBeInstanceOf(Response)
        expect(res.status).toBe(302)
        expect(res.headers.get('Set-Cookie')).toContain('Expires=Thu, 01 Jan 1970')
        expect(sent()[0].body.operationName).toBe('Logout')
    })

    it('unsubscribe reports a bad link when the api rejects the token', async () => {
        const { loader } = await import('~/routes/unsubscribe')
        apiError('Invalid unsubscribe link', 'BAD_USER_INPUT')
        await expect(
            loader(args(new Request('http://x/unsubscribe?token=t'), '/unsubscribe?token=t')),
        ).resolves.toEqual({ ok: false })
    })

    it('a team page treats a failed viewer query as signed out, not as an error', async () => {
        const { loader } = await import('~/routes/teams.$slug')
        fetchMock.mockImplementation(async (_url, init) =>
            new Headers(init?.headers).has('authorization')
                ? reply({
                      data: null,
                      errors: [
                          {
                              message: 'You must be signed in to do that',
                              extensions: { code: 'UNAUTHENTICATED' },
                          },
                      ],
                  })
                : reply({
                      data: {
                          team: { slug: 'bc', name: 'BC Lions', abbreviation: 'BC' },
                          depthChartYears: [2026],
                      },
                  }),
        )
        const req = await requestWithTokens({
            accessToken: 'a1',
            refreshToken: 'r1',
            accessTokenExpiresAt: Date.now() + 600_000,
        })
        const res = await loader({
            request: req,
            url: new URL('http://x/teams/bc'),
            params: { slug: 'bc' },
            context: {},
        } as never)
        expect(res).toMatchObject({ data: { signedIn: false, subscribed: false } })
    })
})
