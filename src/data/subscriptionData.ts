/** Subscriptions data model — static seed data + pure derivation functions. */

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

export const SUB_CARDS: Record<string, SubCard> = {
  amex_plat: { id: 'amex_plat', name: 'Platinum Card', issuer: 'American Express', short: 'Amex', lastFour: '1009' },
  csr:       { id: 'csr', name: 'Sapphire Reserve', issuer: 'Chase', short: 'Chase', lastFour: '4477' },
  bcp:       { id: 'bcp', name: 'Blue Cash Preferred', issuer: 'American Express', short: 'Amex', lastFour: '3382' },
}

export const SUB_CATEGORIES: SubCategory[] = [
  { key: 'streaming',   label: 'Streaming',         icon: 'film' },
  { key: 'software',    label: 'Software & cloud',   icon: 'code' },
  { key: 'news',        label: 'News & reading',     icon: 'newspaper' },
  { key: 'memberships', label: 'Memberships',        icon: 'package' },
  { key: 'fitness',     label: 'Fitness',            icon: 'dumbbell' },
]

export const SEED_SUBSCRIPTIONS: Subscription[] = [
  // Streaming
  { id: 'netflix',   name: 'Netflix',               cat: 'streaming',   icon: 'tv',       cost: 22.99, period: 'monthly', day: 22, cardId: 'csr',       plan: 'Premium 4K' },
  { id: 'disney',    name: 'Disney Bundle',          cat: 'streaming',   icon: 'film',     cost: 19.99, period: 'monthly', day: 8,  cardId: 'amex_plat', plan: 'Disney+, Hulu, ESPN+',
    credit: { cardId: 'amex_plat', name: 'Digital entertainment', covers: 19.99 } },
  { id: 'max',       name: 'Max',                    cat: 'streaming',   icon: 'film',     cost: 16.99, period: 'monthly', day: 15, cardId: 'bcp',       plan: 'Ultimate Ad-Free', earns: '6% back' },
  { id: 'spotify',   name: 'Spotify',                cat: 'streaming',   icon: 'music',    cost: 11.99, period: 'monthly', day: 5,  cardId: 'bcp',       plan: 'Premium Individual', earns: '6% back' },
  { id: 'youtube',   name: 'YouTube Premium',        cat: 'streaming',   icon: 'play',     cost: 13.99, period: 'monthly', day: 28, cardId: 'csr',       plan: 'Individual' },
  // Software & cloud
  { id: 'adobe',     name: 'Adobe Creative Cloud',   cat: 'software',    icon: 'code',     cost: 59.99, period: 'monthly', day: 3,  cardId: 'csr',       plan: 'All Apps' },
  { id: 'chatgpt',   name: 'ChatGPT Plus',            cat: 'software',    icon: 'sparkles', cost: 20.00, period: 'monthly', day: 20, cardId: 'csr',       plan: 'Plus' },
  { id: 'icloud',    name: 'iCloud+',                 cat: 'software',    icon: 'cloud',    cost: 9.99,  period: 'monthly', day: 1,  cardId: 'amex_plat', plan: '2 TB' },
  { id: 'notion',    name: 'Notion',                  cat: 'software',    icon: 'code',     cost: 10.00, period: 'monthly', day: 12, cardId: 'csr',       plan: 'Plus' },
  { id: '1pass',     name: '1Password',               cat: 'software',    icon: 'code',     cost: 35.88, period: 'annual',  day: 9,  renewM: 7, cardId: 'csr', plan: 'Individual' },
  // News & reading
  { id: 'nyt',       name: 'The New York Times',      cat: 'news',        icon: 'newspaper',cost: 25.00, period: 'monthly', day: 24, cardId: 'amex_plat', plan: 'All Access',
    credit: { cardId: 'amex_plat', name: 'Digital entertainment', covers: 20.00 } },
  { id: 'wsj',       name: 'The Wall Street Journal', cat: 'news',        icon: 'newspaper',cost: 38.99, period: 'monthly', day: 9,  cardId: 'bcp',       plan: 'Digital' },
  // Memberships
  { id: 'prime',     name: 'Amazon Prime',            cat: 'memberships', icon: 'package',  cost: 139.00,period: 'annual',  day: 3,  renewM: 6, cardId: 'csr',       plan: 'Annual' },
  { id: 'walmart',   name: 'Walmart+',                cat: 'memberships', icon: 'package',  cost: 12.95, period: 'monthly', day: 18, cardId: 'amex_plat', plan: 'Monthly',
    credit: { cardId: 'amex_plat', name: 'Walmart+ credit', covers: 12.95 } },
  { id: 'uberone',   name: 'Uber One',                cat: 'memberships', icon: 'repeat',   cost: 9.99,  period: 'monthly', day: 12, cardId: 'amex_plat', plan: 'Monthly',
    credit: { cardId: 'amex_plat', name: 'Uber Cash', covers: 9.99 } },
  { id: 'costco',    name: 'Costco Gold Star',         cat: 'memberships', icon: 'package',  cost: 65.00, period: 'annual',  day: 1,  renewM: 10, cardId: 'bcp', plan: 'Gold Star' },
  // Fitness
  { id: 'peloton',   name: 'Peloton App',              cat: 'fitness',     icon: 'dumbbell', cost: 12.99, period: 'monthly', day: 6,  cardId: 'csr',       plan: 'App One' },
  { id: 'classpass', name: 'ClassPass',                cat: 'fitness',     icon: 'dumbbell', cost: 49.00, period: 'monthly', day: 15, cardId: 'csr',       plan: '5 credits', paused: true },
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

export function computeByCard(subs: Subscription[]): ByCardRow[] {
  const map = new Map<string, ByCardRow>(
    Object.entries(SUB_CARDS).map(([id, card]) => [id, { card, count: 0, gross: 0, covered: 0 }])
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
