import { defineConfig } from 'vitest/config'

export default defineConfig({
    // Native tsconfig path resolution — no vite-tsconfig-paths plugin needed.
    resolve: { tsconfigPaths: true },
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: 'vitest.setup.ts',
        include: ['app/**/*.{test,spec}.{ts,tsx}', 'tests/unit/**/*.{test,spec}.{ts,tsx}'],
        exclude: ['tests/e2e/**', 'node_modules/**'],
    },
})
