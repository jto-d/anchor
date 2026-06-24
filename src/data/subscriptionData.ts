/** Subscriptions data model — types + pure derivation functions. */

export type SubscriptionPeriod = 'monthly' | 'quarterly' | 'semiannual' | 'annual'

export const PERIOD_MULT: Record<SubscriptionPeriod, number> = {
  monthly: 12,
  quarterly: 4,
  semiannual: 2,
  annual: 1,
}

export const PERIOD_LABEL: Record<SubscriptionPeriod, string> = {
  monthly: 'Monthly',
  quarterly: 'Quarterly',
  semiannual: 'Every 6 months',
  annual: 'Annual',
}

export interface SubCard {
  id: string
  name: string
  issuer: string
  short: string
  lastFour: string
}

export interface Subscription {
  id: string
  name: string
  cat: string
  icon: string
  cost: number
  period: SubscriptionPeriod
  day: number
  /** 0-based renewal month (annual/semiannual). */
  renewM?: number
  cardId: string
  plan?: string
  earns?: string
  paused?: boolean
  cancelPending?: boolean
}

export interface SubCategory {
  key: string
  label: string
  icon: string
}

export const SUB_CATEGORIES: SubCategory[] = [
  { key: 'streaming',   label: 'Streaming',         icon: 'film' },
  { key: 'software',    label: 'Software & cloud',   icon: 'code' },
  { key: 'news',        label: 'News & reading',     icon: 'newspaper' },
  { key: 'memberships', label: 'Memberships',        icon: 'package' },
  { key: 'fitness',     label: 'Fitness',            icon: 'dumbbell' },
]

// --- derivation functions ---

export function annualCost(s: Subscription): number {
  return s.cost * (PERIOD_MULT[s.period] ?? 12)
}

/** Native per-period cost (what actually lands on the card each charge). */
export function grossNative(s: Subscription): number {
  return s.cost
}

export function periodSuffix(s: Subscription): string {
  if (s.period === 'annual') return '/yr'
  if (s.period === 'quarterly') return '/qtr'
  if (s.period === 'semiannual') return '/6mo'
  return '/mo'
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function daysInMonth(y: number, m: number): number {
  return new Date(y, m + 1, 0).getDate()
}

export interface DateObj { y: number; m: number; d: number }

function getToday(): DateObj {
  const now = new Date()
  return { y: now.getFullYear(), m: now.getMonth(), d: now.getDate() }
}

function cmpDate(a: DateObj, b: DateObj): number {
  return new Date(a.y, a.m, a.d).getTime() - new Date(b.y, b.m, b.d).getTime()
}

export function nextCharge(s: Subscription, today = getToday()): DateObj {
  const clamp = (y: number, m: number, d: number) => Math.min(d, daysInMonth(y, m))

  if (s.period === 'annual' || s.period === 'semiannual') {
    const renewM = s.renewM ?? 0
    const probe = (yy: number): DateObj => ({ y: yy, m: renewM, d: clamp(yy, renewM, s.day) })
    let next = probe(today.y)
    if (cmpDate(next, today) < 0) next = probe(today.y + 1)

    if (s.period === 'semiannual') {
      const altM = (renewM + 6) % 12
      const alt: DateObj = { y: today.y, m: altM, d: clamp(today.y, altM, s.day) }
      const cands = [next, alt, { ...alt, y: alt.y + 1 }]
        .filter((c) => cmpDate(c, today) >= 0)
        .sort((a, b) => cmpDate(a, b))
      next = cands[0] ?? next
    }
    return next
  }

  const d = s.day
  let { y, m } = today
  if (clamp(y, m, d) < today.d) {
    m += 1
    if (m > 11) { m = 0; y += 1 }
  }
  return { y, m, d: clamp(y, m, d) }
}

export function daysUntil(date: DateObj, today = getToday()): number {
  const MS = 86400000
  return Math.round(
    (new Date(date.y, date.m, date.d).getTime() - new Date(today.y, today.m, today.d).getTime()) / MS
  )
}

export function fmtSubDate(d: DateObj): string {
  return `${MONTHS[d.m]} ${d.d}`
}

// --- aggregates ---

export interface SubSummaryTotals {
  grossAnnual: number
  monthly: number
  count: number
}

export function computeSummary(subs: Subscription[]): SubSummaryTotals {
  const active = subs.filter((s) => !s.paused)
  let grossAnnual = 0

  for (const s of active) {
    grossAnnual += annualCost(s)
  }

  return { grossAnnual, monthly: grossAnnual / 12, count: active.length }
}

export interface RenewalItem {
  sub: Subscription
  date: DateObj
  days: number
  amount: number
}

export function computeRenewals(subs: Subscription[], windowDays = 30): RenewalItem[] {
  return subs
    .filter((s) => !s.paused)
    .map((s) => {
      const date = nextCharge(s)
      const days = daysUntil(date)
      return { sub: s, date, days, amount: grossNative(s) }
    })
    .filter((r) => r.days >= 0 && r.days <= windowDays)
    .sort((a, b) => a.days - b.days)
}
