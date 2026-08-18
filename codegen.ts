import type { CodegenConfig } from '@graphql-codegen/cli'

// Reads the COMMITTED snapshot, never a live API — so codegen works offline and
// in CI, and a drifting schema shows up as a reviewable diff rather than a
// mysterious type change. Refresh it with `npm run schema:pull` against a
// running api (which is a stacked-PR moment: api merges first).
const config: CodegenConfig = {
    schema: 'schema.graphql',
    documents: ['app/**/*.{ts,tsx}', '!app/graphql/generated/**'],
    ignoreNoDocuments: true,
    generates: {
        'app/graphql/generated/': {
            preset: 'client',
            config: {
                scalars: { DateTime: 'string', JSON: 'unknown' },
            },
        },
    },
}

export default config
