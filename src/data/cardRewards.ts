import { resolveCardDesign } from '@/lib/cardDesigns'

export type CategoryKey =
  | 'dining' | 'groceries' | 'travel' | 'hotels' | 'gas'
  | 'transit' | 'streaming' | 'drugstore' | 'retail' | 'base'

export type CardTheme = 'ink' | 'teal' | 'gold' | 'slate' | 'espresso' | 'pewter'
export type CardType = 'cashback' | 'points'
export type TileStyle = 'statement' | 'face' | 'band'
export type Density = 'comfortable' | 'compact'
export type SuggestMode = 'picker' | 'matrix'
export type LayoutMode = 'grid' | 'list'

export interface Category {
  key: CategoryKey
  label: string
  icon: string
  blurb: string
}

export interface Reward {
  cat: CategoryKey
  rate: number
  unit: 'x' | '%'
  viaBase?: boolean
}

export interface RewardCardData {
  id: string
  name: string
  issuer: string
  lastFour: string
  design?: string
  type: CardType
  theme: CardTheme
  network: string
  rewards: Reward[]
}

export interface RankedCard {
  card: RewardCardData
  reward: Reward
  winner: boolean
  viaBase: boolean
}

export const CATEGORIES: Category[] = [
  { key: 'dining',    label: 'Dining',         icon: 'dining',    blurb: 'Restaurants, bars, takeout & delivery' },
  { key: 'groceries', label: 'Groceries',      icon: 'groceries', blurb: 'Supermarkets & grocery stores' },
  { key: 'travel',    label: 'Travel',         icon: 'travel',    blurb: 'Flights, trains & travel portals' },
  { key: 'hotels',    label: 'Hotels',         icon: 'hotel',     blurb: 'Hotels & lodging' },
  { key: 'gas',       label: 'Gas',            icon: 'gas',       blurb: 'Fuel & gas stations' },
  { key: 'transit',   label: 'Transit',        icon: 'transit',   blurb: 'Rideshare, parking, tolls & transit' },
  { key: 'streaming', label: 'Streaming',      icon: 'streaming', blurb: 'Streaming subscriptions' },
  { key: 'drugstore', label: 'Drugstores',     icon: 'drugstore', blurb: 'Pharmacies & drugstores' },
  { key: 'retail',    label: 'Online retail',  icon: 'retail',    blurb: 'Online shopping & marketplaces' },
  { key: 'base',      label: 'Everything else',icon: 'base',      blurb: 'The flat catch-all rate' },
]

export const CAT: Record<CategoryKey, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.key, c])
) as Record<CategoryKey, Category>

export const CARD_THEMES: Record<CardTheme, { grad: string; dot: string }> = {
  ink:      { grad: 'linear-gradient(150deg, #3F3F46, #09090B)', dot: '#27272A' },
  teal:     { grad: 'linear-gradient(150deg, #0D7A78, #083E3C)', dot: '#0B6360' },
  gold:     { grad: 'linear-gradient(150deg, #9A7B33, #3D3015)', dot: '#8A6D2F' },
  slate:    { grad: 'linear-gradient(150deg, #5A6675, #272E38)', dot: '#475569' },
  espresso: { grad: 'linear-gradient(150deg, #594E45, #241E19)', dot: '#4A4039' },
  pewter:   { grad: 'linear-gradient(150deg, #71717A, #3F3F46)', dot: '#52525B' },
}

export const TYPE_META: Record<CardType, { label: string; icon: string }> = {
  cashback: { label: 'Cash back', icon: 'percent' },
  points:   { label: 'Points',    icon: 'award' },
}

export const SEED_CARDS: RewardCardData[] = [
  {
    id: 'card_csr', name: 'Sapphire Reserve', issuer: 'Chase',
    lastFour: '4477', type: 'points', theme: 'teal', network: 'Visa Infinite',
    rewards: [
      { cat: 'hotels', rate: 4,  unit: 'x' },
      { cat: 'travel', rate: 4,  unit: 'x' },
      { cat: 'dining', rate: 3,  unit: 'x' },
      { cat: 'base',   rate: 1,  unit: 'x' },
    ],
  },
  {
    id: 'card_gold', name: 'Gold Card', issuer: 'American Express',
    lastFour: '1009', type: 'points', theme: 'gold', network: 'Amex',
    rewards: [
      { cat: 'dining',    rate: 4, unit: 'x' },
      { cat: 'groceries', rate: 4, unit: 'x' },
      { cat: 'travel',    rate: 3, unit: 'x' },
      { cat: 'base',      rate: 1, unit: 'x' },
    ],
  },
  {
    id: 'card_vx', name: 'Venture X', issuer: 'Capital One',
    lastFour: '8021', type: 'points', theme: 'ink', network: 'Visa Infinite',
    rewards: [
      { cat: 'hotels', rate: 10, unit: 'x' },
      { cat: 'travel', rate: 5,  unit: 'x' },
      { cat: 'base',   rate: 2,  unit: 'x' },
    ],
  },
  {
    id: 'card_bcp', name: 'Blue Cash Preferred', issuer: 'American Express',
    lastFour: '3382', type: 'cashback', theme: 'slate', network: 'Amex',
    rewards: [
      { cat: 'groceries', rate: 6,   unit: '%' },
      { cat: 'streaming', rate: 6,   unit: '%' },
      { cat: 'gas',       rate: 3,   unit: '%' },
      { cat: 'transit',   rate: 3,   unit: '%' },
      { cat: 'base',      rate: 1,   unit: '%' },
    ],
  },
  {
    id: 'card_cfu', name: 'Freedom Unlimited', issuer: 'Chase',
    lastFour: '5521', type: 'cashback', theme: 'espresso', network: 'Visa',
    rewards: [
      { cat: 'retail',    rate: 5,   unit: '%' },
      { cat: 'dining',    rate: 3,   unit: '%' },
      { cat: 'drugstore', rate: 3,   unit: '%' },
      { cat: 'base',      rate: 1.5, unit: '%' },
    ],
  },
  {
    id: 'card_dc', name: 'Double Cash', issuer: 'Citi',
    lastFour: '2290', type: 'cashback', theme: 'pewter', network: 'Mastercard',
    rewards: [
      { cat: 'base', rate: 2, unit: '%' },
    ],
  },
]

