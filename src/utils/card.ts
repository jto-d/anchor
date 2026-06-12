import { annualValue, capturedInCycle, capturedYTD } from './perk'
import { toAmount } from './format'
import type { Card } from './types'

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
