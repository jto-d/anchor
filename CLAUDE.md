# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Stack

Next.js 16 (App Router, Turbopack, React 19) · MUI 9 (Material UI + Emotion) · GraphQL Yoga 5 + Pothos (code-first) · Prisma 7 + `@prisma/adapter-neon` over Neon · urql 5 via `@urql/next` · `graphql-codegen` client-preset · pnpm.

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

There are no tests or linter wired up — `--no-eslint` was passed to `create-next-app`, and Next 16 removed `next lint` entirely. `postinstall` runs `prisma generate`.

## App architecture

The entire UI lives under `src/app/page.tsx` → `MeView` (client component). `MeView` owns all data fetching (urql), all mutations, and a lightweight client-side router with three routes: `'perks'` (dashboard), `'card'` (single card detail), and `'cards'` (wallet + suggest engine). Route transitions happen via `useState`; there is no Next.js routing between pages.

**Component tree:**
- `MeView` — root state, urql queries/mutations, route switch
  - `Sidebar` + `Topbar` — chrome
  - `PerksDashboard` — default view, lists perks across all cards
  - `CardDetail` — per-card perk list and log-credit actions
  - `CardsView` — wallet list + suggestion engine (SuggestPicker / SuggestMatrix)
  - `AddCardDialog` — adds a card from `CARD_CATALOG`
  - `LogCreditDialog` — logs a perk credit

**DB Card → UI shape:** `dbCardToRewardCard()` in `src/utils/cardRewards.ts` merges a DB `CreditCard` (id, name, issuer, lastFour, design) with the static `CARD_CATALOG` entry for its `design` slug to produce `RewardCardData` (adds type, network, rewards). The DB never stores multipliers — they come entirely from the catalog.

## Static data catalogs

`src/data/cardCatalog.ts` — the master product registry. Each key is a `design` slug (e.g. `chase-sapphire-preferred`). Entries define `name`, `issuer`, gradient/text for rendering, `type` (cashback | points), `network`, and `rewards` (category → multiplier). **Multipliers live here only**, not in the DB.

`src/data/perkCatalog.ts` — perk templates keyed by the same design slug. When `addCard` runs, it bulk-creates the template perks from this file onto the new card. Users can log credits against those perks but cannot create or edit perks or multipliers through the UI.

## Schema-and-codegen pipeline

The chain is one-way and must run in this order whenever Prisma models or Pothos types change:

1. **`prisma/schema.prisma`** — models live here. `datasource db` has no `url`; the URL is provided by `prisma.config.ts` (Prisma 7 split). Two generators run: `prisma-client-js` and `prisma-pothos-types` (with `generateDatamodel = "true"` — required so the runtime `getDatamodel()` function is emitted).
2. **`prisma generate`** writes the Prisma client + `generated.{d.ts,js}` into `node_modules/@pothos/plugin-prisma/`.
3. **`src/graphql/builder.ts`** imports `getDatamodel` from `@pothos/plugin-prisma/generated` and passes it as `dmmf` to the SchemaBuilder. **In Prisma 7 this is required** — the old `client._runtimeDataModel` path no longer exists, so the builder will throw `Model 'X' is missing required datamodel information` without it.
4. **`pnpm schema`** runs `tsx src/graphql/print-schema.ts`, which imports the built schema and writes SDL to `./schema.graphql`. It loads `dotenv/config` first because importing the schema pulls in `src/lib/prisma.ts`, which constructs `PrismaNeon({ connectionString: process.env.DATABASE_URL! })` at module load.
5. **`graphql-codegen`** reads `./schema.graphql` and operations from `src/**/*.{ts,tsx}` and emits `src/gql/` (client-preset, `fragmentMasking: false`).

`schema.graphql` and `src/gql/` are gitignored — regenerate after `git pull`.

## GraphQL schema layout

`src/graphql/schema.ts` is the entry point — it imports all type/query/mutation files for side effects and then calls `builder.toSchema()`. Each domain has its own subfolder:

- `src/graphql/user/` — type, queries (`me`)
- `src/graphql/creditCard/` — type, queries, mutations (`addCard`)
- `src/graphql/perk/` — type, queries
- `src/graphql/perkCredit/` — type, mutations (`logPerkCredit`)

## Pothos conventions

