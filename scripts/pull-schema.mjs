// Refresh the committed GraphQL SDL snapshot (schema.graphql) from a running
// cflfantasytools-api. Run with the API up:  npm run schema:pull
//
// The snapshot is the source of truth for `npm run codegen`, so type generation
// stays offline and deterministic (works in CI without a live API or database).
import { writeFileSync } from 'node:fs'
import { buildClientSchema, getIntrospectionQuery, printSchema } from 'graphql'

const endpoint = process.argv[2] ?? process.env.API_GRAPHQL_URL ?? 'http://localhost:4000/graphql'

const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query: getIntrospectionQuery() }),
})

if (!res.ok) {
    throw new Error(`Introspection request failed: ${res.status} ${res.statusText}`)
}

const { data, errors } = await res.json()
if (errors?.length) {
    throw new Error(`Introspection returned errors: ${JSON.stringify(errors)}`)
}

const sdl = printSchema(buildClientSchema(data))
writeFileSync('schema.graphql', sdl + '\n')
console.log(`Wrote schema.graphql from ${endpoint}`)
