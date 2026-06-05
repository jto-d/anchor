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
            'Airline fee credit': [{ amount: 200, date: new Date('2026-02-14'), description: 'United · baggage' }],
            'Uber Cash': [
              { amount: 15, date: new Date('2026-05-03'), description: 'Uber Eats' },
              { amount: 15, date: new Date('2026-04-02'), description: 'Uber ride' },
              { amount: 15, date: new Date('2026-03-09'), description: 'Uber Eats' },
            ],
            'Saks Fifth Avenue': [{ amount: 50, date: new Date('2026-03-21'), description: 'Saks.com' }],
          }),
          mkCard('chase-sapphire-preferred', '4477', {
            'Travel credit': [{ amount: 300, date: new Date('2026-01-28'), description: 'Delta · airfare' }],
            'DoorDash credit': [{ amount: 10, date: new Date('2026-05-11'), description: 'DoorDash' }],
          }),
          mkCard('united-quest', '8021', {
            'Travel credit': [{ amount: 120, date: new Date('2026-04-19'), description: 'Hotel · Capital One Travel' }],
          }),
          mkCard('amex-platinum', '6758', {
            'Hotel credit': [{ amount: 200, date: new Date('2026-03-10'), description: 'Fine Hotels + Resorts' }],
            'Uber Cash': [{ amount: 15, date: new Date('2026-05-04'), description: 'Uber Eats' }],
            'CLEAR Plus': [{ amount: 189, date: new Date('2026-01-15'), description: 'CLEAR Plus membership' }],
          }),
          mkCard('bofa-customized-cash', '3342', {
            'Online shopping credit': [{ amount: 18, date: new Date('2026-04-30'), description: 'Amazon purchases' }],
          }),
          mkCard('united-explorer', '5513', {
            'United Club passes': [{ amount: 50, date: new Date('2026-02-20'), description: 'United Club · ORD' }],
          }),
          mkCard('united-gateway', '7790'),
          mkCard('chase-aeroplan', '2284', {
            'Air Canada credit': [{ amount: 100, date: new Date('2026-03-05'), description: 'Air Canada · YYZ' }],
            'DoorDash credit': [{ amount: 10, date: new Date('2026-05-15'), description: 'DoorDash' }],
          }),
          mkCard('bilt-obsidian', '4417', {
            'Travel credit': [{ amount: 100, date: new Date('2026-02-10'), description: 'Bilt Travel · flight' }],
          }),
          mkCard('bilt-palladium', '9901', {
            'Lyft credit': [{ amount: 5, date: new Date('2026-05-22'), description: 'Lyft rides' }],
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
