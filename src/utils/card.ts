import { annualValue, capturedInCycle, capturedYTD } from './perk'
import { sumCents } from './money'
import { CARD_CATALOG } from '@/data/cardCatalog'
import type { Card, VerdictKey } from './types'

export function cardCaptured(card: Card): number {
  return sumCents(card.perks, (p) => capturedInCycle(p, card.openedDate))
}

export function cardCapturedYTD(card: Card): number {
  return sumCents(card.perks, (p) => capturedYTD(p))
}

export function cardAvailable(card: Card): number {
  return sumCents(card.perks, (p) => annualValue(p))
}

/** How many of the card's perks have had at least one credit logged this year. */
export function cardPerksUsed(card: Card): number {
  return card.perks.filter((p) => capturedYTD(p) > 0).length
}

export function cardAnnualFee(card: Card): number {
  return CARD_CATALOG[card.design ?? '']?.annualFee ?? 0
}

export function cardNet(card: Card): number {
  return cardCapturedYTD(card) - cardAnnualFee(card)
}

export function cardVerdict(card: Card): { key: VerdictKey; label: string } {
  if (cardAnnualFee(card) === 0) return { key: 'noFee', label: 'No annual fee' }
  const net = cardNet(card)
  if (net >= 100) return { key: 'worthIt', label: 'Worth it' }
  if (net >= 0) return { key: 'marginal', label: 'Marginal' }
  return { key: 'reviewIt', label: 'Review it' }
}
