import type { CategoryKey, CardType } from '@/utils/cardRewards'

export interface CardCatalogEntry {
  name: string
  issuer: string
  gradient: string
  text: string
  type: CardType
  network: string
  annualFee: number
  rewards: { cat: CategoryKey; rate: number; note?: string }[]
}

const WHITE = '#fff'
const BLACK = '#000'
const BILT_GREY = '#CBC8C2'

export const FALLBACK_CARD: CardCatalogEntry = {
  name: '',
  issuer: '',
  gradient: 'linear-gradient(150deg, #0D7A78, #083E3C)',
  text: WHITE,
  type: 'cashback',
  network: '',
  annualFee: 0,
  rewards: [{ cat: 'base', rate: 1 }],
}

export const CARD_CATALOG: Record<string, CardCatalogEntry> = {

  // ═══════════════════════════════════════════════════════════════════════════
  // AMERICAN EXPRESS
  // ═══════════════════════════════════════════════════════════════════════════

  // Charge Cards
  'amex-gold': {
    name: 'Gold Card',
    issuer: 'American Express',
    gradient: 'linear-gradient(150deg, #D2BF70, #A99941)',
    text: '#3D3413',
    type: 'points',
    network: 'Amex',
    annualFee: 325,
    rewards: [
      { cat: 'dining', rate: 4 },
      { cat: 'groceries', rate: 4 },
      { cat: 'travel', rate: 3, note: "Flights only" },
      { cat: 'portal', rate: 5 },
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
    annualFee: 695,
    rewards: [
      { cat: 'travel', rate: 5, note: "Flights only" },
      { cat: 'portal', rate: 5 },
      { cat: 'base', rate: 1 },
    ],
  },
  'amex-blue-cash-preferred': {
    name: 'Blue Cash Preferred',
    issuer: 'American Express',
    gradient: 'linear-gradient(150deg, #2E4367, #0C1326)',
    text: WHITE,
    type: 'cashback',
    network: 'Amex',
    annualFee: 95,
    rewards: [
      { cat: 'groceries', rate: 6 },
      { cat: 'streaming', rate: 6 },
      { cat: 'transit', rate: 3 },
      { cat: 'gas', rate: 3 },
      { cat: 'base', rate: 1 },
    ],
  },
  'amex-blue-cash-everyday': {
    name: 'Blue Cash Everyday',
    issuer: 'American Express',
    gradient: 'linear-gradient(150deg, #6BA8DF, #073883)',
    text: WHITE,
    type: 'cashback',
    network: 'Amex',
    annualFee: 0,
    rewards: [
      { cat: 'groceries', rate: 3 },
      { cat: 'retail', rate: 3 },
      { cat: 'gas', rate: 3 },
      { cat: 'base', rate: 1 },
    ],
  },
  'amex-green': {
    name: 'Green Card',
    issuer: 'American Express',
    gradient: 'linear-gradient(150deg, #DFECDB, #A7CFAC)',
    text: BLACK,
    type: 'points',
    network: 'Amex',
    annualFee: 150,
    rewards: [
      { cat: 'travel', rate: 3 },
      { cat: 'hotels', rate: 3 },
      { cat: 'transit', rate: 3 },
      { cat: 'dining', rate: 3 },
      { cat: 'base', rate: 1 },
    ],
  },

  // Delta
  'delta-sky-miles-gold': {
    name: 'Delta Sky Miles Gold',
    issuer: 'American Express',
    gradient: 'linear-gradient(150deg, #CAB179, #957740)',
    text: BLACK,
    type: 'points',
    network: 'American Express',
    annualFee: 150,
    rewards: [
      { cat: 'dining', rate: 2 },
      { cat: 'groceries', rate: 2 },
      { cat: 'portal', rate: 2, note: "Delta purchases" },
      { cat: 'base', rate: 1 },
    ],
  },
  'delta-sky-miles-platinum': {
    name: 'Delta Sky Miles Platinum',
    issuer: 'American Express',
    gradient: 'linear-gradient(150deg, #E0E1E0, #99A1A3)',
    text: BLACK,
    type: 'points',
    network: 'American Express',
    annualFee: 350,
    rewards: [
      { cat: 'portal', rate: 3, note: "Delta purchases" },
      { cat: 'base', rate: 1 },
    ],
  },
  'delta-sky-miles-reserve': {
    name: 'Delta Sky Miles Reserve',
    issuer: 'American Express',
    gradient: 'linear-gradient(150deg, #6B7D89, #2A3740)',
    text: WHITE,
    type: 'points',
    network: 'American Express',
    annualFee: 550,
    rewards: [
      { cat: 'portal', rate: 3, note: "Delta purchases" },
      { cat: 'base', rate: 1 },
    ],
  },
  'delta-sky-miles-blue': {
    name: 'Delta Sky Miles Blue',
    issuer: 'American Express',
    gradient: 'linear-gradient(150deg, #5EA0D5, #105793)',
    text: WHITE,
    type: 'points',
    network: 'American Express',
    annualFee: 0,
    rewards: [
      { cat: 'portal', rate: 2, note: "Delta purchases" },
      { cat: 'dining', rate: 2 },
      { cat: 'base', rate: 1 },
    ],
  },

  // Marriott
  'marriott-bonvoy-bevy': {
    name: 'Marriott Bonvoy Bevy',
    issuer: 'American Express',
    gradient: 'linear-gradient(150deg, #6F6F6D, #494947)',
    text: WHITE,
    type: 'points',
    network: 'American Express',
    annualFee: 250,
    rewards: [
      { cat: 'dining', rate: 2 },
      { cat: 'groceries', rate: 2 },
      { cat: 'portal', rate: 3, note: "Marriott purchases" },
      { cat: 'base', rate: 1, note: "2x the above" },
    ],
  },
  'marriott-bonvoy-brilliant': {
    name: 'Marriott Bonvoy Brilliant',
    issuer: 'American Express',
    gradient: 'linear-gradient(150deg, #313131, #000000)',
    text: WHITE,
    type: 'points',
    network: 'American Express',
    annualFee: 650,
    rewards: [
      { cat: 'dining', rate: 1.5 },
      { cat: 'travel', rate: 1.5, note: "Flights only" },
      { cat: 'portal', rate: 3, note: "Marriott purchases" },
      { cat: 'base', rate: 1, note: "2x the above" },
    ],
  },


  // ═══════════════════════════════════════════════════════════════════════════
  // AMERICAN EXPRESS BUSINESS
  // ═══════════════════════════════════════════════════════════════════════════

  'amex-business-gold': {
    name: 'Business Gold Card',
    issuer: 'American Express',
    gradient: 'linear-gradient(150deg, #D4C27A, #A69A45)',
    text: '#3D3413',
    type: 'points',
    network: 'American Express',
    annualFee: 375,
    rewards: [
      { cat: 'dining', rate: 4, note: '4x on the top 2 of these 6 eligible categories each billing cycle (up to $150k/yr combined): dining, transit, gas, advertising, wireless, software/cloud' },
      { cat: 'transit', rate: 4 },
      { cat: 'gas', rate: 4 },
      { cat: 'retail', rate: 4, note: 'Advertising in select U.S. media, monthly wireless phone service, and software/cloud purchases' },
      { cat: 'portal', rate: 3, note: 'Flights and prepaid hotels via AmexTravel.com' },
      { cat: 'base', rate: 1 },
    ],
  },
  'amex-business-platinum': {
    name: 'Business Platinum Card',
    issuer: 'American Express',
    gradient: 'linear-gradient(150deg, #F1F1F3, #BEBEC0)',
    text: '#27272A',
    type: 'points',
    network: 'American Express',
    annualFee: 895,
    rewards: [
      { cat: 'portal', rate: 5, note: 'Flights and prepaid hotels via AmexTravel.com' },
      { cat: 'retail', rate: 2, note: 'U.S. hardware/construction, electronics retailers, shipping providers, software/cloud, and individual purchases of $5,000+ (up to $2M/yr)' },
      { cat: 'base', rate: 1 },
    ],
  },
  'amex-business-green': {
    name: 'Business Green Rewards Card',
    issuer: 'American Express',
    gradient: 'linear-gradient(150deg, #D5E9D1, #9DC5A2)',
    text: BLACK,
    type: 'points',
    network: 'American Express',
    annualFee: 95,
    rewards: [
      { cat: 'portal', rate: 2, note: 'Purchases at amextravel.com' },
      { cat: 'base', rate: 1 },
    ],
  },
  'amex-graphite-business-cash': {
    name: 'Graphite Business Cash Unlimited',
    issuer: 'American Express',
    gradient: 'linear-gradient(150deg, #4A4A4A, #1C1C1C)',
    text: WHITE,
    type: 'cashback',
    network: 'American Express',
    annualFee: 295,
    rewards: [
      { cat: 'portal', rate: 5, note: 'Flights and prepaid hotels via AmexTravel.com' },
      { cat: 'base', rate: 2, note: 'Unlimited 2% cash back on all other eligible purchases — no spending cap' },
    ],
  },
  'amex-blue-business-cash': {
    name: 'Blue Business Cash',
    issuer: 'American Express',
    gradient: 'linear-gradient(150deg, #3B6EC7, #1B3A7E)',
    text: WHITE,
    type: 'cashback',
    network: 'American Express',
    annualFee: 0,
    rewards: [
      { cat: 'base', rate: 2, note: '2% cash back on all purchases up to $50,000/yr, then 1%' },
    ],
  },
  'amex-blue-business-plus': {
    name: 'Blue Business Plus',
    issuer: 'American Express',
    gradient: 'linear-gradient(150deg, #2D5BA3, #142C5E)',
    text: WHITE,
    type: 'points',
    network: 'American Express',
    annualFee: 0,
    rewards: [
      { cat: 'base', rate: 2, note: '2x Membership Rewards on all purchases up to $50,000/yr, then 1x' },
    ],
  },

  // Marriott Business
  'amex-marriott-bonvoy-business': {
    name: 'Marriott Bonvoy Business',
    issuer: 'American Express',
    gradient: 'linear-gradient(150deg, #C4A44A, #8C7030)',
    text: '#2D1A00',
    type: 'points',
    network: 'American Express',
    annualFee: 125,
    rewards: [
      { cat: 'hotels', rate: 6, note: 'Hotels participating in Marriott Bonvoy' },
      { cat: 'dining', rate: 4 },
      { cat: 'gas', rate: 4 },
      { cat: 'retail', rate: 4, note: 'Wireless telephone services and U.S. shipping purchases' },
      { cat: 'base', rate: 2 },
    ],
  },

  // Delta Business
  'delta-sky-miles-gold-business': {
    name: 'Delta SkyMiles Gold Business',
    issuer: 'American Express',
    gradient: 'linear-gradient(150deg, #C8AF75, #9A7B3A)',
    text: BLACK,
    type: 'points',
    network: 'American Express',
    annualFee: 150,
    rewards: [
      { cat: 'portal', rate: 2, note: 'Delta purchases' },
      { cat: 'retail', rate: 2, note: 'U.S. shipping and select U.S. advertising' },
      { cat: 'dining', rate: 2 },
      { cat: 'base', rate: 1 },
    ],
  },
  'delta-sky-miles-platinum-business': {
    name: 'Delta SkyMiles Platinum Business',
    issuer: 'American Express',
    gradient: 'linear-gradient(150deg, #D6D8D9, #8B9598)',
    text: BLACK,
    type: 'points',
    network: 'American Express',
    annualFee: 350,
    rewards: [
      { cat: 'portal', rate: 3, note: 'Delta purchases and Delta Stays hotel bookings' },
      { cat: 'transit', rate: 1.5, note: 'Transit, U.S. shipping, and eligible $5,000+ individual purchases' },
      { cat: 'base', rate: 1 },
    ],
  },
  'delta-sky-miles-reserve-business': {
    name: 'Delta SkyMiles Reserve Business',
    issuer: 'American Express',
    gradient: 'linear-gradient(150deg, #5C6E7A, #20303A)',
    text: WHITE,
    type: 'points',
    network: 'American Express',
    annualFee: 650,
    rewards: [
      { cat: 'portal', rate: 3, note: 'Delta purchases' },
      { cat: 'transit', rate: 1.5, note: 'Transit, U.S. shipping, and U.S. office supply stores' },
      { cat: 'base', rate: 1 },
    ],
  },


  // ═══════════════════════════════════════════════════════════════════════════
  // BANK OF AMERICA
  // ═══════════════════════════════════════════════════════════════════════════

  'bofa-customized-cash': {
    name: 'Customized Cash Rewards',
    issuer: 'Bank of America',
    gradient: 'linear-gradient(150deg, #C61F2D, #A41422)',
    text: WHITE,
    type: 'cashback',
    network: 'Visa Signature',
    annualFee: 0,
    rewards: [
      { cat: 'groceries', rate: 2 },
      { cat: 'retail', rate: 3 },
      { cat: 'base', rate: 1 },
    ],
  },


  // ═══════════════════════════════════════════════════════════════════════════
  // CAPITAL ONE  
  // ═══════════════════════════════════════════════════════════════════════════

  'capital-one-venture-x': {
    name: 'Venture X',
    issuer: 'Capital One',
    gradient: 'linear-gradient(150deg, #0A4E71, #08233D)',
    text: WHITE,
    type: 'points',
    network: 'Visa Signature',
    annualFee: 395,
    rewards: [
      { cat: 'portal', rate: 10, note: "10x on hotels and rental cars, 5x on flights and vacation rentals" },
      { cat: 'base', rate: 2 },
    ],
  },
  'capital-one-venture': {
    name: 'Venture',
    issuer: 'Capital One',
    gradient: 'linear-gradient(150deg, #052850, #041435)',
    text: WHITE,
    type: 'points',
    network: 'Visa Signature',
    annualFee: 95,
    rewards: [
      { cat: 'portal', rate: 5, note: "5x on hotels, rental cars, and vacation rentals" },
      { cat: 'base', rate: 2 },
    ],
  },
  'capital-one-venture-one': {
    name: 'Venture One',
    issuer: 'Capital One',
    gradient: 'linear-gradient(150deg, #053A74, #003772)',
    text: WHITE,
    type: 'points',
    network: 'Visa Signature',
    annualFee: 0,
    rewards: [
      { cat: 'portal', rate: 5, note: "5x on hotels, rental cars, and vacation rentals" },
      { cat: 'base', rate: 1.25 },
    ],
  },
  'capital-one-quicksilver': {
    name: 'Quicksilver',
    issuer: 'Capital One',
    gradient: 'linear-gradient(150deg, #97A4AC, #525D69)',
    text: WHITE,
    type: 'cashback',
    network: 'Mastercard',
    annualFee: 0,
    rewards: [
      { cat: 'portal', rate: 5, note: "5x on hotels, rental cars, and vacation rentals" },
      { cat: 'base', rate: 1.5 },
    ],
  },
  'capital-one-savor': {
    name: 'Savor',
    issuer: 'Capital One',
    gradient: 'linear-gradient(150deg, #B55834, #963625)',
    text: WHITE,
    type: 'cashback',
    network: 'Mastercard',
    annualFee: 0,
    rewards: [
      { cat: 'groceries', rate: 3, note: "Excludes Walmart and Target" },
      { cat: 'streaming', rate: 8, note: "8x on Capital One Entertainment purchases" },
      { cat: 'portal', rate: 5, note: "5x on hotels, rental cars, and vacation rentals" },
      { cat: 'base', rate: 1 },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CAPITAL ONE BUSINESS
  // ═══════════════════════════════════════════════════════════════════════════

  'capital-one-venture-x-business': {
    name: 'Venture X Business',
    issuer: 'Capital One',
    gradient: 'linear-gradient(150deg, #0A4E71, #08233D)',
    text: WHITE,
    type: 'points',
    network: 'Visa Signature',
    annualFee: 395,
    rewards: [
      { cat: 'portal', rate: 10, note: "10x on hotels and rental cars, 5x on flights and vacation rentals" },
      { cat: 'base', rate: 2 },
    ],
  },
  'capital-one-venture-business': {
    name: 'Venture Business',
    issuer: 'Capital One',
    gradient: 'linear-gradient(150deg, #052850, #041435)',
    text: WHITE,
    type: 'points',
    network: 'Visa Signature',
    annualFee: 95,
    rewards: [
      { cat: 'portal', rate: 5, note: "5x on hotels, rental cars, and vacation rentals" },
      { cat: 'base', rate: 2 },
    ],
  },
  'capital-one-venture-one-business': {
    name: 'Venture One',
    issuer: 'Capital One',
    gradient: 'linear-gradient(150deg, #053A74, #003772)',
    text: WHITE,
    type: 'points',
    network: 'Visa Signature',
    annualFee: 0,
    rewards: [
      { cat: 'portal', rate: 5, note: "5x on hotels, rental cars, and vacation rentals" },
      { cat: 'base', rate: 1.5 },
    ],
  },


  // ═══════════════════════════════════════════════════════════════════════════
  // CHASE
  // ═══════════════════════════════════════════════════════════════════════════

  // Sapphire
  'chase-sapphire-preferred': {
    name: 'Sapphire Preferred',
    issuer: 'Chase',
    gradient: 'linear-gradient(150deg, #0671AC, #01082E)',
    text: WHITE,
    type: 'points',
    network: 'Visa Signature',
    annualFee: 95,
    rewards: [
      { cat: 'travel', rate: 2, note: "5x on Lyft" },
      { cat: 'transit', rate: 2 },
      { cat: 'hotels', rate: 2, note: "3x on Airbnb" },
      { cat: 'gas', rate: 3 },
      { cat: 'dining', rate: 3 },
      { cat: 'streaming', rate: 3 },
      { cat: 'portal', rate: 5 },
      { cat: 'groceries', rate: 3, note: "Online groceries only"},
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
    annualFee: 795,
    rewards: [
      { cat: 'travel', rate: 4 },
      { cat: 'hotels', rate: 4 },
      { cat: 'dining', rate: 3 },
      { cat: 'portal', rate: 8 },
      { cat: 'base', rate: 1 },
    ],
  },

  // Freedom
  'chase-freedom-unlimited': {
    name: 'Freedom Unlimited',
    issuer: 'Chase',
    gradient: 'linear-gradient(150deg, #16498A, #141631)',
    text: WHITE,
    type: 'points',
    network: 'Visa Signature',
    annualFee: 0,
    rewards: [
      { cat: 'dining', rate: 3 },
      { cat: 'drugstore', rate: 3 },
      { cat: 'portal', rate: 5 },
      { cat: 'base', rate: 1.5 },
    ],
  },
  'chase-freedom-flex': {
    name: 'Freedom Flex',
    issuer: 'Chase',
    gradient: 'linear-gradient(150deg, #2051A3, #122B6E)',
    text: WHITE,
    type: 'cashback',
    network: 'Visa Signature',
    annualFee: 0,
    rewards: [
      { cat: 'dining', rate: 3 },
      { cat: 'drugstore', rate: 3 },
      { cat: 'portal', rate: 5 },
      { cat: 'base', rate: 1 },
    ],
  },
  'chase-freedom-rise': {
    name: 'Freedom Rise',
    issuer: 'Chase',
    gradient: 'linear-gradient(150deg, #3A8CCF, #1F5D8C)',
    text: WHITE,
    type: 'cashback',
    network: 'Visa',
    annualFee: 0,
    rewards: [
      { cat: 'base', rate: 1.5 },
    ],
  },

  // United
  'united-quest': {
    name: 'United Quest',
    issuer: 'Chase',
    gradient: 'linear-gradient(150deg, #461864, #33184A)',
    text: WHITE,
    type: 'points',
    network: 'Visa Signature',
    annualFee: 350,
    rewards: [
      { cat: 'travel', rate: 4 },
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
    annualFee: 150,
    rewards: [
      { cat: 'travel', rate: 2 },
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
    annualFee: 0,
    rewards: [
      { cat: 'travel', rate: 2 },
      { cat: 'transit', rate: 2 },
      { cat: 'gas', rate: 2 },
      { cat: 'base', rate: 1 },
    ],
  },
  'united-club': {
    name: 'United Club Card',
    issuer: 'Chase',
    gradient: 'linear-gradient(150deg, #06112E, #030A1A)',
    text: WHITE,
    type: 'points',
    network: 'Visa Infinite',
    annualFee: 695,
    rewards: [
      { cat: 'travel', rate: 5 },
      { cat: 'dining', rate: 2 },
      { cat: 'hotels', rate: 2 },
      { cat: 'base', rate: 1.5 },
    ],
  },

  // Aeroplan
  'chase-aeroplan': {
    name: 'Aeroplan',
    issuer: 'Chase',
    gradient: 'linear-gradient(150deg, #515459, #373C40)',
    text: WHITE,
    type: 'points',
    network: 'Mastercard',
    annualFee: 95,
    rewards: [
      { cat: 'dining', rate: 3 },
      { cat: 'portal', rate: 3 },
      { cat: 'groceries', rate: 3},
      { cat: 'base', rate: 1 },
    ],
  },

  // Southwest
  'southwest-priority': {
    name: 'Southwest Rapid Rewards Priority',
    issuer: 'Chase',
    gradient: 'linear-gradient(150deg, #2D4399, #1A277A)',
    text: WHITE,
    type: 'points',
    network: 'Visa Signature',
    annualFee: 229,
    rewards: [
      { cat: 'travel', rate: 4 },
      { cat: 'hotels', rate: 2 },
      { cat: 'dining', rate: 2 },
      { cat: 'gas', rate: 2 },
      { cat: 'base', rate: 1 },
    ],
  },
  'southwest-premier': {
    name: 'Southwest Rapid Rewards Premier',
    issuer: 'Chase',
    gradient: 'linear-gradient(150deg, #4560BA, #2D3D99)',
    text: WHITE,
    type: 'points',
    network: 'Visa Signature',
    annualFee: 149,
    rewards: [
      { cat: 'travel', rate: 3 },
      { cat: 'hotels', rate: 2 },
      { cat: 'dining', rate: 2 },
      { cat: 'groceries', rate: 2 },
      { cat: 'base', rate: 1 },
    ],
  },
  'southwest-plus': {
    name: 'Southwest Rapid Rewards Plus',
    issuer: 'Chase',
    gradient: 'linear-gradient(150deg, #5A77CC, #3A55A8)',
    text: WHITE,
    type: 'points',
    network: 'Visa Signature',
    annualFee: 99,
    rewards: [
      { cat: 'travel', rate: 2 },
      { cat: 'hotels', rate: 2 },
      { cat: 'groceries', rate: 2 },
      { cat: 'gas', rate: 2 },
      { cat: 'base', rate: 1 },
    ],
  },

  // Hyatt
  'world-of-hyatt': {
    name: 'World of Hyatt',
    issuer: 'Chase',
    gradient: 'linear-gradient(150deg, #4A2C17, #2A1508)',
    text: WHITE,
    type: 'points',
    network: 'Visa Signature',
    annualFee: 95,
    rewards: [
      { cat: 'hotels', rate: 4 },
      { cat: 'dining', rate: 2 },
      { cat: 'travel', rate: 2 },
      { cat: 'transit', rate: 2 },
      { cat: 'base', rate: 1 },
    ],
  },

  // Marriott Bonvoy
  'marriott-bonvoy-boundless': {
    name: 'Marriott Bonvoy Boundless',
    issuer: 'Chase',
    gradient: 'linear-gradient(150deg, #003B75, #001F40)',
    text: WHITE,
    type: 'points',
    network: 'Visa Signature',
    annualFee: 95,
    rewards: [
      { cat: 'hotels', rate: 6 },
      { cat: 'dining', rate: 3 },
      { cat: 'groceries', rate: 3 },
      { cat: 'gas', rate: 3 },
      { cat: 'base', rate: 2 },
    ],
  },
  'marriott-bonvoy-bold': {
    name: 'Marriott Bonvoy Bold',
    issuer: 'Chase',
    gradient: 'linear-gradient(150deg, #1A4A80, #0D2A50)',
    text: WHITE,
    type: 'points',
    network: 'Visa Signature',
    annualFee: 0,
    rewards: [
      { cat: 'hotels', rate: 3 },
      { cat: 'travel', rate: 2 },
      { cat: 'base', rate: 1 },
    ],
  },

  // IHG
  'ihg-one-rewards-premier': {
    name: 'IHG One Rewards Premier',
    issuer: 'Chase',
    gradient: 'linear-gradient(150deg, #BF3D10, #832805)',
    text: WHITE,
    type: 'points',
    network: 'Visa Signature',
    annualFee: 99,
    rewards: [
      { cat: 'hotels', rate: 10 },
      { cat: 'travel', rate: 5 },
      { cat: 'dining', rate: 5 },
      { cat: 'gas', rate: 5 },
      { cat: 'base', rate: 3 },
    ],
  },

  // Amazon
  'amazon-prime-rewards': {
    name: 'Amazon Prime Rewards Visa',
    issuer: 'Chase',
    gradient: 'linear-gradient(150deg, #131921, #070C11)',
    text: WHITE,
    type: 'cashback',
    network: 'Visa Signature',
    annualFee: 0,
    rewards: [
      { cat: 'retail', rate: 5 },
      { cat: 'groceries', rate: 5 },
      { cat: 'dining', rate: 2 },
      { cat: 'gas', rate: 2 },
      { cat: 'drugstore', rate: 2 },
      { cat: 'base', rate: 1 },
    ],
  },


  // ═══════════════════════════════════════════════════════════════════════════
  // CHASE BUSINESS
  // ═══════════════════════════════════════════════════════════════════════════

  'chase-sapphire-reserve-business': {
    name: 'Sapphire Reserve for Business',
    issuer: 'Chase',
    gradient: 'linear-gradient(150deg, #1A1A2E, #0A0A14)',
    text: WHITE,
    type: 'points',
    network: 'Visa Infinite',
    annualFee: 795,
    rewards: [
      { cat: 'portal', rate: 8, note: 'Chase Travel including The Edit' },
      { cat: 'travel', rate: 4, note: 'Flights booked directly. 5x on Lyft through 9/30/27.' },
      { cat: 'hotels', rate: 4, note: 'Hotels booked directly' },
      { cat: 'retail', rate: 3, note: 'Social media and search engine advertising' },
      { cat: 'base', rate: 1 },
    ],
  },
  // Ink Business
  'chase-ink-preferred': {
    name: 'Ink Business Preferred',
    issuer: 'Chase',
    gradient: 'linear-gradient(150deg, #0D3B6E, #06203F)',
    text: WHITE,
    type: 'points',
    network: 'Visa Signature',
    annualFee: 95,
    rewards: [
      { cat: 'travel', rate: 3, note: '3x on travel, shipping, internet/cable/phone, and social media advertising. $150k combined cap per anniversary year. 5x on Lyft through 9/30/27.' },
      { cat: 'streaming', rate: 3, note: 'Internet, cable, and phone services' },
      { cat: 'retail', rate: 3, note: 'Shipping and social media/search engine advertising' },
      { cat: 'base', rate: 1 },
    ],
  },
  'chase-ink-cash': {
    name: 'Ink Business Cash',
    issuer: 'Chase',
    gradient: 'linear-gradient(150deg, #1B4B8C, #0D2952)',
    text: WHITE,
    type: 'cashback',
    network: 'Visa Signature',
    annualFee: 0,
    rewards: [
      { cat: 'retail', rate: 5 },
      { cat: 'streaming', rate: 5 },
      { cat: 'dining', rate: 2 },
      { cat: 'gas', rate: 2 },
      { cat: 'base', rate: 1 },
    ],
  },
  'chase-ink-unlimited': {
    name: 'Ink Business Unlimited',
    issuer: 'Chase',
    gradient: 'linear-gradient(150deg, #5B7A9E, #384F6A)',
    text: WHITE,
    type: 'cashback',
    network: 'Visa Signature',
    annualFee: 0,
    rewards: [
      { cat: 'base', rate: 1.5 },
    ],
  },
  'chase-ink-premier': {
    name: 'Ink Business Premier',
    issuer: 'Chase',
    gradient: 'linear-gradient(150deg, #242424, #0A0A0A)',
    text: WHITE,
    type: 'points',
    network: 'Visa Infinite',
    annualFee: 195,
    rewards: [
      { cat: 'portal', rate: 5 },
      { cat: 'base', rate: 2 },
    ],
  },

  // United Business
  'united-business': {
    name: 'United Business Card',
    issuer: 'Chase',
    gradient: 'linear-gradient(150deg, #1C3B6A, #0C1F3E)',
    text: WHITE,
    type: 'points',
    network: 'Visa Signature',
    annualFee: 150,
    rewards: [
      { cat: 'portal', rate: 2, note: 'United purchases including flights' },
      { cat: 'dining', rate: 2 },
      { cat: 'gas', rate: 2 },
      { cat: 'transit', rate: 2 },
      { cat: 'retail', rate: 2, note: 'Office supply stores' },
      { cat: 'base', rate: 1 },
    ],
  },
  'united-club-business': {
    name: 'United Club Business Card',
    issuer: 'Chase',
    gradient: 'linear-gradient(150deg, #0A1A3C, #050D1F)',
    text: WHITE,
    type: 'points',
    network: 'Visa Infinite',
    annualFee: 695,
    rewards: [
      { cat: 'portal', rate: 2, note: 'United purchases including flights' },
      { cat: 'hotels', rate: 5, note: 'Prepaid stays via Renowned Hotels and Resorts for United' },
      { cat: 'base', rate: 1.5 },
    ],
  },

  // Southwest Business
  'southwest-performance-business': {
    name: 'Southwest Rapid Rewards Performance Business',
    issuer: 'Chase',
    gradient: 'linear-gradient(150deg, #304CB2, #1D3080)',
    text: WHITE,
    type: 'points',
    network: 'Visa Signature',
    annualFee: 299,
    rewards: [
      { cat: 'portal', rate: 4, note: 'Southwest Airlines purchases' },
      { cat: 'hotels', rate: 2, note: 'Hotels booked directly with the hotel' },
      { cat: 'gas', rate: 2 },
      { cat: 'dining', rate: 2 },
      { cat: 'transit', rate: 2 },
      { cat: 'base', rate: 1 },
    ],
  },
  'southwest-premier-business': {
    name: 'Southwest Rapid Rewards Premier Business',
    issuer: 'Chase',
    gradient: 'linear-gradient(150deg, #4267C3, #2E4EA0)',
    text: WHITE,
    type: 'points',
    network: 'Visa Signature',
    annualFee: 149,
    rewards: [
      { cat: 'portal', rate: 3, note: 'Southwest Airlines purchases' },
      { cat: 'gas', rate: 2, note: 'Gas stations and restaurants; $8k combined cap per anniversary year' },
      { cat: 'dining', rate: 2 },
      { cat: 'base', rate: 1 },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // BILT
  // ═══════════════════════════════════════════════════════════════════════════

  'bilt-blue': {
    name: 'Bilt Blue',
    issuer: 'Bilt',
    gradient: 'linear-gradient(150deg, #1A3045, #182736)',
    text: BILT_GREY,
    type: 'points',
    network: 'Mastercard',
    annualFee: 0,
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
    annualFee: 95,
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
    annualFee: 495,
    rewards: [
      { cat: 'base', rate: 2 },
    ],
  },
}
