export type AccountType =
  | 'CHECKING'
  | 'SAVINGS'
  | 'CD'
  | 'MONEY_MARKET'
  | 'BROKERAGE'
  | 'FOUR_OH_ONE_K'
  | 'ROTH_IRA'
  | 'TRADITIONAL_IRA'
  | 'HSA'
  | 'FIVE_TWO_NINE'
  | 'CRYPTO'
  | 'CREDIT_CARD'
  | 'CHARGE_CARD'

export type AccountSource = 'PLAID' | 'MANUAL'
export type AccountGroup = 'cash' | 'inv' | 'credit'
export type AssetClass = 'stock' | 'intl' | 'bond' | 'cash'

export interface Account {
  id: string
  type: AccountType
  source: AccountSource
  inst: string
  nick: string
  balance: number
  isEmergencyFund?: boolean
  refreshed: string
  drift: number
  vol: number
}

export interface Holding {
  ticker: string
  name: string
  shares: number | null
  value: number
  cls: AssetClass
}

export interface AccountTypeMeta {
  label: string
  glyph: string
  group: AccountGroup
}

export const ACCOUNT_TYPES: Record<AccountType, AccountTypeMeta> = {
  CHECKING:        { label: 'Checking',        glyph: 'building',   group: 'cash' },
  SAVINGS:         { label: 'Savings',         glyph: 'piggyBank',  group: 'cash' },
  CD:              { label: 'CD',              glyph: 'landmark',   group: 'cash' },
  MONEY_MARKET:    { label: 'Money market',    glyph: 'landmark',   group: 'cash' },
  BROKERAGE:       { label: 'Brokerage',       glyph: 'trendingUp', group: 'inv' },
  FOUR_OH_ONE_K:   { label: '401(k)',          glyph: 'briefcase',  group: 'inv' },
  ROTH_IRA:        { label: 'Roth IRA',        glyph: 'landmark',   group: 'inv' },
  TRADITIONAL_IRA: { label: 'Traditional IRA', glyph: 'landmark',   group: 'inv' },
  HSA:             { label: 'HSA',             glyph: 'heartPulse', group: 'inv' },
  FIVE_TWO_NINE:   { label: '529',             glyph: 'graduation', group: 'inv' },
  CRYPTO:          { label: 'Crypto',          glyph: 'bitcoin',    group: 'inv' },
  CREDIT_CARD:     { label: 'Credit card',     glyph: 'creditCard', group: 'credit' },
  CHARGE_CARD:     { label: 'Charge card',     glyph: 'creditCard', group: 'credit' },
}

export const CASH_TYPE_KEYS: AccountType[] = ['CHECKING', 'SAVINGS', 'CD', 'MONEY_MARKET']
export const INV_TYPE_KEYS: AccountType[] = [
  'BROKERAGE', 'FOUR_OH_ONE_K', 'ROTH_IRA', 'TRADITIONAL_IRA', 'HSA', 'FIVE_TWO_NINE', 'CRYPTO',
]
export const CREDIT_TYPE_KEYS: AccountType[] = ['CREDIT_CARD', 'CHARGE_CARD']

export const ASSET_CLASSES: Record<AssetClass, { label: string; color: string }> = {
  stock: { label: 'U.S. stocks', color: '#0B6360' },
  intl:  { label: 'Intl stocks', color: '#29A8A6' },
  bond:  { label: 'Bonds',       color: '#97D8D7' },
  cash:  { label: 'Cash',        color: '#D4D4D8' },
}

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
export const TODAY = { y: 2026, m: 5, d: 16 } // Jun 16, 2026

export const SEED_ACCOUNTS: Account[] = [
  { id: 'a_chk',  type: 'CHECKING',      source: 'PLAID',  inst: 'Chase',       nick: 'Everyday checking',   balance: 8420,   refreshed: '2h ago',  drift: 0.002, vol: 0.05  },
  { id: 'a_emg',  type: 'SAVINGS',       source: 'PLAID',  inst: 'Ally Bank',   nick: 'Emergency fund',      balance: 24000,  isEmergencyFund: true, refreshed: '2h ago',  drift: 0.004, vol: 0.01  },
  { id: 'a_house',type: 'SAVINGS',       source: 'PLAID',  inst: 'Marcus',      nick: 'House down payment',  balance: 52300,  refreshed: '1d ago',  drift: 0.012, vol: 0.008 },
  { id: 'a_cd',   type: 'CD',            source: 'MANUAL', inst: 'Capital One', nick: '12-month CD',         balance: 15000,  refreshed: 'Mar 4',   drift: 0.002, vol: 0     },
  { id: 'a_brk',  type: 'BROKERAGE',     source: 'PLAID',  inst: 'Fidelity',    nick: 'Taxable brokerage',   balance: 142800, refreshed: '2h ago',  drift: 0.013, vol: 0.03  },
  { id: 'a_401k', type: 'FOUR_OH_ONE_K', source: 'PLAID',  inst: 'Fidelity',    nick: 'Employer 401(k)',     balance: 168500, refreshed: '2h ago',  drift: 0.015, vol: 0.028 },
  { id: 'a_roth', type: 'ROTH_IRA',      source: 'PLAID',  inst: 'Vanguard',    nick: 'Roth IRA',            balance: 39200,  refreshed: '1d ago',  drift: 0.014, vol: 0.03  },
  { id: 'a_hsa',  type: 'HSA',           source: 'PLAID',  inst: 'Fidelity',    nick: 'HSA',                 balance: 5600,   refreshed: '2h ago',  drift: 0.011, vol: 0.025 },
  { id: 'a_crypto',type: 'CRYPTO',       source: 'MANUAL', inst: 'Coinbase',    nick: 'Crypto',              balance: 9180,   refreshed: 'Jun 20',  drift: 0.02,  vol: 0.09  },
]

