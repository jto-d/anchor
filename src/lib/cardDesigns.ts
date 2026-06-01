export interface CardDesign {
  gradient: string
  text: string
}

const WHITE = '#fff'

export const cardDesigns: Record<string, CardDesign> = {
  'amex-gold': { gradient: 'linear-gradient(150deg, #D2BF70, #A99941)', text: '#3D3413' },
  'amex-platinum': { gradient: 'linear-gradient(150deg, #F1F1F3, #BEBEC0)', text: '#27272A' },
  'bilt-palladium': { gradient: 'linear-gradient(150deg, #006688, #01082E)', text: WHITE },
  'chase-aeroplan': { gradient: 'linear-gradient(150deg, #006688, #01082E)', text: WHITE },
  'chase-sapphire-preferred': { gradient: 'linear-gradient(150deg, #0671AC, #01082E)', text: WHITE },
  'united-explorer': { gradient: 'linear-gradient(150deg, #0097A7, #01082E)', text: WHITE },
  'united-quest': { gradient: 'linear-gradient(150deg, #461864, #33184A)', text: WHITE },
  teal: { gradient: 'linear-gradient(150deg, #0D7A78, #083E3C)', text: WHITE },
}

export const DEFAULT_CARD_DESIGN = cardDesigns.teal

export function resolveCardDesign(design?: string | null): CardDesign {
  return (design && cardDesigns[design]) || DEFAULT_CARD_DESIGN
}
