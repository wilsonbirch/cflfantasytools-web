import { createCookieSessionStorage } from 'react-router'

// 3DF stored the whole account object in this cookie — the cookie WAS the
// identity, which is exactly why it couldn't serve a native client. It now
// holds tokens minted by the api, and the account is whatever `viewer` returns.
//
// The browser never sees a token: the cookie is httpOnly and every GraphQL call
// happens server-side in a loader or action.

export type SessionTokens = {
    accessToken: string
    refreshToken: string
    // Epoch ms. Used to refresh proactively rather than waiting for a 401.
    accessTokenExpiresAt: number
}

const sessionSecret = process.env.SESSION_SECRET
if (!sessionSecret) {
    throw new Error('SESSION_SECRET must be set')
}

export const sessionStorage = createCookieSessionStorage<{ tokens: SessionTokens }>({
    cookie: {
        name: '_session',
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        secrets: [sessionSecret],
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 30,
    },
})

export const getSession = (request: Request) =>
    sessionStorage.getSession(request.headers.get('Cookie'))

export const commitSession = sessionStorage.commitSession
export const destroySession = sessionStorage.destroySession

/** Cheap "is anyone signed in?" check that never hits the api. */
export const hasSession = async (request: Request) => (await getSession(request)).has('tokens')
