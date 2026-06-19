/** Parse a Decimal string from GraphQL into a JS number. Single point of change if we move to a Decimal library. */
export const toAmount = (s: string): number => parseFloat(s)

export function fmtDollars(n: number): string {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

export function fmtCents(n: number): string {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export const fmtSigned = (n: number): string =>
  (n < 0 ? '−' : '+') + '$' + Math.abs(n).toLocaleString('en-US', { maximumFractionDigits: 0 })

export function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** Whole-dollar, absolute value: `$1,234`. Pair with `fmtSigned` when a sign is needed. */
export function fmtMoney(n: number): string {
  return '$' + Math.round(Math.abs(n)).toLocaleString('en-US')
}

export function monthLabel(y: number, m: number): string {
  return `${MONTHS_LONG[m]} ${y}`
}

export function monthShort(y: number, m: number): string {
  return `${MONTHS_SHORT[m]} ${y}`
}

export function clamp01(x: number): number {
  return Math.max(0, Math.min(1, x))
}

/** Step a (year, zero-based month) pair by `delta` months, normalizing overflow. */
export function stepMonth(y: number, m: number, delta: number): { y: number; m: number } {
  const total = y * 12 + m + delta
  return { y: Math.floor(total / 12), m: ((total % 12) + 12) % 12 }
}
