## Scalability

### 3. No pagination — single unbounded query
`MeView` fires one `MeDocument` query that fetches every card → every perk → every credit upfront. `perkCredits` has no limit either. Query payload grows linearly with usage. Needs cursor-based pagination before the dataset gets large.

### 4. Hardcoded catalogs won't scale
`src/data/cardCatalog.ts` and `src/data/perkCatalog.ts` are parallel static files with no runtime cross-validation. Adding a card requires edits in both, and there is no mechanism for card reward changes (issuers change rates quarterly). At ~50+ cards this becomes a maintenance problem. Long-term fix: move catalogs to the database with an admin UI.

### 6. `MeView` owns too much state
`src/app/me-view.tsx` has 9 `useState` calls managing route, selected card, all dialog visibility, toast, and remove confirmation. Adding features here will compound the problem. State should be colocated with the components that own it, or moved to a lightweight store (Zustand).

### MISC
Card page should have link to card listing?
Notes/tooltips for cards (Lyft 5x for CSP, online groceries only)
manually go through perks and multipliers

Adding a perk to perk catalog shouldn't require deleting and adding the card back

Remove card from card page

### need to add a ton more cards

### Budgeting
Remove the lag from updating EditableMoney
Make it possible to have different budgets for categories across months
CRUD for surplus allocation
 - make this a separate folder
Budget should start from a specific month

### Features?
Onboarding flow (?)
Preview how a card fits into your spending
 - recommendations based on weak spending categories?
 - catalog of cards (compare cards spending cats in grid view?)

Subscription tracker
Monthly budgeting/savings
 - Expected, acutal
  - could auto populate from bank (more likely manual for now)
 - savings for specific things (money to buy a phone, etc.)
Plaid integration
Reminder to cancel a card on a specific date
Bilt Calculator (could just be a link)

Partner could also have cards?