var _a, _b
import { defineConfig, devices } from '@playwright/test'
import { config as loadEnv } from 'dotenv'
const testEnv = (_a = loadEnv({ path: '.env.test' }).parsed) !== null && _a !== void 0 ? _a : {}
// Belt-and-suspenders: mutate the parent's process.env so every nested subprocess
// (Playwright's webServer, the npm scripts it spawns, vite, remix-serve) inherits
// these values directly — not just via webServer.env. Some CI shells have been
// observed to drop webServer.env keys when launching nested shells.
Object.assign(process.env, testEnv)
const PORT = Number((_b = process.env.PORT) !== null && _b !== void 0 ? _b : 3000)
const baseURL = `http://localhost:${PORT}`
export default defineConfig({
    testDir: './tests/e2e',
    fullyParallel: false,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: 1,
    reporter: process.env.CI ? [['html'], ['github']] : 'html',
    timeout: 30000,
    expect: { timeout: 5000 },
    use: {
        baseURL,
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
    },
    projects: [
        {
            name: 'chromium',
            use: Object.assign({}, devices['Desktop Chrome']),
        },
    ],
    webServer: {
        command: 'npm run build && npm start',
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 180000,
        stdout: 'pipe',
        stderr: 'pipe',
        env: Object.assign(Object.assign({}, testEnv), {
            PORT: String(PORT),
            NODE_ENV: 'production',
            DISABLE_RESQUE: 'true',
        }),
    },
})
