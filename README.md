# cflfantasytools-web

Web client for cflfantasytools — React Router v7 (SSR), HeroUI, Tailwind v4.

It holds no database access. Every read and write goes to `cflfantasytools-api`
over GraphQL, server-side, from a loader or action.

## Getting started

```bash
cp .env.example .env     # SESSION_SECRET, API_GRAPHQL_URL
npm install
npm run dev
```

The api must be running for anything beyond the shell.

## Checks

Mirror the four CI jobs before opening a PR:

```bash
npm run lint && npm run format:check
npm run typecheck
npm run test
npm run build      # the ONLY check that catches .server.ts leaking client-side
```

## How auth works

The session cookie holds **tokens minted by the api**, not the account. 3DF put
the account object in the cookie, which made the cookie the identity — and is
why it could never serve a native client. Now the api is the identity authority,
web and native both hold tokens, and the browser never sees one: the cookie is
httpOnly and every GraphQL call is server-side.

`app/lib/gql.server.ts` is the single chokepoint for talking to the api, and the
single place refresh-before-expiry will live once phase 2 lands auth. No loader
implements either.

## Schema contract

`schema.graphql` is a committed snapshot of the api's SDL. Refresh it with
`npm run schema:pull` against a running api, then re-run `npm run codegen`.
Because the api owns the schema, a change ships as a stacked PR set with the api
merging first.

## Team styling

`app/styles/teams/*.css` are keyed by **slug** (`.team-ottawa-redblacks`), not by
a positional id. 3DF used `.team-1` … `.team-9`, which is the same 1-9 space that
collides with the CFL feeds' squad ids — and the two are nearly reversed.
