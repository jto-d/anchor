import { annualValue, capturedInCycle, capturedYTD } from './perk'
import { toAmount } from './format'
import { CARD_CATALOG } from '@/data/cardCatalog'
import type { Card, VerdictKey } from './types'

export function cardCaptured(card: Card): number {
  return card.perks.reduce((s, p) => s + capturedInCycle(p, card.openedDate), 0)
}

export function cardCapturedYTD(card: Card): number {
  return card.perks.reduce((s, p) => s + capturedYTD(p), 0)
}

export function cardAvailable(card: Card): number {
  return card.perks.reduce((s, p) => s + annualValue(p), 0)
}

// Sum of unused budget remaining in each perk's active cycle.
export function cardOnTheTable(card: Card): number {
  return card.perks.reduce(
    (s, p) => s + Math.max(0, toAmount(p.totalAmount) - capturedInCycle(p, card.openedDate)),
    0
  )
}

export function cardAnnualFee(card: Card): number {
  return CARD_CATALOG[card.design ?? '']?.annualFee ?? 0
}

export function cardNet(card: Card): number {
  return cardAvailable(card) - cardAnnualFee(card)
}

export function cardVerdict(card: Card): { key: VerdictKey; label: string } {
  const net = cardNet(card)
  if (net >= 100) return { key: 'worthIt', label: 'Worth it' }
  if (net >= 0) return { key: 'marginal', label: 'Marginal' }
  return { key: 'reviewIt', label: 'Review it' }
}
