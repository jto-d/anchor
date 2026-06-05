import type { CategoryKey, CardType } from '@/utils/cardRewards'

export interface CardCatalogEntry {
  name: string
  issuer: string
  gradient: string
  text: string
  type: CardType
  network: string
  rewards: { cat: CategoryKey; rate: number }[]
}

const WHITE = '#fff'
const BILT_GREY = '#CBC8C2'

export const FALLBACK_CARD: CardCatalogEntry = {
  name: '',
  issuer: '',
  gradient: 'linear-gradient(150deg, #0D7A78, #083E3C)',
  text: WHITE,
  type: 'cashback',
  network: '',
  rewards: [{ cat: 'base', rate: 1 }],
}

export const CARD_CATALOG: Record<string, CardCatalogEntry> = {
  'amex-gold': {
    name: 'Gold Card',
    issuer: 'American Express',
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
    name: 'Platinum Card',
    issuer: 'American Express',
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
  'bofa-customized-cash': {
    name: 'Customized Cash Rewards',
    issuer: 'Bank of America',
    gradient: 'linear-gradient(150deg, #C61F2D, #A41422)',
    text: WHITE,
    type: 'cashback',
    network: 'Visa Signature',
    rewards: [
      { cat: 'groceries', rate: 2 },
      { cat: 'retail', rate: 3 },
      { cat: 'base', rate: 1 },
    ],
  },
  'chase-sapphire-preferred': {
    name: 'Sapphire Preferred',
    issuer: 'Chase',
    gradient: 'linear-gradient(150deg, #0671AC, #01082E)',
    text: WHITE,
    type: 'points',
    network: 'Visa Signature',
    rewards: [
      { cat: 'travel', rate: 2 },
      { cat: 'transit', rate: 2 },
      { cat: 'hotels', rate: 2 },
      { cat: 'dining', rate: 3 },
      { cat: 'streaming', rate: 3 },
      { cat: 'portal', rate: 5 },
      { cat: 'groceries', rate: 3},
      { cat: 'base', rate: 1 },
    ],
  },
  'chase-sapphire-reserve': {
    name: 'Sapphire Reserve',
    issuer: 'Chase',
    gradient: 'linear-gradient(150deg, #D4C6B6, #0B1325)',
    text: WHITE,
    type: 'points',
    network: 'Visa Signature',
    rewards: [
      { cat: 'travel', rate: 4 },
      { cat: 'hotels', rate: 4 },
      { cat: 'dining', rate: 3 },
      { cat: 'portal', rate: 8 },
      { cat: 'base', rate: 1 },
    ],
  },
  'chase-freedom-unlimited': {
    name: 'Freedom Unlimited',
    issuer: 'Chase',
    gradient: 'linear-gradient(150deg, #16498A, #141631)',
    text: WHITE,
    type: 'points',
    network: 'Visa Signature',
    rewards: [
      { cat: 'dining', rate: 3 },
      { cat: 'drugstore', rate: 3 },
      { cat: 'portal', rate: 3 },
      { cat: 'base', rate: 1.5 },
    ],
  },
  'united-quest': {
    name: 'United Quest',
    issuer: 'Chase',
    gradient: 'linear-gradient(150deg, #461864, #33184A)',
    text: WHITE,
    type: 'points',
    network: 'Visa Signature',
    rewards: [
      { cat: 'travel', rate: 2 },
      { cat: 'transit', rate: 2 },
      { cat: 'hotels', rate: 2 },
      { cat: 'dining', rate: 2 },
      { cat: 'streaming', rate: 2 },
      { cat: 'portal', rate: 5 },
      { cat: 'base', rate: 1 },
    ],
  },
  'united-explorer': {
    name: 'United Explorer',
    issuer: 'Chase',
    gradient: 'linear-gradient(150deg, #034491, #021B3A)',
    text: WHITE,
    type: 'points',
    network: 'Visa Signature',
    rewards: [
      { cat: 'hotels', rate: 2 },
      { cat: 'dining', rate: 2 },
      { cat: 'base', rate: 1 },
    ],
  },
  'united-gateway': {
    name: 'United Gateway',
    issuer: 'Chase',
    gradient: 'linear-gradient(150deg, #A5BDC5, #83979F)',
    text: WHITE,
    type: 'points',
    network: 'Visa Signature',
    rewards: [
      { cat: 'transit', rate: 2 },
      { cat: 'gas', rate: 2 },
      { cat: 'base', rate: 1 },
    ],
  },
  'chase-aeroplan': {
    name: 'Aeroplan',
    issuer: 'Chase',
    gradient: 'linear-gradient(150deg, #515459, #373C40)',
    text: WHITE,
    type: 'points',
    network: 'Mastercard',
    rewards: [
      { cat: 'dining', rate: 3 },
      { cat: 'portal', rate: 3 },
      { cat: 'groceries', rate: 3},
      { cat: 'base', rate: 1 },
    ],
  },
  'bilt-blue': {
    name: 'Bilt Blue',
    issuer: 'Bilt',
    gradient: 'linear-gradient(150deg, #1A3045, #182736)',
    text: BILT_GREY,
    type: 'points',
    network: 'Mastercard',
    rewards: [
      { cat: 'base', rate: 1 },
    ],
  },
  'bilt-obsidian': {
    name: 'Bilt Obsidian',
    issuer: 'Bilt',
    gradient: 'linear-gradient(150deg, #3D3D3D, #111111)',
    text: BILT_GREY,
    type: 'points',
    network: 'Mastercard',
    rewards: [
      { cat: 'travel', rate: 2 },
      { cat: 'dining', rate: 3 },
      { cat: 'groceries', rate: 3},
      { cat: 'base', rate: 1 },
    ],
  },
  'bilt-palladium': {
    name: 'Bilt Palladium',
    issuer: 'Bilt',
    gradient: 'linear-gradient(150deg, #B1ACA6, #63625E)',
    text: BILT_GREY,
    type: 'points',
    network: 'Mastercard',
    rewards: [
      { cat: 'base', rate: 2 },
    ],
  },
}
