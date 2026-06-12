# Open Issues

Issues from the senior engineer review that haven't been addressed yet. Fixed items (query auth isolation, perk cycle tests, decimal coercion, input validation) are not listed here.

---

## Critical / Security

### 2. Hardcoded auth
`src/app/api/graphql/route.ts` returns a hardcoded `userId` in the Yoga context. There is no real authentication layer. Any multi-user deployment requires replacing this with a proper auth system (e.g. NextAuth.js, Clerk).

---

## Scalability

### 3. No pagination — single unbounded query
`MeView` fires one `MeDocument` query that fetches every card → every perk → every credit upfront. `perkCredits` has no limit either. Query payload grows linearly with usage. Needs cursor-based pagination before the dataset gets large.

### 4. Hardcoded catalogs won't scale
`src/data/cardCatalog.ts` and `src/data/perkCatalog.ts` are parallel static files with no runtime cross-validation. Adding a card requires edits in both, and there is no mechanism for card reward changes (issuers change rates quarterly). At ~50+ cards this becomes a maintenance problem. Long-term fix: move catalogs to the database with an admin UI.

---

## Maintainability

### 6. `MeView` owns too much state
`src/app/me-view.tsx` has 9 `useState` calls managing route, selected card, all dialog visibility, toast, and remove confirmation. Adding features here will compound the problem. State should be colocated with the components that own it, or moved to a lightweight store (Zustand).

### 9. Incomplete features tracked only as inline TODOs
Several buttons have empty or no-op handlers (Edit card, Add a perk, Settings, Notifications). These are scattered as `// todo` comments in components rather than tracked anywhere. Should be converted to issues or a backlog.
