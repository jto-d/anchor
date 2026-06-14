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

### MISC
add annual fee to card data
 - want to show credit redemption vs. annual fee (per card and overall)
ends soon pill with more fine tuned window
Card page should have link to card listing?

### need to add a ton more cards

### Features?
Onboarding flow (?)
Preview how a card fits into your spending
 - recommendations based on weak spending categories?
Subscription tracker
Monthly budgeting/savings
 - Expected, acutal
  - could auto populate from bank (more likely manual for now)
Plaid integration

Partner could also have cards?