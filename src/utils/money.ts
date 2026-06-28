// The app's single money policy. Amounts flow as JS numbers (dollars) end to
// end — GraphQL exposes the Prisma Decimal columns as Float, so there is no
// string round-trip. The only rounding rule lives here.

/** Round a dollar amount to whole cents — the single rounding policy for the app. */
export const roundCents = (n: number): number => Math.round(n * 100) / 100
