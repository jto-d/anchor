const MONTHS_ABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export const SPLIT_CATS: Record<string, { label: string; icon: string }> = {
  groceries:     { label: 'Groceries',     icon: 'ShoppingCart' },
  dining:        { label: 'Dining',         icon: 'Restaurant' },
  home:          { label: 'Home',           icon: 'Home' },
  utilities:     { label: 'Utilities',      icon: 'Bolt' },
  internet:      { label: 'Internet',       icon: 'Wifi' },
  transport:     { label: 'Transport',      icon: 'DirectionsCar' },
  entertainment: { label: 'Entertainment',  icon: 'Movie' },
  travel:        { label: 'Travel',         icon: 'FlightTakeoff' },
  other:         { label: 'Other',          icon: 'Receipt' },
}

export const CAT_KEYS = Object.keys(SPLIT_CATS)

export interface SplitExpense {
  id: string
  year: number
  month: number
  date: string | null
  desc: string
  amount: number
  payer: string
  cat: string
  splitYou: number
  splitThem: number
  createdAt: string
}

export interface SplitSettlement {
  id: string
  year: number
  month: number
  date: string | null
  amount: number
  fromPayer: string
  createdAt: string
}

export interface SplitMonth {
  key: string
  year: number
  month: number
  label: string
  expenses: SplitExpense[]
  settlements: SplitSettlement[]
}

export interface MonthTotals {
  total: number
  youPaid: number
  themPaid: number
  youShare: number
  themShare: number
  settledTotal: number
  net: number
}

export interface BalanceStatus {
  state: 'settled' | 'owe' | 'owed'
  tone: 'neutral' | 'amber' | 'accent'
  label: string
  amount: number
}

export function monthKey(year: number, month: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}`
}

export function monthLabel(year: number, month: number): string {
  return `${MONTHS_LONG[month]} ${year}`
}

export function fmtMonthShort(iso: string): string {
  const [, m, d] = iso.split('-').map(Number)
  return `${MONTHS_ABBR[m - 1]} ${d}`
}

export function groupByMonth(
  expenses: SplitExpense[],
  settlements: SplitSettlement[],
): SplitMonth[] {
  const map = new Map<string, SplitMonth>()

  for (const e of expenses) {
    const key = monthKey(e.year, e.month)
    if (!map.has(key)) {
      map.set(key, { key, year: e.year, month: e.month, label: monthLabel(e.year, e.month), expenses: [], settlements: [] })
    }
    map.get(key)!.expenses.push(e)
  }

  for (const s of settlements) {
    const key = monthKey(s.year, s.month)
    if (!map.has(key)) {
      map.set(key, { key, year: s.year, month: s.month, label: monthLabel(s.year, s.month), expenses: [], settlements: [] })
    }
    map.get(key)!.settlements.push(s)
  }

  return Array.from(map.values()).sort((a, b) => {
    if (b.year !== a.year) return b.year - a.year
    return b.month - a.month
  })
}

export function monthTotals(month: SplitMonth): MonthTotals {
  let total = 0, youPaid = 0, themPaid = 0, youShare = 0, themShare = 0
  for (const e of month.expenses) {
    total += e.amount
    if (e.payer === 'you') youPaid += e.amount; else themPaid += e.amount
    youShare += e.amount * (e.splitYou / 100)
    themShare += e.amount * (e.splitThem / 100)
  }
  let settleYou = 0, settleThem = 0
  for (const s of month.settlements) {
    if (s.fromPayer === 'you') settleYou += s.amount; else settleThem += s.amount
  }
  const rawNet = (youShare - youPaid) - settleYou + settleThem
  const net = Math.abs(rawNet) < 0.005 ? 0 : rawNet
  return { total, youPaid, themPaid, youShare, themShare, settledTotal: settleYou + settleThem, net }
}

export function balanceStatus(net: number): BalanceStatus {
  if (net === 0) return { state: 'settled', tone: 'neutral', label: 'Settled', amount: 0 }
  if (net > 0) return { state: 'owe', tone: 'amber', label: 'You owe', amount: net }
  return { state: 'owed', tone: 'accent', label: "You're owed", amount: -net }
}

export function splitMoney(n: number, cents = true): string {
  const v = Math.abs(n)
  if (cents) return '$' + v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  return '$' + Math.round(v).toLocaleString('en-US')
}

const CAT_HINTS: [string, string[]][] = [
  ['groceries', ['grocer', 'trader', 'costco', 'whole foods', 'market', 'safeway', 'aldi']],
  ['dining', ['dinner', 'lunch', 'brunch', 'restaurant', 'bar', 'cafe', 'coffee', 'bakery', 'takeout', 'pizza']],
  ['home', ['rent', 'furniture', 'ikea', 'vacuum', 'cleaning', 'hardware', 'supplies']],
  ['utilities', ['electric', 'gas bill', 'water', 'pg&e', 'utility', 'utilities', 'power']],
  ['internet', ['internet', 'wifi', 'comcast', 'sonic', 'broadband']],
  ['transport', ['uber', 'lyft', 'gas', 'fuel', 'parking', 'transit', 'bart', 'train']],
  ['entertainment', ['concert', 'movie', 'tickets', 'show', 'game', 'amc', 'netflix']],
  ['travel', ['hotel', 'airbnb', 'rental', 'trip', 'tahoe', 'flight', 'vacation']],
]

export function guessCat(desc: string): string {
  const d = desc.toLowerCase()
  for (const [cat, words] of CAT_HINTS) {
    if (words.some((w) => d.includes(w))) return cat
  }
  return 'other'
}

export function todayKey(): string {
  const now = new Date()
  return monthKey(now.getFullYear(), now.getMonth())
}

export function currentYearMonth(): { year: number; month: number } {
  const now = new Date()
  return { year: now.getFullYear(), month: now.getMonth() }
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}
