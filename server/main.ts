// `npm start`: node server/main.ts [build/server/index.js]
// Node 22.18+ runs this TypeScript directly (type stripping), so there is no
// separate build step for the server.
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import type { ServerBuild } from 'react-router'

// Set before the build is imported: modules read it at load time (the session
// cookie's `secure` flag, for one).
process.env.NODE_ENV ??= 'production'

const buildPath = path.resolve(process.argv[2] ?? 'build/server/index.js')
const build: ServerBuild = await import(pathToFileURL(buildPath).href)
const { createApp } = await import('./app.ts')

const port = Number(process.env.PORT) || 3000
const host = process.env.HOST

const app = createApp(build)
const onListen = (error?: Error) => {
    if (error) throw error
    console.log(`[server] http://${host ?? 'localhost'}:${port}`)
}
const server = host ? app.listen(port, host, onListen) : app.listen(port, onListen)

for (const signal of ['SIGTERM', 'SIGINT'] as const) {
    process.once(signal, () => server.close((error) => error && console.error(error)))
}
