// Pure formatting + month-math helpers for the budgeting feature.
// No React, no side effects — safe to unit-test in isolation.

const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** Whole-dollar, absolute value: `$1,234`. */
export function fmtMoney(n: number) {
  return '$' + Math.round(Math.abs(n)).toLocaleString('en-US')
}

/** Whole-dollar with an explicit sign: `+$1,234` / `−$1,234` (true minus). */
export function fmtSigned(n: number) {
  return (n >= 0 ? '+' : '−') + '$' + Math.round(Math.abs(n)).toLocaleString('en-US')
}

export function monthLabel(y: number, m: number) {
  return `${MONTHS_LONG[m]} ${y}`
}

export function monthShort(y: number, m: number) {
  return `${MONTHS_SHORT[m]} ${y}`
}

export function clamp01(x: number) {
  return Math.max(0, Math.min(1, x))
}

/** Step a (year, zero-based month) pair by `delta` months, normalizing overflow. */
export function stepMonth(y: number, m: number, delta: number) {
  const total = y * 12 + m + delta
  return { y: Math.floor(total / 12), m: ((total % 12) + 12) % 12 }
}