- `builder.defaultFieldNullability = false` (and the matching `DefaultFieldNullability: false` generic) — every field is non-null unless you opt in.
- `Decimal` and `DateTime` fields are exposed as `String` to avoid registering custom scalars.
- The Pothos Prisma plugin warns against putting the Prisma client into Context — keep it as a module singleton (`src/lib/prisma.ts`).

## Auth / user context

There is no real auth. The Yoga context in `src/app/api/graphql/route.ts` returns a hardcoded `{ userId: '<cuid>' }`. All queries and mutations resolve against this single user. Any future auth system would replace that context factory.

## Database access

- **Two URLs in `.env`**: `DATABASE_URL` (pooled, `-pooler` in hostname) used at runtime. `DIRECT_URL` (no `-pooler`) required by `prisma migrate`.
- **`prisma.config.ts`** — single source of truth for Prisma CLI URL (reads `DIRECT_URL`).
- `src/lib/prisma.ts` sets `neonConfig.webSocketConstructor = ws` and memoizes the client on `globalThis` for HMR.
- The Neon project is in the `threedays` org (`project_id: hidden-hall-51915629`). MCP tools (`mcp__Neon__*`) can run SQL against it for ad-hoc inspection.

## Yoga ↔ Next route handler

`src/app/api/graphql/route.ts` wraps Yoga because Next 16's `RouteHandlerConfig` types are strict — Yoga's `handle(request, ctx)` second argument shape doesn't match Next's `{ params: Promise<{}> }`. The wrapper takes only `request: Request` and calls `yoga.handle(request, {})`. Export the same wrapper as `GET`, `POST`, and `OPTIONS`.

## urql client

`src/lib/urql.tsx` (`Providers`) is the only client-side urql wiring. Two non-obvious choices:

- `suspense: false`. With suspense on, `useQuery` tries to fetch during SSR and Node's native `fetch` rejects relative URLs (`/api/graphql`) with `Failed to parse URL`. Disabling suspense makes the app a pure client-side fetch.
- `url` is conditional: `http://localhost:${process.env.PORT ?? 3000}/api/graphql` on the server, relative on the client.

## Styling — MUI

The UI is built entirely with **Material UI v9** (`@mui/material`, `@mui/icons-material`) on the Emotion engine. There is **no Tailwind**.

- **Theme** — `src/lib/theme.ts` holds the single `createTheme`: the "Anchor" brand (teal `primary`, Switzer typography, soft radii). It also exports a `brand` object of raw scales (anchor/zinc, `shadow`, `accentSoft`). Use theme tokens (`sx`, `palette.*`) first; use `brand` only when no token fits.
- **Card designs** — `src/utils/cardDesigns.ts` maps a `design` slug to `{ gradient, text }`. `resolveCardDesign(slug)` falls back to the teal design. `CardTile` drives every on-surface tint from the single `text` color via `alpha()`.
- **Providers** — `src/app/layout.tsx` wraps the tree in `AppRouterCacheProvider` (from `@mui/material-nextjs/v16-appRouter` — import path is version-pinned) → `ThemeProvider` → `CssBaseline`. Drop the cache provider and you get hydration class mismatches.
- **Icons** come from `@mui/icons-material` at call sites. Shared primitives live in `src/components/ui/`: `Eyebrow` (themed Typography) and `StatusChip` (perk StatusKey → colored Chip).

## Verification

The app requires Google OAuth to reach the dashboard — headless browser screenshots are not possible. Use `pnpm build` (runs full `tsc` type-check) as the verification signal for UI changes. The `/verify` skill will SKIP browser steps accordingly.

## When something looks off

- **`PothosSchemaError: Model 'X' is missing required datamodel information`** → `generateDatamodel = "true"` is missing from the `pothos` generator, or `dmmf: getDatamodel()` was dropped from `builder.ts`. Re-run `pnpm exec prisma generate`.
- **Type errors after editing a `.graphql` operation or a Prisma model** → run `pnpm codegen`.
- **`Failed to parse URL from /api/graphql`** → urql is fetching server-side with a relative URL. See the urql client section.
- **Prisma CLI error about `url`/`directUrl`** → those properties were removed from `datasource` in Prisma 7. They belong in `prisma.config.ts`.
- **MUI styles flash unstyled or hydration class mismatch** → `AppRouterCacheProvider` must still wrap the app in `layout.tsx`, above `ThemeProvider`.
