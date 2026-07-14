# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Ask before acting — use AskUserQuestion liberally

**Before starting any non-trivial task, use `AskUserQuestion` to clarify intent.** Do not assume. The cost of a quick question is far lower than the cost of a wrong implementation. Use it:

- When a feature request could be interpreted more than one way (e.g. "add a filter" — filter where? by what? in place or a new UI panel?).
- When there are two or more reasonable implementation approaches with real tradeoffs (new component vs. extending existing, mutation vs. query, client state vs. URL state).
- When adding UI — ask about placement, which view it belongs in, and whether it should be behind a `ComingSoon` wrapper for now.
- When touching the DB schema — ask whether a migration is expected or if this is exploratory.
- When the scope is unclear — ask whether the task is a quick prototype or production-quality.
- When a task could affect multiple views — ask which ones are in scope.
- When you're unsure about the desired visual style or density (compact vs. spacious, inside a `ListRow` vs. a new panel).
- When the task touches both frontend and backend — confirm the full intended surface before writing a line.

Use `AskUserQuestion` even when you _think_ you know the answer. Present 2–4 concrete options with previews when the choice is visual. One well-placed question prevents a full rewrite.

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
pnpm test              # vitest run — unit tests (src/utils/__tests__/)
pnpm test:watch        # vitest watch mode
```

There is no linter wired up — `--no-eslint` was passed to `create-next-app`, and Next 16 removed `next lint` entirely. `postinstall` runs `prisma generate`. Unit tests do exist (vitest, `node` environment, `@` alias resolved in `vitest.config.ts`) but only cover pure logic in `src/utils/` (e.g. `perk.ts` cycle-window math) — no component or integration tests.

## App architecture

`src/app/page.tsx` is a server component: it calls `auth()` and redirects to `/login` if there's no session, otherwise renders `MeView`. The actual UI lives in `src/app/me-view.tsx` → `MeView` (client component). `MeView` owns all data fetching (urql), all mutations, and a lightweight client-side router with three routes: `'perks'` (dashboard), `'card'` (single card detail), and `'cards'` (wallet + suggest engine). Route transitions happen via `useState`; there is no Next.js routing between pages.

**Component tree:**
- `MeView` — root state, urql queries/mutations, route switch
  - `Sidebar` + `Topbar` — chrome (nav items not yet built wrap in `ComingSoon`)
  - `PerksDashboard` — default view, lists perks across all cards
  - `CardDetail` — per-card perk list and log-credit actions
  - `CardsView` — wallet list + suggestion engine (SuggestPicker / SuggestMatrix)
  - `AddCardDialog` — adds a card from `CARD_CATALOG`
  - `RemoveCardDialog` — confirms and runs the `removeCard` mutation
  - `LogCreditDialog` — logs a perk credit

**DB Card → UI shape:** `dbCardToRewardCard()` in `src/utils/cardRewards.ts` merges a DB `CreditCard` (id, name, issuer, lastFour, design) with the static `CARD_CATALOG` entry for its `design` slug to produce `RewardCardData` (adds type, network, rewards). The DB never stores multipliers — they come entirely from the catalog.

**Annual fee / net value:** `src/utils/card.ts` derives `cardAnnualFee` (looked up from `CARD_CATALOG[card.design].annualFee`, not stored in the DB), `cardNet` (YTD captured value minus the fee), and `cardVerdict` (`noFee` | `worthIt` | `marginal` | `reviewIt`, thresholded on `cardNet`). `WalletCard.tsx` (the dashboard's "Your cards" ledger row) and `StatusChip` render these, alongside `cardPerksUsed` for the "3/5 perks used" figure. `SummaryFigures.tsx` rolls the same numbers up across the wallet inside the headline panel.

## Static data catalogs

`src/data/cardCatalog.ts` — the master product registry. Each key is a `design` slug (e.g. `chase-sapphire-preferred`). Entries define `name`, `issuer`, a single `color` + `text` for rendering (flat colors, not gradients), `type` (cashback | points), `network`, `annualFee` (dollars/yr, drives the verdict calc above), and `rewards` (category → multiplier, with an optional per-entry `note` — e.g. caps or exclusions — surfaced as an info-icon tooltip on `RewardCard`/`SuggestMatrix`/`SuggestPicker`). **Multipliers and fees live here only**, not in the DB.

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
- `src/graphql/creditCard/` — type, queries, mutations (`addCard`, `removeCard`)
- `src/graphql/perk/` — type, queries (`perks`, `perkCredits` — both scoped to `ctx.userId` via a `creditCard: { userId }` filter)
- `src/graphql/perkCredit/` — type, mutations (`logPerkCredit`)
- `src/graphql/budget/` — `types.ts` (payload shapes), `queries.ts` (`budgetMonth`, `budgetYear` — both scoped via `ctx.userId`)

## Pothos conventions

- `builder.defaultFieldNullability = false` (and the matching `DefaultFieldNullability: false` generic) — every field is non-null unless you opt in.
- `Decimal` fields are exposed as `Float` via `.toNumber()` — this is the app's deliberate money policy (see `src/utils/money.ts`), not a placeholder for a future `String` migration. `DateTime` fields are exposed as `String` to avoid registering custom scalars.
- On the server, never `reduce()` a list of amounts already at cent precision with plain `+` — use `sumCents()` from `src/utils/money.ts`, which accumulates in integer cents so repeated summation can't drift off a cent boundary. All server-side money rollups (`src/utils/perk.ts`, `src/utils/card.ts`, `src/graphql/budget/*`) go through it. (Exception: terms that are themselves fractions of a cent, e.g. a prorated `(cost * 4) / 12`, should sum at full float precision and round only the final total via `roundCents()` — rounding each such term first destroys real precision.) Client-side rollups (`src/components/**`, `src/hooks/**`) still sum with plain `reduce()` and have not been migrated — a known gap, not a deliberate exception.
- The Pothos Prisma plugin warns against putting the Prisma client into Context — keep it as a module singleton (`src/lib/prisma.ts`).
- **Plain (non-Prisma) payload objects** — e.g. the aggregate shapes in `src/graphql/budget/types.ts` that a resolver builds up by hand from several queries — use `builder.simpleObject('Name', { fields: (t) => ({ ... }) })` (`@pothos/plugin-simple-objects`), not `builder.objectRef<T>() + builder.objectType()`. `simpleObject` infers the TS shape from the field list and defaults every resolver to a same-named property lookup, so you declare each field once instead of three times (TS interface + field type + identity `resolve`). Only fall back to `objectRef`/`objectType` when a field needs a real resolver (computed value, renamed property, args).

## Auth / user context

Real auth via **Auth.js v5** (`next-auth@5.0.0-beta.31`), Google OAuth only, JWT session strategy. `src/auth.ts` exports `{ handlers, auth, signIn, signOut }`; `src/app/api/auth/[...nextauth]/route.ts` re-exports `handlers` as `GET`/`POST`. On first sign-in the `jwt` callback upserts a `User` row by `profile.email` and stamps the Prisma `id` onto the token/session as `userId`.

- **Page-level gate** — `src/app/page.tsx` (server component) calls `auth()` and `redirect('/login')` if there's no `session.userId`. `/login` (`src/app/login/page.tsx`) is a client component that calls `signIn('google', { callbackUrl: '/' })`.
- **Provider** — `AuthSessionProvider` (`src/app/session-provider.tsx`) wraps `next-auth/react`'s `SessionProvider` and sits inside `ThemeProvider`/above `Providers` (urql) in `layout.tsx`.
- **GraphQL context** — `src/app/api/graphql/route.ts` reads the JWT directly with `getToken({ req: request, secret: process.env.AUTH_SECRET })` rather than calling `auth()` — Yoga's request handling doesn't reliably preserve the async-context `headers()` relies on. Throws `Unauthorized` if there's no `token.userId`. All resolvers scope their Prisma queries through `ctx.userId` (see `me`, `perks`, `perkCredits`, `addCard`, `removeCard`, `logPerkCredit`).
- **Env vars** — `AUTH_SECRET` (generate with `openssl rand -base64 32`), `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, all in `.env`.

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
- **Card designs** — `src/utils/cardDesigns.ts` maps a `design` slug to `{ color, text }` — a single flat color per card, never a gradient. `resolveCardDesign(slug)` falls back to the teal design. `CardTile` drives every on-surface tint from the single `text` color via `alpha()`.
- **Providers** — `src/app/layout.tsx` wraps the tree in `AppRouterCacheProvider` (from `@mui/material-nextjs/v16-appRouter` — import path is version-pinned) → `ThemeProvider` → `CssBaseline`. Drop the cache provider and you get hydration class mismatches.
- **Icons** come from `@mui/icons-material` at call sites.

### Shared UI primitives — prefer these over inline `sx`

All shared primitives live under `src/components/ui/`, grouped by role, and are re-exported from the **barrel** `src/components/ui/index.ts`. **Always import from the barrel** (`import { Row, Stat, SurfaceCard } from '@/components/ui'`), not from the file paths — the only exceptions are files _inside_ `ui/` (e.g. `Toast`/`AppDialog` import `Row` from `../layout/Flex` to avoid a barrel cycle).

Folder layout:

- `ui/layout/` — `Flex`, `Row`, `Stack`, `VDivider`, `SurfaceCard`
- `ui/data-display/` — `Dot`, `Tag`, `PanelHeader`, `ListRow`, `Stat`, `Eyebrow`, `ProgressBar`, `StatusChip`, `CatGlyph`
- `ui/inputs/` — `EditableMoney`, `Segmented`
- `ui/feedback/` — `Tooltip`, `Toast`, `AppDialog`, `ComingSoon`

**The golden rule: inline `sx` should be mostly spacing (margin/padding) and the occasional one-off position.** Do **not** hand-roll `display: 'flex'`, `alignItems`, `justifyContent`, `gap`, dividers, dots, pills, or stat blocks — reach for a primitive:

- **Layout** — `Flex` (props: `direction`, `align`, `justify` with `between`/`center`/`end`/`start`, `gap`, `wrap`, `inline`, `min0`). `Row` = `Flex` defaulting to a vertically-centered row; `Stack` = `Flex` defaulting to a column. These accept all `Box` props (`component`, `onClick`, `sx`, …). Use `align="stretch"` when children rely on the parent stretching (full-height columns, vertical dividers, segmented bars). `VDivider` is the 1px vertical rule.
- **Data display** — `PanelHeader` (icon + title + subtitle + optional `action`, with bottom border) for card/panel headers; `ListRow` for padded list items (handles last-row borders + optional hover; `direction="column"` for stacked rows); `Stat` for the eyebrow-label + value + sub-line pattern (`hero` bumps the size, `color` tints the value); `Dot` for legend/indicator swatches (square via `square`); `Tag` for compact pills (`tone`, `variant`, optional `dot`/`icon`).

When you add a new repeated styling pattern, add a primitive here rather than copying `sx` across call sites, and export it from the barrel.

- **Typography scale** — `theme.ts` defines a snapped set of custom `Typography` variants; prefer `variant="…"` over ad-hoc `fontSize`/`fontWeight`/`letterSpacing`. Scale: `statXl` (28, hero numbers), `statLg` (22), `cardTitle` (16), `panelTitle` (15), `bodyStrong` (14/600), `body` (13), `label` (12), `note` (11), `micro` (10). The `stat*` variants already include `tabular-nums`; for other numeric text add `tabularNums` from `@/lib/sx`. All custom variants render as a `div` (see `MuiTypography.variantMapping`). When no variant fits exactly, keep the bespoke `sx` rather than forcing a mismatched variant.

- **Other primitives** — `Eyebrow` (themed Typography), `StatusChip` (perk `StatusKey`/`VerdictKey` → colored Chip), `Tooltip` (themed wrapper over MUI's, with `dark`/`light`/`teal` variants and an `auto` placement — see its own doc comment), and `ComingSoon` (wraps any element in a "Coming soon" `Tooltip` + dims it via `opacity`/`pointerEvents: 'none'` — used for not-yet-built nav items in `Sidebar`/`Topbar`).

## Verification

Real Google OAuth now gates `/` (see Auth / user context) — headless browser screenshots can't get past the login redirect without real credentials. Use `pnpm build` (runs full `tsc` type-check) as the verification signal for UI changes; `pnpm test` for logic changes under `src/utils/`. The `/verify` skill will SKIP browser steps accordingly.

## When something looks off

- **`PothosSchemaError: Model 'X' is missing required datamodel information`** → `generateDatamodel = "true"` is missing from the `pothos` generator, or `dmmf: getDatamodel()` was dropped from `builder.ts`. Re-run `pnpm exec prisma generate`.
- **Type errors after editing a `.graphql` operation or a Prisma model** → run `pnpm codegen`.
- **`Failed to parse URL from /api/graphql`** → urql is fetching server-side with a relative URL. See the urql client section.
- **Prisma CLI error about `url`/`directUrl`** → those properties were removed from `datasource` in Prisma 7. They belong in `prisma.config.ts`.
- **MUI styles flash unstyled or hydration class mismatch** → `AppRouterCacheProvider` must still wrap the app in `layout.tsx`, above `ThemeProvider`.
- **`builder.simpleObject is not a function`** → `SimpleObjectsPlugin` was dropped from the `plugins` array in `builder.ts`.
