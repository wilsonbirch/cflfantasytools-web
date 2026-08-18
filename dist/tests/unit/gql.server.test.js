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
import { describe, expect, it, vi, beforeEach } from 'vitest'
// The real module, not the setup-file mock — this file is testing it.
vi.unmock('~/lib/gql.server')
const request = vi.fn()
vi.mock('graphql-request', () => ({
    GraphQLClient: class {
        constructor(url, options) {
            this.url = url
            this.options = options
        }
        request(...args) {
            var _a
            return request(
                (_a = this.options) === null || _a === void 0 ? void 0 : _a.headers,
                ...args,
            )
        }
    },
}))
process.env.SESSION_SECRET = 'test-session-secret'
const { gqlAnonymous } = await import('~/lib/gql.server')
beforeEach(() => request.mockReset())
describe('gqlAnonymous', () => {
    it('sends no authorization header', () =>
        __awaiter(void 0, void 0, void 0, function* () {
            request.mockResolvedValue({ isUp: true })
            yield gqlAnonymous('{ isUp }')
            const [headers] = request.mock.calls[0]
            expect(
                headers === null || headers === void 0 ? void 0 : headers.authorization,
            ).toBeUndefined()
        }))
    it('returns the api payload unwrapped', () =>
        __awaiter(void 0, void 0, void 0, function* () {
            request.mockResolvedValue({ isUp: true })
            yield expect(gqlAnonymous('{ isUp }')).resolves.toEqual({ isUp: true })
        }))
})
