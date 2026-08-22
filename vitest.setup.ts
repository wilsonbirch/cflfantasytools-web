import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

// Web is a GraphQL client, so the module boundary worth mocking is the one
// place it talks to the api. 3DF mocked Redis, node-resque, Puppeteer and MS
// Graph here — none of which web is allowed to import any more.
vi.mock('~/lib/gql.server', () => ({
    gqlAsViewer: vi.fn(async () => ({ data: {} })),
    gqlAnonymous: vi.fn(async () => ({})),
    tokensFrom: vi.fn((p) => ({ ...p, accessTokenExpiresAt: 0 })),
}))

// Loaders import session.server transitively; give it a secret so importing a
// module under test never throws on the env guard.
process.env.SESSION_SECRET ||= 'test-session-secret'
