# ⚓ Anchor

**Anchor is a personal finance dashboard for people who carry premium credit cards.** It tracks the perks and statement credits on every card in your wallet, tells you whether each card's annual fee is actually paying for itself, recommends the best card to use for any purchase, and pulls in linked bank accounts, recurring subscriptions, and shared expenses — all in one place.

🌐 **Live at [anchor.jtod.dev](https://anchor.jtod.dev)**

---

## Why I made it

After auditing the personal finance app landscape for something that fulfilled all of my needs, I felt as though nothing existed in the way I wanted it to.

The budgeting apps often treated every card as debt while not tracking perks and spending multipliers. The credit card trackers obviously tracked the perks but didn't keep have other personal finance features that were important for my planning. And none of them could answer the two questions I cared about most: *which card should I reach for right now,* and *is this annual fee actually worth it come renewal?*

So I built Anchor to be the tool I wished existed. An app that understands each card's real perks and statement credits, tallies the value I've captured against what I'm paying in fees, and tells me plainly whether to keep a card or cut it. From there it grew to cover the rest of the picture: a suggestion engine for picking the best card per purchase, linked bank accounts through Plaid, recurring subscriptions, split expenses, and budgeting views. It's the personal finance dashboard I couldn't find, built exactly the way I wanted it.

---

## Features

- **Perk tracking** — Every card comes preloaded with its real perks and statement credits from a built-in catalog. Log credits as you use them and see at a glance what's still on the table before it expires.
- **Net value & verdicts** — Anchor knows each card's annual fee and tallies the value you've actually captured this year. It surfaces a verdict for every card — *worth it*, *marginal*, or *review it* — so you can decide what to keep and what to cancel at renewal.
- **The wallet & suggestion engine** — Add cards from a catalog of 30+ products (Amex, Chase, Capital One, Bank of America, and more). For any spending category, Anchor's suggestion engine recommends which of *your* cards earns the most.
- **Subscriptions** — Surfaces recurring charges across your cards so nothing renews unnoticed.
- **Linked accounts** — Connect real bank accounts through [Plaid](https://plaid.com) to bring balances and transactions alongside your cards.
- **Split expenses** — Split a charge and track who owes what.
- **Budgeting** — Cumulative and yearly budget views to see where your money is going over time.

---

## Tech stack

| Layer        | Choice |
| ------------ | ------ |
| Framework    | **Next.js 16** (App Router, Turbopack, React 19) |
| UI           | **Material UI v9** on Emotion — custom "Anchor" theme, no Tailwind |
| API          | **GraphQL Yoga 5** + **Pothos** (code-first schema) |
| ORM / DB     | **Prisma 7** + `@prisma/adapter-neon` over **Neon** (serverless Postgres) |
| Data client  | **urql 5** via `@urql/next`, with `graphql-codegen` typed documents |
| Auth         | **Auth.js v5** — Google OAuth, JWT sessions |
| Integrations | **Plaid** for bank account linking |
| Hosting      | **Google Cloud Run** (push-to-deploy) |
| Tooling      | pnpm · vitest · TypeScript |

### Architecture at a glance

- **Single-page client router.** `src/app/page.tsx` is a server component that gates on auth and renders `MeView` (`src/app/me-view.tsx`). `MeView` owns all data fetching, mutations, and a lightweight client-side router across six views — Dashboard, Cards, Subscriptions, Accounts, Split, and Budgeting — with no Next.js page routing between them.
- **Static catalogs drive the money math.** Card multipliers, annual fees, and perk templates live in `src/data/` (`cardCatalog.ts`, `perkCatalog.ts`), *not* in the database. The DB stores only which cards a user owns and the credits they've logged; everything else is merged in from the catalog at render time.
- **Code-first GraphQL.** Pothos builds the schema from Prisma models. A one-way pipeline keeps types in sync: `prisma generate` → `pnpm schema` (prints SDL) → `graphql-codegen` (emits typed documents into `src/gql/`). Every resolver scopes its queries to the signed-in `userId`.
- **Shared UI primitives.** Reusable layout/display components live under `src/components/ui/` and are imported from a single barrel — inline `sx` is reserved for spacing and one-offs.

> For a deeper tour of the conventions and the schema/codegen pipeline, see [`CLAUDE.md`](./CLAUDE.md).

---

## Getting started

### Prerequisites

- [pnpm](https://pnpm.io) (`packageManager` is pinned in `package.json`)
- A [Neon](https://neon.tech) Postgres database
- Google OAuth credentials and a Plaid developer account

### 1. Install

```bash
pnpm install
```

`postinstall` runs `prisma generate` automatically.

### 2. Configure environment

Create a `.env` with:

```bash
# Database (Neon) — pooled URL for runtime, direct URL for migrations
DATABASE_URL="postgres://...-pooler.../db"
DIRECT_URL="postgres://.../db"

# Auth.js — Google OAuth
AUTH_SECRET="..."              # openssl rand -base64 32
AUTH_GOOGLE_ID="..."
AUTH_GOOGLE_SECRET="..."
# AUTH_URL must be pinned in production or OAuth callbacks break

# Plaid
PLAID_CLIENT_ID="..."
PLAID_SECRET="..."
```

### 3. Set up the database

```bash
pnpm db:migrate        # apply Prisma migrations (uses DIRECT_URL)
pnpm db:seed           # optional: seed sample data
```

### 4. Generate the GraphQL types

```bash
pnpm codegen           # prints SDL → runs graphql-codegen into src/gql/
```

`schema.graphql` and `src/gql/` are gitignored — regenerate them after pulling, or whenever you change a Prisma model or Pothos type.

### 5. Run it

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) and sign in with Google.

### Other commands

```bash
pnpm build             # production build — also runs a full tsc type-check
pnpm test              # vitest — unit tests for pure logic in src/utils/
pnpm db:studio         # browse the database in Prisma Studio
pnpm codegen:watch     # regenerate types on operation changes
```

---

## Project layout

```
src/
  app/            # Next.js App Router — page.tsx (auth gate) + me-view.tsx (the app)
  components/     # views (cards, accounts, subscriptions, split, budgeting) + ui/ primitives
  data/           # cardCatalog.ts, perkCatalog.ts — multipliers, fees, perk templates
  graphql/        # Pothos schema, split by domain (user, creditCard, perk, account, …)
  gql/            # generated typed documents (gitignored)
  lib/            # prisma, urql, plaid, theme
  utils/          # pure logic — card net/verdict math, reward merging (unit-tested)
prisma/           # schema.prisma + migrations + seed
```
