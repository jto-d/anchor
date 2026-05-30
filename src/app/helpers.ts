import type { MeQuery } from '@/gql/graphql'

export type Card = MeQuery['me']['creditCards'][number]
export type Perk = Card['perks'][number]
export type PerkCredit = Perk['perkCredits'][number]

export type StatusKey = 'captured' | 'partial' | 'expiring' | 'open' | 'forfeited'

const PERIOD_META = {
  MONTHLY:     { label: 'Monthly',     per: 12 },
  QUARTERLY:   { label: 'Quarterly',   per: 4  },
  SEMI_ANNUAL: { label: 'Semi-annual', per: 2  },
  ANNUAL:      { label: 'Annual',      per: 1  },
} as const

export const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export function annualValue(perk: Perk): number {
  const meta = PERIOD_META[perk.period as keyof typeof PERIOD_META]
  return parseFloat(perk.totalAmount) * (meta?.per ?? 1)
}

export function capturedYTD(perk: Perk): number {
  return perk.perkCredits.reduce((s, c) => s + parseFloat(c.amount), 0)
}

export function perkPct(perk: Perk): number {
  const av = annualValue(perk)
  return av === 0 ? 0 : Math.min(1, capturedYTD(perk) / av)
}

export function cardCaptured(card: Card): number {
  return card.perks.reduce((s, p) => s + capturedYTD(p), 0)
}

export function cardAvailable(card: Card): number {
  return card.perks.reduce((s, p) => s + annualValue(p), 0)
}

export function fmt(n: number): string {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

export function fmt2(n: number): string {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function perkStatus(perk: Perk): { key: StatusKey; label: string } {
  const pct = perkPct(perk)
  if (pct >= 1) return { key: 'captured', label: 'Captured' }
  if (perk.period === 'MONTHLY' && capturedYTD(perk) === 0) return { key: 'expiring', label: 'Resets soon' }
  if (pct === 0) return { key: 'open', label: 'Available' }
  return { key: 'partial', label: 'In progress' }
}

export function periodLabel(period: string): string {
  return PERIOD_META[period as keyof typeof PERIOD_META]?.label ?? period
}

export function cardTheme(issuer: string): 'teal' | 'ink' {
  return issuer.toLowerCase().includes('chase') ? 'teal' : 'ink'
}
