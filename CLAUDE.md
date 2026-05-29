# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Stack

Next.js 16 (App Router, Turbopack, React 19, Tailwind v4) · GraphQL Yoga 5 + Pothos (code-first) · Prisma 7 + `@prisma/adapter-neon` over Neon · urql 5 via `@urql/next` · `graphql-codegen` client-preset · pnpm.

## Commands

```
pnpm dev               # Next dev server (Turbopack is default in Next 16, no flag needed)
pnpm build             # Production build — also runs full tsc type-check
pnpm schema            # Print Pothos schema → ./schema.graphql
pnpm codegen           # pnpm schema && graphql-codegen → src/gql/
pnpm codegen:watch     # graphql-codegen --watch (schema must already be current)
pnpm db:migrate        # prisma migrate dev (uses DIRECT_URL)
pnpm db:seed           # prisma db seed → runs prisma/seed.ts via tsx
pnpm db:studio         # prisma studio
```

There are no tests or linter wired up — `--no-eslint` was passed to `create-next-app`, and Next 16 removed `next lint` entirely (use `eslint`/`biome` directly if you add one). `postinstall` runs `prisma generate`.

## Schema-and-codegen pipeline

The chain is one-way and must run in this order whenever Prisma models or Pothos types change:

1. **`prisma/schema.prisma`** — models live here. `datasource db` has no `url`; the URL is provided by `prisma.config.ts` (Prisma 7 split). Two generators run: `prisma-client-js` and `prisma-pothos-types` (with `generateDatamodel = "true"` — required so the runtime `getDatamodel()` function gets emitted, not just the `.d.ts`).
2. **`prisma generate`** writes the Prisma client + a `generated.{d.ts,js}` into `node_modules/@pothos/plugin-prisma/`.
3. **`src/graphql/schema/builder.ts`** imports `getDatamodel` from `@pothos/plugin-prisma/generated` and passes it as `dmmf` to the SchemaBuilder. **In Prisma 7 this is required** — the old `client._runtimeDataModel` path no longer exists, so the builder will throw `Model 'X' is missing required datamodel information` without it.
4. **`pnpm schema`** runs `tsx src/graphql/print-schema.ts`, which imports the built schema and writes SDL to `./schema.graphql`. It loads `dotenv/config` first because importing the schema pulls in `src/lib/prisma.ts`, which constructs `PrismaNeon({ connectionString: process.env.DATABASE_URL! })` at module load.
5. **`graphql-codegen`** reads `./schema.graphql` and operations from `src/**/*.{ts,tsx}` and emits `src/gql/` (client-preset, `fragmentMasking: false`).

`schema.graphql` and `src/gql/` are gitignored — regenerate after `git pull`.

## Pothos conventions

- `builder.defaultFieldNullability = false` (and the matching `DefaultFieldNullability: false` generic) — every field is non-null unless you opt in. The codegen output reflects this, so consumers don't pile up `?.` chains.
- Each model has its own file under `src/graphql/schema/` (`user.ts`, `account.ts`, `transaction.ts`). They're imported for side effects from `src/graphql/schema/index.ts`, which then calls `builder.toSchema()`.
- `Decimal` and `DateTime` fields are exposed as `String` (via `tx.amount.toString()` / `date.toISOString()`) to avoid registering custom scalars. If/when you add scalars, declare them in the builder's `Scalars:` generic and the operations using them will need to be regenerated.
- The Pothos Prisma plugin docs (in `node_modules/@pothos/plugin-prisma/README.md`) warn against putting the Prisma client into Context — keep it as a module singleton (`src/lib/prisma.ts`).

## Database access

- **Two URLs in `.env`**: `DATABASE_URL` (pooled, `-pooler` in hostname) is used by the app at runtime via `@prisma/adapter-neon`. `DIRECT_URL` (no `-pooler`) is required by `prisma migrate` because pooled connections don't support the `CREATE`/`ALTER` statements migrations issue.
- **`prisma.config.ts`** is the single source of truth for which URL Prisma CLI uses — it reads `DIRECT_URL`. The runtime Prisma client gets its connection via the Neon adapter constructor, *not* via the schema's `datasource`.
- `src/lib/prisma.ts` sets `neonConfig.webSocketConstructor = ws` (Neon's driver needs an explicit `ws` impl in Node) and memoizes the client on `globalThis` for HMR.
- The Neon project is in the `threedays` org (`project_id: hidden-hall-51915629`). MCP tools (`mcp__Neon__*`) can run SQL against it for ad-hoc inspection.

## Yoga ↔ Next route handler

`src/app/api/graphql/route.ts` wraps Yoga because Next 16's `RouteHandlerConfig` types are strict — Yoga's `handle(request, ctx)` second argument shape doesn't match Next's `{ params: Promise<{}> }`. The wrapper takes only `request: Request` and calls `yoga.handle(request, {})`. Export the same wrapper as `GET`, `POST`, and `OPTIONS`.

## urql client

`src/lib/urql.tsx` (`Providers`) is the only client-side urql wiring. Two non-obvious choices:

- `suspense: false`. With suspense on, `useQuery` tries to fetch during SSR, and Node's native `fetch` rejects relative URLs (`/api/graphql`) with `Failed to parse URL`. Disabling suspense makes the demo a pure client-side fetch.
- `url` is conditional: `http://localhost:${process.env.PORT ?? 3000}/api/graphql` on the server, relative on the client. If you re-enable suspense or add RSC queries via `@urql/next/rsc`, switch the server URL to an env var (e.g. `NEXT_PUBLIC_APP_URL`) so it isn't hardcoded to localhost.

## When something looks off

- **`PothosSchemaError: Model 'X' is missing required datamodel information`** → `generateDatamodel = "true"` is missing from the `pothos` generator in `schema.prisma`, or `dmmf: getDatamodel()` was dropped from `builder.ts`. Re-run `pnpm exec prisma generate` after fixing.
- **Type errors after editing a `.graphql` operation or a Prisma model** → run `pnpm codegen`.
- **`Failed to parse URL from /api/graphql`** → urql is fetching server-side with a relative URL. See the urql client section.
- **Prisma CLI error about `url`/`directUrl`** → those properties were removed from `datasource` in Prisma 7. They belong in `prisma.config.ts`.
