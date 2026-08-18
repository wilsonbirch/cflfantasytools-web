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
import { GraphQLClient } from 'graphql-request'
import { getSession } from './session.server'
/**
 * The single place web talks to the api — and, once phase 2 lands auth, the
 * single place token refresh will happen. No loader implements either.
 *
 * On Fly this resolves over private networking, so tokens never traverse the
 * public internet and the browser never receives one.
 */
const endpoint =
    (_a = process.env.API_GRAPHQL_URL) !== null && _a !== void 0
        ? _a
        : 'http://localhost:4000/graphql'
/**
 * Run an operation as the signed-in account.
 *
 * Phase 2 adds refresh-before-expiry here: compare the stored expiry against a
 * ~60s skew, call the `refresh` mutation when it is close, persist the rotated
 * pair, and return the Set-Cookie. SSR runs loaders in parallel, so that will
 * also need single-flight de-duplication keyed on the refresh token — two
 * loaders presenting the same token in one tick must not race to rotate it.
 */
export function gqlAsViewer(request, document, variables) {
    return __awaiter(this, void 0, void 0, function* () {
        const session = yield getSession(request)
        const tokens = session.get('tokens')
        if (!tokens) {
            return { data: yield gqlAnonymous(document, variables) }
        }
        const client = new GraphQLClient(endpoint, {
            headers: { authorization: `Bearer ${tokens.accessToken}` },
        })
        return { data: yield client.request(document, variables) }
    })
}
/** Unauthenticated operations — public pages, and login/signup themselves. */
export function gqlAnonymous(document, variables) {
    return __awaiter(this, void 0, void 0, function* () {
        return new GraphQLClient(endpoint).request(document, variables)
    })
}
