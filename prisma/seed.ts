import 'dotenv/config'
import { neonConfig } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from '@prisma/client'
import ws from 'ws'
import { CARD_CATALOG } from '../src/data/cardCatalog'
import { PERK_CATALOG } from '../src/data/perkCatalog'

neonConfig.webSocketConstructor = ws

const prisma = new PrismaClient({
  adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL! }),
})

type SampleCredit = { amount: number; date: Date; description: string }

// Builds a card's nested-create payload from the catalogs. Card name/issuer and
// the perk shapes come from the registries (single source of truth); `credits`
// is the demo redemption history, keyed by perk name.
function mkCard(design: string, lastFour: string, credits: Record<string, SampleCredit[]> = {}) {
  const entry = CARD_CATALOG[design]
  const perks = PERK_CATALOG[design] ?? []
  return {
    name: entry.name,
    issuer: entry.issuer,
    design,
    lastFour,
    perks: {
      create: perks.map((p) => ({
        ...p,
        perkCredit: credits[p.name] ? { create: credits[p.name] } : undefined,
      })),
    },
  }
}

async function main() {
  await prisma.perkCredit.deleteMany()
  await prisma.perk.deleteMany()
  await prisma.creditCard.deleteMany()
  await prisma.user.deleteMany()

  const user = await prisma.user.create({
    data: {
      email: 'demo@anchor.app',
      creditCards: {
        create: [
          mkCard('amex-gold', '1009', {
            'Uber Cash': [
              { amount: 10, date: new Date('2026-05-03'), description: 'Uber Eats' },
              { amount: 10, date: new Date('2026-04-02'), description: 'Uber ride' },
              { amount: 10, date: new Date('2026-03-09'), description: 'Uber Eats' },
            ],
            'Dining Credit': [
              { amount: 10, date: new Date('2026-05-18'), description: 'Goldbelly' },
              { amount: 10, date: new Date('2026-04-22'), description: 'Buffalo Wild Wings' },
            ],
            "Dunkin' Credit": [{ amount: 7, date: new Date('2026-05-07'), description: "Dunkin'" }],
            'Resy Credit': [{ amount: 50, date: new Date('2026-03-14'), description: 'Resy · dinner' }],
          }),
          mkCard('chase-sapphire-preferred', '4477', {
            'Chase Travel Hotel Credit': [{ amount: 50, date: new Date('2026-02-10'), description: 'Chase Travel · hotel' }],
            'DoorDash Non-Restaurant Credit': [{ amount: 10, date: new Date('2026-05-11'), description: 'DoorDash · grocery' }],
          }),
          mkCard('united-quest', '8021', {
            'United TravelBank Credit': [{ amount: 200, date: new Date('2026-01-08'), description: 'United · anniversary credit' }],
            'Rideshare Credit': [
              { amount: 8, date: new Date('2026-05-14'), description: 'Lyft' },
              { amount: 8, date: new Date('2026-04-19'), description: 'Uber' },
            ],
            'Instacart Credit': [
              { amount: 15, date: new Date('2026-05-20'), description: 'Instacart order' },
              { amount: 15, date: new Date('2026-04-21'), description: 'Instacart order' },
            ],
          }),
          mkCard('amex-platinum', '6758', {
            'Hotel Credit': [{ amount: 300, date: new Date('2026-03-10'), description: 'Fine Hotels + Resorts · NYC' }],
            'Digital Entertainment Credit': [
              { amount: 25, date: new Date('2026-05-01'), description: 'Disney+ / Hulu bundle' },
              { amount: 25, date: new Date('2026-04-01'), description: 'Disney+ / Hulu bundle' },
            ],
            'CLEAR Plus': [{ amount: 209, date: new Date('2026-01-15'), description: 'CLEAR Plus membership' }],
            'Airline Fee Credit': [{ amount: 200, date: new Date('2026-02-14'), description: 'United · baggage fees' }],
            'Equinox Credit': [{ amount: 300, date: new Date('2026-01-20'), description: 'Equinox membership' }],
          }),
          mkCard('bofa-customized-cash', '3342'),
          mkCard('united-explorer', '5513', {
            'United Hotels Credit': [{ amount: 50, date: new Date('2026-02-20'), description: 'United Hotels · Chicago' }],
            'Rideshare Credit': [
              { amount: 5, date: new Date('2026-05-08'), description: 'Lyft' },
              { amount: 5, date: new Date('2026-04-11'), description: 'Uber' },
            ],
            'Instacart Credit': [{ amount: 10, date: new Date('2026-05-17'), description: 'Instacart order' }],
          }),
          mkCard('united-gateway', '7790'),
          mkCard('chase-aeroplan', '2284', {
            'Global Entry / TSA PreCheck / NEXUS': [{ amount: 120, date: new Date('2026-01-05'), description: 'Global Entry renewal' }],
          }),
          mkCard('bilt-obsidian', '4417', {
            'Bilt Travel Hotel Credit': [{ amount: 50, date: new Date('2026-02-10'), description: 'Bilt Travel Portal · hotel' }],
          }),
          mkCard('bilt-palladium', '9901', {
            'Bilt Travel Hotel Credit': [{ amount: 200, date: new Date('2026-01-18'), description: 'Bilt Travel Portal · hotel' }],
            'Bilt Cash (annual)': [{ amount: 200, date: new Date('2026-01-01'), description: 'Bilt Cash · annual credit' }],
          }),
        ],
      },
    },
  })

  console.log(`Seeded user ${user.email}`)
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
