import type { CategoryKey, CardType } from '@/utils/cardRewards'

export interface CardCatalogEntry {
  gradient: string
  text: string
  type: CardType
  network: string
  rewards: { cat: CategoryKey; rate: number }[]
}

const WHITE = '#fff'

export const FALLBACK_CARD: CardCatalogEntry = {
  gradient: 'linear-gradient(150deg, #0D7A78, #083E3C)',
  text: WHITE,
  type: 'cashback',
  network: '',
  rewards: [{ cat: 'base', rate: 1 }],
}

export const CARD_CATALOG: Record<string, CardCatalogEntry> = {
  'amex-gold': {
    gradient: 'linear-gradient(150deg, #D2BF70, #A99941)',
    text: '#3D3413',
    type: 'points',
    network: 'Amex',
    rewards: [
      { cat: 'dining', rate: 4 },
      { cat: 'groceries', rate: 4 },
      { cat: 'travel', rate: 3 },
      { cat: 'base', rate: 1 },
    ],
  },
  'amex-platinum': {
    gradient: 'linear-gradient(150deg, #F1F1F3, #BEBEC0)',
    text: '#27272A',
    type: 'points',
    network: 'Amex',
    rewards: [
      { cat: 'travel', rate: 5 },
      { cat: 'hotels', rate: 5 },
      { cat: 'base', rate: 1 },
    ],
  },
  'chase-sapphire-preferred': {
    gradient: 'linear-gradient(150deg, #0671AC, #01082E)',
    text: WHITE,
    type: 'points',
    network: 'Visa Signature',
    rewards: [
      { cat: 'travel', rate: 5 },
      { cat: 'hotels', rate: 5 },
      { cat: 'dining', rate: 3 },
      { cat: 'streaming', rate: 3 },
      { cat: 'groceries', rate: 3 },
      { cat: 'base', rate: 1 },
    ],
  },
  'united-quest': {
    gradient: 'linear-gradient(150deg, #461864, #33184A)',
    text: WHITE,
    type: 'points',
    network: 'Visa Signature',
    rewards: [
      { cat: 'travel', rate: 3 },
      { cat: 'hotels', rate: 3 },
      { cat: 'dining', rate: 2 },
      { cat: 'base', rate: 1 },
    ],
  },
  'bilt-palladium': {
    gradient: 'linear-gradient(150deg, #006688, #01082E)',
    text: WHITE,
    type: 'points',
    network: 'Mastercard',
    rewards: [
      { cat: 'dining', rate: 3 },
      { cat: 'travel', rate: 2 },
      { cat: 'base', rate: 1 },
    ],
  },
  'chase-aeroplan': {
    gradient: 'linear-gradient(150deg, #006688, #01082E)',
    text: WHITE,
    type: 'points',
    network: 'Visa Infinite',
    rewards: [
      { cat: 'dining', rate: 3 },
      { cat: 'groceries', rate: 2 },
      { cat: 'travel', rate: 2 },
      { cat: 'base', rate: 1 },
    ],
  },
  'united-explorer': {
    gradient: 'linear-gradient(150deg, #0097A7, #01082E)',
    text: WHITE,
    type: 'points',
    network: 'Visa Signature',
    rewards: [
      { cat: 'travel', rate: 2 },
      { cat: 'dining', rate: 2 },
      { cat: 'hotels', rate: 2 },
      { cat: 'base', rate: 1 },
    ],
  },
}
