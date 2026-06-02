import { CARD_CATALOG, FALLBACK_CARD } from '@/data/cardCatalog'

export interface CardDesign {
  gradient: string
  text: string
}

export function resolveCardDesign(design?: string | null): CardDesign {
  const entry = (design && CARD_CATALOG[design]) || FALLBACK_CARD
  return { gradient: entry.gradient, text: entry.text }
}
