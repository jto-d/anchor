// Per-product perk templates, keyed by the same design slug as CARD_CATALOG.
// When a user adds a card from the catalog, these perks are created on it.
// Cards with an empty array (cash-back style) carry no pre-set perks.

export interface PerkTemplate {
  name: string
  totalAmount: number
  period: 'MONTHLY' | 'QUARTERLY' | 'SEMI_ANNUAL' | 'ANNUAL'
  periodStartMonth: number // 1-12
  notes?: string
}

export const PERK_CATALOG: Record<string, PerkTemplate[]> = {
  'amex-gold': [
    { name: 'Airline fee credit', totalAmount: 200, period: 'ANNUAL', periodStartMonth: 1, notes: 'Select one airline each January.' },
    { name: 'Uber Cash', totalAmount: 15, period: 'MONTHLY', periodStartMonth: 1, notes: 'Adds to your Uber account on the 1st.' },
    { name: 'Saks Fifth Avenue', totalAmount: 50, period: 'SEMI_ANNUAL', periodStartMonth: 1, notes: 'Jan–Jun and Jul–Dec.' },
    { name: 'Digital entertainment', totalAmount: 20, period: 'MONTHLY', periodStartMonth: 1, notes: 'NYT, Peacock, Audible, and more.' },
    { name: 'CLEAR Plus', totalAmount: 189, period: 'ANNUAL', periodStartMonth: 1, notes: 'Reimburses your CLEAR membership.' },
  ],
  'amex-platinum': [
    { name: 'Airline incidental credit', totalAmount: 200, period: 'ANNUAL', periodStartMonth: 1, notes: 'Select one airline each January.' },
    { name: 'Hotel credit', totalAmount: 200, period: 'ANNUAL', periodStartMonth: 1, notes: 'Fine Hotels + Resorts or The Hotel Collection.' },
    { name: 'Uber Cash', totalAmount: 15, period: 'MONTHLY', periodStartMonth: 1, notes: '$15/month, $20 in December.' },
    { name: 'CLEAR Plus', totalAmount: 189, period: 'ANNUAL', periodStartMonth: 1, notes: 'Reimburses your CLEAR membership.' },
    { name: 'Global Entry / TSA PreCheck', totalAmount: 120, period: 'ANNUAL', periodStartMonth: 1, notes: 'Up to $120 every 4 years.' },
  ],
  'bofa-customized-cash': [
    { name: 'Online shopping credit', totalAmount: 25, period: 'QUARTERLY', periodStartMonth: 1, notes: '3% cash back on your chosen category, up to $2,500/quarter.' },
  ],
  'chase-sapphire-preferred': [
    { name: 'Travel credit', totalAmount: 300, period: 'ANNUAL', periodStartMonth: 1, notes: 'Applies automatically to travel.' },
    { name: 'DoorDash credit', totalAmount: 25, period: 'MONTHLY', periodStartMonth: 1, notes: 'Restaurant + non-restaurant.' },
    { name: 'Lyft credit', totalAmount: 10, period: 'MONTHLY', periodStartMonth: 1, notes: 'In-app Lyft credit.' },
  ],
  'chase-sapphire-reserve': [
    { name: 'Travel credit', totalAmount: 300, period: 'ANNUAL', periodStartMonth: 1, notes: 'Applies automatically to travel.' },
    { name: 'Global Entry / TSA PreCheck', totalAmount: 120, period: 'ANNUAL', periodStartMonth: 1, notes: 'Up to $120 every 4 years.' },
  ],
  'chase-freedom-unlimited': [],
  'united-quest': [
    { name: 'Travel credit', totalAmount: 300, period: 'ANNUAL', periodStartMonth: 1, notes: 'Through Capital One Travel.' },
    { name: 'Anniversary miles', totalAmount: 100, period: 'ANNUAL', periodStartMonth: 1, notes: '10,000 bonus miles each year.' },
  ],
  'united-explorer': [
    { name: 'United Club passes', totalAmount: 100, period: 'ANNUAL', periodStartMonth: 1, notes: '2 one-time United Club passes per year.' },
    { name: 'Global Entry / TSA PreCheck', totalAmount: 120, period: 'ANNUAL', periodStartMonth: 1, notes: 'Up to $120 every 4 years.' },
  ],
  'united-gateway': [
    { name: 'United purchase credit', totalAmount: 100, period: 'ANNUAL', periodStartMonth: 1, notes: '$100 statement credit on United purchases after $10,000 spend.' },
  ],
  'chase-aeroplan': [
    { name: 'Air Canada credit', totalAmount: 100, period: 'ANNUAL', periodStartMonth: 1, notes: 'Applies to Air Canada purchases.' },
    { name: 'DoorDash credit', totalAmount: 10, period: 'MONTHLY', periodStartMonth: 1, notes: 'Monthly DashPass credit.' },
  ],
  'bilt-blue': [],
  'bilt-obsidian': [
    { name: 'Rent day bonus', totalAmount: 0, period: 'MONTHLY', periodStartMonth: 1, notes: 'Double points on all purchases on the 1st of each month (except rent).' },
    { name: 'Travel credit', totalAmount: 100, period: 'ANNUAL', periodStartMonth: 1, notes: '$100 annual travel credit via Bilt Travel.' },
    { name: 'Lyft credit', totalAmount: 5, period: 'MONTHLY', periodStartMonth: 1, notes: '$5 Lyft credit after 5 rides.' },
  ],
  'bilt-palladium': [
    { name: 'Rent day bonus', totalAmount: 0, period: 'MONTHLY', periodStartMonth: 1, notes: 'Double points on all purchases on the 1st of each month (except rent).' },
    { name: 'Lyft credit', totalAmount: 5, period: 'MONTHLY', periodStartMonth: 1, notes: '$5 Lyft credit after 5 rides.' },
  ],
}
