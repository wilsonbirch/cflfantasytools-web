// @vitest-environment node
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import type { Server } from 'node:http'
import type { AddressInfo } from 'node:net'
import { tmpdir } from 'node:os'
import path from 'node:path'
import type { ServerBuild } from 'react-router'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createApp } from '../../server/app'

// A one-route server build: the root route has an action, and the document
// entry answers 200 for anything that gets as far as rendering. Enough to put
// React Router's real action-origin (CSRF) check between the request and a 200.
function fakeBuild(assetsBuildDirectory: string): ServerBuild {
    return {
        entry: {
            module: {
                default: (_request, status, headers) =>
                    new Response('rendered', { status, headers }),
                handleError: () => {},
            },
        },
        routes: {
            root: {
                id: 'root',
                path: '',
                module: { default: () => null, action: () => ({ ok: true }) },
            },
        },
        assets: { entry: { imports: [], module: '' }, routes: {}, url: '', version: 'test' },
        basename: '/',
        publicPath: '/',
        assetsBuildDirectory,
        future: {},
        ssr: true,
        isSpaMode: false,
        prerender: [],
        routeDiscovery: { mode: 'initial', manifestPath: '/__manifest' },
    }
}

let assetsDir: string
let server: Server
let origin: string // what the app sees: http://127.0.0.1:<port>
let host: string
let port: number

beforeAll(async () => {
    assetsDir = mkdtempSync(path.join(tmpdir(), 'web-server-test-'))
    mkdirSync(path.join(assetsDir, 'assets'))
    writeFileSync(
        path.join(assetsDir, 'assets', 'entry-abc123.js'),
        'console.log(1);\n'.repeat(200),
    )
    server = createApp(fakeBuild(assetsDir), { logRequests: false }).listen(0, '127.0.0.1')
    await new Promise((resolve) => server.once('listening', resolve))
    port = (server.address() as AddressInfo).port
    host = `127.0.0.1:${port}`
    origin = `http://${host}`
})

afterAll(async () => {
    await new Promise((resolve) => server.close(resolve))
    rmSync(assetsDir, { recursive: true, force: true })
})

/** POST as a browser behind a TLS-terminating proxy would, to a document or `.data` URL. */
const post = (pathname: string, headers: Record<string, string>) =>
    fetch(`${origin}${pathname}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', ...headers },
        body: 'x=1',
        redirect: 'manual',
    })

describe('forwarded headers: scheme only, and only a valid one', () => {
    for (const pathname of ['/', '/_.data']) {
        describe(`POST ${pathname}`, () => {
            it('ignores X-Forwarded-Host, so a spoofed host cannot match a foreign Origin', async () => {
                // Same port as the real Host: @react-router/express takes the
                // port from Host when the forwarded host has none, so a
                // portless spoof would mismatch on port alone and prove nothing.
                const spoofed = `evil.test:${port}`
                const res = await post(pathname, {
                    Origin: `https://${spoofed}`,
                    'X-Forwarded-Host': spoofed,
                    'X-Forwarded-Proto': 'https',
                })
                expect(res.status).toBe(400)
            })

            it('still accepts the real host over https with an X-Forwarded-Host present', async () => {
                const res = await post(pathname, {
                    Origin: `https://${host}`,
                    'X-Forwarded-Host': 'evil.test',
                    'X-Forwarded-Proto': 'https',
                })
                expect(res.status).toBe(200)
            })

            it('takes the first value of a comma list, case-insensitively', async () => {
                const res = await post(pathname, {
                    Origin: `https://${host}`,
                    'X-Forwarded-Proto': 'HTTPS, http',
                })
                expect(res.status).toBe(200)
            })

            for (const [name, value] of [
                ['X-Forwarded-Proto', 'ht tp'],
                ['X-Forwarded-Proto', 'javascript'],
                ['X-Forwarded-Host', '['],
                ['X-Forwarded-Host', 'evil.test:99999'],
            ]) {
                it(`falls back to the socket for a malformed ${name}: ${value}`, async () => {
                    // Not a 500 from an invalid request.url: the action runs over plain http.
                    const res = await post(pathname, { Origin: origin, [name]: value })
                    expect(res.status).toBe(200)
                })
            }
        })
    }
})

describe('action origin check behind a TLS-terminating proxy', () => {
    for (const pathname of ['/', '/_.data']) {
        describe(`POST ${pathname}`, () => {
            it('accepts a same-host https Origin when the proxy says https', async () => {
                const res = await post(pathname, {
                    Origin: `https://${host}`,
                    'X-Forwarded-Proto': 'https',
                })
                expect(res.status).toBe(200)
            })

            it('rejects a foreign Origin even when the proxy says https', async () => {
                const res = await post(pathname, {
                    Origin: 'https://evil.example',
                    'X-Forwarded-Proto': 'https',
                })
                expect(res.status).toBe(400)
            })

            it('rejects an https Origin when nothing says the request was https', async () => {
                // The v8 failure mode trust proxy fixes: scheme mismatch alone is a 400.
                const res = await post(pathname, { Origin: `https://${host}` })
                expect(res.status).toBe(400)
            })

            it('accepts a same-origin plain-http POST (local, no proxy)', async () => {
                const res = await post(pathname, { Origin: origin })
                expect(res.status).toBe(200)
            })
        })
    }
})

describe('static assets', () => {
    it('serves hashed assets as immutable for a year, compressed', async () => {
        const res = await fetch(`${origin}/assets/entry-abc123.js`, {
            headers: { 'Accept-Encoding': 'gzip' },
        })
        expect(res.status).toBe(200)
        expect(res.headers.get('cache-control')).toBe('public, max-age=31536000, immutable')
        expect(res.headers.get('content-encoding')).toBe('gzip')
    })
})
