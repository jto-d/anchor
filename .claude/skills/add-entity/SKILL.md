---
name: add-entity
description: Scaffold a new Prisma model + Pothos GraphQL type + resolvers, following the project's exact pipeline order. Use when adding a new domain entity to the database and API.
---

When the user asks to add a new database entity or GraphQL type, follow these steps in order — do not skip or reorder them.

## Pipeline

1. **Add the model to `prisma/schema.prisma`**
   - Use `cuid()` for `@id`
   - Every model owned by a user must have a `userId String` + `user User @relation(...)` + `@@index([userId])`
   - `Decimal` for money fields, `DateTime` for timestamps

2. **Run the migration**
   ```
   pnpm exec prisma migrate dev --name <entity-name>
   ```

3. **Regenerate the Prisma client + Pothos datamodel**
   ```
   pnpm exec prisma generate
   ```
   This step is required before the GraphQL schema can build. Without it you'll get `Model 'X' is missing required datamodel information`.

4. **Create `src/graphql/<entity>/` with these files** (look at `src/graphql/perk/` as the canonical example):
   - `type.ts` — `builder.prismaObject(...)` with `t.expose*` fields. Expose `Decimal` and `DateTime` as `String` (no custom scalars). Use `t.relation(...)` for relations.
   - `queries.ts` — `builder.queryFields(...)` using `t.prismaField`. **Every query must scope by `ctx.userId`**, either directly (`where: { userId: ctx.userId }`) or via a join (`where: { <parent>: { userId: ctx.userId } }`).
   - `mutations.ts` — `builder.mutationFields(...)`. Mutations must verify ownership before updating or deleting — use `where: { id, userId: ctx.userId }` (Prisma will throw `RecordNotFound` if the record doesn't belong to this user, which is the correct behavior).

5. **Wire the new files into `src/graphql/schema.ts`**
   Add three side-effect imports following the existing pattern:
   ```ts
   import './<entity>/type'
   import './<entity>/queries'
   import './<entity>/mutations'
   ```

6. **Regenerate the GraphQL schema and urql types**
   ```
   pnpm codegen
   ```
   This runs `pnpm schema` first (prints SDL to `schema.graphql`), then `graphql-codegen` (writes `src/gql/`). Both files are gitignored — always regenerate after schema changes.

7. **Add urql hooks in `src/hooks/` if needed**
   Follow the pattern in existing hooks files. Co-locate the `graphql()` tagged operation with the hook that uses it — codegen picks up operations from `src/**/*.{ts,tsx}`.

## Key invariants

- `builder.defaultFieldNullability = false` — every field is non-null unless you add `{ nullable: true }`
- `prisma` is a module singleton from `src/lib/prisma` — never put it in Context
- No cross-user data leaks: every resolver must be scoped to `ctx.userId`
- `Decimal` → `toString()`, `DateTime` → `.toISOString()` in field resolvers
