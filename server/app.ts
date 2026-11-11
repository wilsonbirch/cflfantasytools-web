import path from 'node:path'
import { createRequestHandler } from '@react-router/express'
import compression from 'compression'
import express from 'express'
import morgan from 'morgan'
import type { RequestHandler } from 'express'
import type { ServerBuild } from 'react-router'

/** Keep only a valid forwarded scheme; never let a forwarded host reach the app. */
export const forwardedSchemeOnly: RequestHandler = (req, _res, next) => {
    delete req.headers['x-forwarded-host']
    const raw = req.headers['x-forwarded-proto']
    if (raw !== undefined) {
        const first = String(raw).split(',')[0].trim().toLowerCase()
        if (first === 'http' || first === 'https') req.headers['x-forwarded-proto'] = first
        else delete req.headers['x-forwarded-proto']
    }
    next()
}

/**
 * The production HTTP server: what `react-router-serve` gave us, plus
 * `trust proxy`.
 *
 * Why not `react-router-serve`: since v8.3.1 React Router rejects an action
 * whose `Origin` header does not match `request.url`'s full origin, scheme
 * included (v7 compared the host only). Behind a TLS-terminating proxy (Fly)
 * the app is reached over plain http, so without `trust proxy` `request.url`
 * is `http://host/…` while the browser sends `Origin: https://host`, and every
 * document or `.data` action POST is a 400. With it, Express takes the scheme
 * (and host) from the proxy's `X-Forwarded-*` headers, so `request.url` is the
 * URL the browser used and the origin check compares like with like. A foreign
 * `Origin` still fails it. This needs no knowledge of the public hostname.
 *
 * `1` trusts exactly one hop: the proxy directly in front of us. We only want
 * the scheme from it, so `forwardedSchemeOnly` drops `X-Forwarded-Host` (the
 * host stays the real `Host` header) and drops an `X-Forwarded-Proto` that is
 * not `http` or `https`, which would otherwise build an invalid `request.url`
 * and 500.
 *
 * The rest mirrors `react-router-serve` 8.5.1: compression, hashed assets
 * cached for a year as immutable, the rest of the client build and `public/`
 * served statically, `/.well-known` served, and `morgan('tiny')` request logs.
 */
export function createApp(build: ServerBuild, { logRequests = true } = {}) {
    const assetsDir = path.resolve(build.assetsBuildDirectory)
    const app = express()

    app.disable('x-powered-by')
    app.set('trust proxy', 1)
    app.use(forwardedSchemeOnly)
    app.use(compression())
    app.use(
        path.posix.join(build.publicPath, 'assets'),
        express.static(path.join(assetsDir, 'assets'), { immutable: true, maxAge: '1y' }),
    )
    app.use(build.publicPath, express.static(assetsDir))
    app.use(express.static('public', { maxAge: '1h' }))
    // Express 5's static middleware skips dot-directories, so serve this one explicitly.
    app.use('/.well-known', express.static(path.join(assetsDir, '.well-known')))
    if (logRequests) app.use(morgan('tiny'))
    app.all('/{*splat}', createRequestHandler({ build, mode: process.env.NODE_ENV }))

    return app
}
