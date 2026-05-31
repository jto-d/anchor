import { annualValue, capturedYTD } from './perk'
import { brand } from '@/lib/theme'
import type { Card } from './types'

export function cardCaptured(card: Card): number {
  return card.perks.reduce((s, p) => s + capturedYTD(p), 0)
}

export function cardAvailable(card: Card): number {
  return card.perks.reduce((s, p) => s + annualValue(p), 0)
}

export function cardGradient(card: Card): string {
  return brand.cardGradient[card.design as keyof typeof brand.cardGradient] ?? brand.cardGradient.teal
}
