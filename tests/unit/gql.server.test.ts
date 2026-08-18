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

const { gqlAnonymous } = await import('~/lib/gql.server')

beforeEach(() => request.mockReset())

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
