import { defineConfig, devices } from '@playwright/test'
import { config as loadEnv } from 'dotenv'

const testEnv = loadEnv({ path: '.env.test' }).parsed ?? {}

// Belt-and-suspenders: mutate the parent's process.env so every nested subprocess
// (Playwright's webServer, the npm scripts it spawns, vite, remix-serve) inherits
// these values directly — not just via webServer.env. Some CI shells have been
// observed to drop webServer.env keys when launching nested shells.
Object.assign(process.env, testEnv)

const PORT = Number(process.env.PORT ?? 3000)
const baseURL = `http://localhost:${PORT}`

export default defineConfig({
    testDir: './tests/e2e',
    fullyParallel: false,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: 1,
    reporter: process.env.CI ? [['html'], ['github']] : 'html',
    timeout: 30_000,
    expect: { timeout: 5_000 },
    use: {
        baseURL,
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
    webServer: {
        command: 'npm run build && npm start',
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 180_000,
        stdout: 'pipe',
        stderr: 'pipe',
        env: {
            ...testEnv,
            PORT: String(PORT),
            NODE_ENV: 'production',
            DISABLE_RESQUE: 'true',
        },
    },
})