export const themeOf = (card: RewardCardData): { grad: string; dot: string } => {
  if (card.design) {
    const d = resolveCardDesign(card.design)
    return { grad: d.gradient, dot: d.text }
  }
  return CARD_THEMES[card.theme] ?? CARD_THEMES.ink
}

export function cardRate(card: RewardCardData, catKey: CategoryKey): Reward | null {
  const direct = card.rewards.find((r) => r.cat === catKey)
  if (direct) return direct
  const base = card.rewards.find((r) => r.cat === 'base')
  return base ? { ...base, cat: catKey, viaBase: true } : null
}

export function topRewards(card: RewardCardData): Reward[] {
  return [...card.rewards]
    .filter((r) => r.cat !== 'base')
    .sort((a, b) => b.rate - a.rate)
}

export const baseReward = (card: RewardCardData): Reward | null =>
  card.rewards.find((r) => r.cat === 'base') ?? null

export function rankForCategory(cards: RewardCardData[], catKey: CategoryKey): RankedCard[] {
  const rows = cards
    .map((card) => ({ card, reward: cardRate(card, catKey) }))
    .filter((r): r is { card: RewardCardData; reward: Reward } => r.reward !== null)
    .sort((a, b) => b.reward.rate - a.reward.rate)
  const top = rows.length ? rows[0].reward.rate : 0
  return rows.map((r) => ({ ...r, winner: r.reward.rate === top, viaBase: !!r.reward.viaBase }))
}

export const fmtRate = (r: Reward): string =>
  r.unit === 'x' ? `${r.rate}×` : `${r.rate}%`

interface CatalogEntry {
  type: CardType
  network: string
  theme: CardTheme
  rewards: Reward[]
}

const CARD_CATALOG: Record<string, CatalogEntry> = {
  'amex-gold': {
    type: 'points', network: 'Amex', theme: 'gold',
    rewards: [
      { cat: 'dining',    rate: 4, unit: 'x' },
      { cat: 'groceries', rate: 4, unit: 'x' },
      { cat: 'travel',    rate: 3, unit: 'x' },
      { cat: 'base',      rate: 1, unit: 'x' },
    ],
  },
  'amex-platinum': {
    type: 'points', network: 'Amex', theme: 'pewter',
    rewards: [
      { cat: 'travel', rate: 5, unit: 'x' },
      { cat: 'hotels', rate: 5, unit: 'x' },
      { cat: 'base',   rate: 1, unit: 'x' },
    ],
  },
  'chase-sapphire-preferred': {
    type: 'points', network: 'Visa Signature', theme: 'teal',
    rewards: [
      { cat: 'travel',     rate: 5, unit: 'x' },
      { cat: 'hotels',     rate: 5, unit: 'x' },
      { cat: 'dining',     rate: 3, unit: 'x' },
      { cat: 'streaming',  rate: 3, unit: 'x' },
      { cat: 'groceries',  rate: 3, unit: 'x' },
      { cat: 'base',       rate: 1, unit: 'x' },
    ],
  },
  'united-quest': {
    type: 'points', network: 'Visa Signature', theme: 'ink',
    rewards: [
      { cat: 'travel',  rate: 3, unit: 'x' },
      { cat: 'hotels',  rate: 3, unit: 'x' },
      { cat: 'dining',  rate: 2, unit: 'x' },
      { cat: 'base',    rate: 1, unit: 'x' },
    ],
  },
  'bilt-palladium': {
    type: 'points', network: 'Mastercard', theme: 'teal',
    rewards: [
      { cat: 'dining',  rate: 3, unit: 'x' },
      { cat: 'travel',  rate: 2, unit: 'x' },
      { cat: 'base',    rate: 1, unit: 'x' },
    ],
  },
  'chase-aeroplan': {
    type: 'points', network: 'Visa Infinite', theme: 'slate',
    rewards: [
      { cat: 'dining',     rate: 3, unit: 'x' },
      { cat: 'groceries',  rate: 2, unit: 'x' },
      { cat: 'travel',     rate: 2, unit: 'x' },
      { cat: 'base',       rate: 1, unit: 'x' },
    ],
  },
  'united-explorer': {
    type: 'points', network: 'Visa Signature', theme: 'espresso',
    rewards: [
      { cat: 'travel', rate: 2, unit: 'x' },
      { cat: 'dining', rate: 2, unit: 'x' },
      { cat: 'hotels', rate: 2, unit: 'x' },
      { cat: 'base',   rate: 1, unit: 'x' },
    ],
  },
}

const FALLBACK_ENTRY: CatalogEntry = {
  type: 'cashback', network: '', theme: 'teal',
  rewards: [{ cat: 'base', rate: 1, unit: '%' }],
}

export function dbCardToRewardCard(card: {
  id: string
  name: string
  issuer: string
  lastFour?: string | null
  design?: string | null
}): RewardCardData {
  const entry = (card.design && CARD_CATALOG[card.design]) || FALLBACK_ENTRY
  return {
    id: card.id,
    name: card.name,
    issuer: card.issuer,
    lastFour: card.lastFour ?? '',
    design: card.design ?? undefined,
    type: entry.type,
    theme: entry.theme,
    network: entry.network,
    rewards: entry.rewards,
  }
}
