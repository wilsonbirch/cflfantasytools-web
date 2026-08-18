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
            presetConfig: {
                // No fragment masking — simpler ergonomics for an app this size.
                fragmentMasking: false,
            },
            config: {
                // The api serializes DateTime as ISO strings over the wire.
                scalars: { DateTime: 'string', JSON: 'unknown' },
                // Required under verbatimModuleSyntax, which tsconfig enables.
                useTypeImports: true,
            },
        },
    },
}

export default config