export const SEED_HOLDINGS: Record<string, Holding[]> = {
  a_brk: [
    { ticker: 'VTI',  name: 'Vanguard Total Stock Market',   shares: 240, value: 64080, cls: 'stock' },
    { ticker: 'AAPL', name: 'Apple Inc.',                    shares: 120, value: 26160, cls: 'stock' },
    { ticker: 'BND',  name: 'Vanguard Total Bond Market',    shares: 430, value: 31390, cls: 'bond'  },
    { ticker: 'VXUS', name: 'Vanguard Total Intl Stock',     shares: 180, value: 11520, cls: 'intl'  },
    { ticker: 'CASH', name: 'Sweep / settlement',            shares: null, value: 9650, cls: 'cash'  },
  ],
  a_401k: [
    { ticker: 'FXAIX', name: 'Fidelity 500 Index',           shares: 410, value: 92675, cls: 'stock' },
    { ticker: 'FSPSX', name: 'Fidelity Intl Index',          shares: 520, value: 25400, cls: 'intl'  },
    { ticker: 'FXNAX', name: 'Fidelity U.S. Bond Index',     shares: 3900,value: 42125, cls: 'bond'  },
    { ticker: 'CASH',  name: 'Money market',                 shares: null, value: 8300, cls: 'cash'  },
  ],
  a_roth: [
    { ticker: 'VOO',  name: 'Vanguard S&P 500',              shares: 52,  value: 28400, cls: 'stock' },
    { ticker: 'VXUS', name: 'Vanguard Total Intl Stock',     shares: 106, value: 6800,  cls: 'intl'  },
    { ticker: 'BND',  name: 'Vanguard Total Bond Market',    shares: 55,  value: 4000,  cls: 'bond'  },
  ],
  a_hsa: [
    { ticker: 'VTI',  name: 'Vanguard Total Stock Market',   shares: 16,  value: 4200,  cls: 'stock' },
    { ticker: 'CASH', name: 'HSA cash',                      shares: null, value: 1400, cls: 'cash'  },
  ],
}

// Deterministic per-account 12-point monthly series
function mulberry32(seed: number) {
  return function () {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
function hashSeed(str: string) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619) }
  return h >>> 0
}
export function makeSeries(id: string, end: number, drift: number, vol: number, n = 12): number[] {
  const rnd = mulberry32(hashSeed(id))
  const raw: number[] = new Array(n)
  raw[n - 1] = end
  let v = end
  for (let i = n - 2; i >= 0; i--) {
    const noise = (rnd() - 0.5) * 2 * vol
    v = v / (1 + drift + noise)
    raw[i] = v
  }
  return raw.map((x) => Math.round(x))
}

export const SERIES: Record<string, number[]> = {}
SEED_ACCOUNTS.forEach((a) => { SERIES[a.id] = makeSeries(a.id, a.balance, a.drift, a.vol) })

export function netWorthSeries(accounts: Account[]): number[] {
  const n = 12
  const out = new Array(n).fill(0)
  accounts.forEach((a) => {
    const sign = ACCOUNT_TYPES[a.type]?.group === 'credit' ? -1 : 1
    const s = SERIES[a.id] ?? makeSeries(a.id, a.balance, a.drift, a.vol)
    for (let i = 0; i < n; i++) out[i] += sign * (s[i] ?? 0)
  })
  return out
}

export function fmtMoney(n: number, cents?: boolean): string {
  const v = Number(n) || 0
  const neg = v < 0
  const abs = Math.abs(v)
  const str = cents
    ? abs.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : Math.round(abs).toLocaleString('en-US')
  return `${neg ? '−' : ''}$${str}`
}
export function fmtSigned(n: number, cents?: boolean): string {
  const v = Number(n) || 0
  if (v < 0) return fmtMoney(v, cents)
  return `+${fmtMoney(v, cents)}`
}
export function fmtCompact(n: number): string {
  const v = Math.abs(Number(n) || 0)
  if (v >= 1000) return `$${(v / 1000).toFixed(v >= 100000 ? 0 : 1)}k`
  return `$${Math.round(v)}`
}

export const RANGE_COUNTS: Record<string, number> = { '3M': 4, '6M': 7, '1Y': 12, 'All': 12 }

export const PLAID_INSTITUTIONS = [
  { name: 'Chase',          glyph: 'building',   color: '#117ACA' },
  { name: 'Bank of America',glyph: 'building',   color: '#E11B3C' },
  { name: 'Wells Fargo',    glyph: 'building',   color: '#D71E2B' },
  { name: 'Fidelity',       glyph: 'trendingUp', color: '#398039' },
  { name: 'Vanguard',       glyph: 'landmark',   color: '#96151D' },
  { name: 'Ally Bank',      glyph: 'piggyBank',  color: '#6B1A8E' },
  { name: 'Charles Schwab', glyph: 'trendingUp', color: '#00A0DF' },
  { name: 'Capital One',    glyph: 'landmark',   color: '#D03027' },
]
