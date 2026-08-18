var __awaiter =
    (this && this.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                      resolve(value)
                  })
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value))
                } catch (e) {
                    reject(e)
                }
            }
            function rejected(value) {
                try {
                    step(generator['throw'](value))
                } catch (e) {
                    reject(e)
                }
            }
            function step(result) {
                result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected)
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next())
        })
    }
var _a
import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'
// Web is a GraphQL client, so the module boundary worth mocking is the one
// place it talks to the api. 3DF mocked Redis, node-resque, Puppeteer and MS
// Graph here — none of which web is allowed to import any more.
vi.mock('~/lib/gql.server', () => ({
    gqlAsViewer: vi.fn(() =>
        __awaiter(void 0, void 0, void 0, function* () {
            return { data: {} }
        }),
    ),
    gqlAnonymous: vi.fn(() =>
        __awaiter(void 0, void 0, void 0, function* () {
            return {}
        }),
    ),
}))
// Loaders import session.server transitively; give it a secret so importing a
// module under test never throws on the env guard.
;(_a = process.env).SESSION_SECRET || (_a.SESSION_SECRET = 'test-session-secret')
