import { annualValue, capturedYTD } from './perk'
import type { Card } from './types'

export function cardCaptured(card: Card): number {
  return card.perks.reduce((s, p) => s + capturedYTD(p), 0)
}

export function cardAvailable(card: Card): number {
  return card.perks.reduce((s, p) => s + annualValue(p), 0)
}
