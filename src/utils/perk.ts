import { PERIOD_META } from './constants'
import type { Perk, StatusKey } from './types'

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
