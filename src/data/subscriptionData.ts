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

export interface SubCredit {
  cardId: string
  name: string
  /** Monthly-equivalent dollar amount this credit covers. */
  covers: number
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
  credit?: SubCredit
  earns?: string
  paused?: boolean
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

export function monthlyEquiv(s: Subscription): number {
  return annualCost(s) / 12
}

export function coverMonthly(s: Subscription): number {
  if (!s.credit) return 0
  return Math.min(monthlyEquiv(s), s.credit.covers)
}

export function netMonthlyForSub(s: Subscription): number {
  return Math.max(0, monthlyEquiv(s) - coverMonthly(s))
}

export type CoverStatus = 'paused' | 'covered' | 'partly' | 'none'

export function coverStatus(s: Subscription): CoverStatus {
  if (s.paused) return 'paused'
  const cov = coverMonthly(s)
  if (cov <= 0) return 'none'
  return netMonthlyForSub(s) <= 0.001 ? 'covered' : 'partly'
}

function periodNativeMult(s: Subscription): number {
  return s.period === 'annual' ? 12 : s.period === 'semiannual' ? 6 : s.period === 'quarterly' ? 3 : 1
}

export function grossNative(s: Subscription): number {
  return s.cost
}

export function coveredNative(s: Subscription): number {
  if (!s.credit) return 0
  return Math.min(s.cost, s.credit.covers * periodNativeMult(s))
}

export function netNative(s: Subscription): number {
  return Math.max(0, grossNative(s) - coveredNative(s))
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
  coveredAnnual: number
  netAnnual: number
  netMonthly: number
  count: number
  coveredCount: number
}

export function computeSummary(subs: Subscription[]): SubSummaryTotals {
  const active = subs.filter((s) => !s.paused)
  let grossAnnual = 0, coveredAnnual = 0, coveredCount = 0

  for (const s of active) {
    grossAnnual += annualCost(s)
    const cov = coverMonthly(s) * 12
    coveredAnnual += cov
    if (cov > 0) coveredCount++
  }

  const netAnnual = Math.max(0, grossAnnual - coveredAnnual)
  return { grossAnnual, coveredAnnual, netAnnual, netMonthly: netAnnual / 12, count: active.length, coveredCount }
}

export interface RenewalItem {
  sub: Subscription
  date: DateObj
  days: number
  net: number
  covered: number
  status: CoverStatus
}

export function computeRenewals(subs: Subscription[], windowDays = 30): RenewalItem[] {
  return subs
    .filter((s) => !s.paused)
    .map((s) => {
      const date = nextCharge(s)
      const days = daysUntil(date)
      return { sub: s, date, days, net: netNative(s), covered: coveredNative(s), status: coverStatus(s) }
    })
    .filter((r) => r.days >= 0 && r.days <= windowDays)
    .sort((a, b) => a.days - b.days)
}

export interface ByCardRow {
  card: SubCard
  count: number
  gross: number    // monthly
  covered: number  // monthly
}

export function computeByCard(subs: Subscription[], cards: SubCard[]): ByCardRow[] {
  const map = new Map<string, ByCardRow>(
    cards.map((card) => [card.id, { card, count: 0, gross: 0, covered: 0 }])
  )

  for (const s of subs) {
    if (s.paused) continue
    const row = map.get(s.cardId)
    if (!row) continue
    row.count++
    row.gross += monthlyEquiv(s)
    row.covered += coverMonthly(s)
  }

  return [...map.values()].filter((r) => r.count > 0)
}
