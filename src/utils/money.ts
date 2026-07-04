// The app's single money policy. Amounts flow as JS numbers (dollars) end to
// end — GraphQL exposes the Prisma Decimal columns as Float, so there is no
// string round-trip. The only rounding rule lives here.

/** Round a dollar amount to whole cents — the single rounding policy for the app. */
export const roundCents = (n: number): number => Math.round(n * 100) / 100

/**
 * Sum dollar amounts via integer cents rather than accumulating raw floats.
 * Use this for every reduce() over money — plain `reduce((s, x) => s + x.amount, 0)`
 * accumulates floating-point error across rows; rounding each term to cents before
 * summing as an integer keeps the running total exact.
 */
export function sumCents<T>(items: readonly T[], amount: (item: T) => number): number {
  const totalCents = items.reduce((s, item) => s + Math.round(amount(item) * 100), 0)
  return totalCents / 100
}
