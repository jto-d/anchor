import 'dotenv/config'
import { neonConfig } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from '@prisma/client'
import ws from 'ws'

neonConfig.webSocketConstructor = ws

const prisma = new PrismaClient({
  adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL! }),
})

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
          {
            name: 'Gold Card',
            issuer: 'American Express',
            design: 'amex-gold',
            lastFour: '1009',
            perks: {
              create: [
                {
                  name: 'Airline fee credit',
                  totalAmount: 200,
                  period: 'ANNUAL',
                  periodStartMonth: 1,
                  notes: 'Select one airline each January.',
                  perkCredit: {
                    create: [{ amount: 200, date: new Date('2026-02-14'), description: 'United · baggage' }],
                  },
                },
                {
                  name: 'Uber Cash',
                  totalAmount: 15,
                  period: 'MONTHLY',
                  periodStartMonth: 1,
                  notes: 'Adds to your Uber account on the 1st.',
                  perkCredit: {
                    create: [
                      { amount: 15, date: new Date('2026-05-03'), description: 'Uber Eats' },
                      { amount: 15, date: new Date('2026-04-02'), description: 'Uber ride' },
                      { amount: 15, date: new Date('2026-03-09'), description: 'Uber Eats' },
                    ],
                  },
                },
                {
                  name: 'Saks Fifth Avenue',
                  totalAmount: 50,
                  period: 'SEMI_ANNUAL',
                  periodStartMonth: 1,
                  notes: 'Jan–Jun and Jul–Dec.',
                  perkCredit: {
                    create: [{ amount: 50, date: new Date('2026-03-21'), description: 'Saks.com' }],
                  },
                },
                {
                  name: 'Digital entertainment',
                  totalAmount: 20,
                  period: 'MONTHLY',
                  periodStartMonth: 1,
                  notes: 'NYT, Peacock, Audible, and more.',
                },
                {
                  name: 'CLEAR Plus',
                  totalAmount: 189,
                  period: 'ANNUAL',
                  periodStartMonth: 1,
                  notes: 'Reimburses your CLEAR membership.',
                },
              ],
            },
          },
          {
            name: 'Sapphire Preferred',
            issuer: 'Chase',
            lastFour: '4477',
            design: 'chase-sapphire-preferred',
            perks: {
              create: [
                {
                  name: 'Travel credit',
                  totalAmount: 300,
                  period: 'ANNUAL',
                  periodStartMonth: 1,
                  notes: 'Applies automatically to travel.',
                  perkCredit: {
                    create: [{ amount: 300, date: new Date('2026-01-28'), description: 'Delta · airfare' }],
                  },
                },
                {
                  name: 'DoorDash credit',
                  totalAmount: 25,
                  period: 'MONTHLY',
                  periodStartMonth: 1,
                  notes: 'Restaurant + non-restaurant.',
                  perkCredit: {
                    create: [{ amount: 10, date: new Date('2026-05-11'), description: 'DoorDash' }],
                  },
                },
                {
                  name: 'Lyft credit',
                  totalAmount: 10,
                  period: 'MONTHLY',
                  periodStartMonth: 1,
                  notes: 'In-app Lyft credit.',
                },
              ],
            },
          },
          {
            name: 'United Quest',
            issuer: 'Chase',
            lastFour: '8021',
            design: 'united-quest',
            perks: {
              create: [
                {
                  name: 'Travel credit',
                  totalAmount: 300,
                  period: 'ANNUAL',
                  periodStartMonth: 1,
                  notes: 'Through Capital One Travel.',
                  perkCredit: {
                    create: [{ amount: 120, date: new Date('2026-04-19'), description: 'Hotel · Capital One Travel' }],
                  },
                },
                {
                  name: 'Anniversary miles',
                  totalAmount: 100,
                  period: 'ANNUAL',
                  periodStartMonth: 1,
                  notes: '10,000 bonus miles each year.',
                },
              ],
            },
          },
          {
            name: 'Platinum Card',
            issuer: 'American Express',
            lastFour: '6758',
            design: 'amex-platinum',
            perks: {
              create: [
                {
                  name: 'Airline incidental credit',
                  totalAmount: 200,
                  period: 'ANNUAL',
                  periodStartMonth: 1,
                  notes: 'Select one airline each January.',
                },
                {
                  name: 'Hotel credit',
                  totalAmount: 200,
                  period: 'ANNUAL',
                  periodStartMonth: 1,
                  notes: 'Fine Hotels + Resorts or The Hotel Collection.',
                  perkCredit: {
                    create: [{ amount: 200, date: new Date('2026-03-10'), description: 'Fine Hotels + Resorts' }],
                  },
                },
                {
                  name: 'Uber Cash',
                  totalAmount: 15,
                  period: 'MONTHLY',
                  periodStartMonth: 1,
                  notes: '$15/month, $20 in December.',
                  perkCredit: {
                    create: [{ amount: 15, date: new Date('2026-05-04'), description: 'Uber Eats' }],
                  },
                },
                {
                  name: 'CLEAR Plus',
                  totalAmount: 189,
                  period: 'ANNUAL',
                  periodStartMonth: 1,
                  notes: 'Reimburses your CLEAR membership.',
                  perkCredit: {
                    create: [{ amount: 189, date: new Date('2026-01-15'), description: 'CLEAR Plus membership' }],
                  },
                },
                {
                  name: 'Global Entry / TSA PreCheck',
                  totalAmount: 120,
                  period: 'ANNUAL',
                  periodStartMonth: 1,
                  notes: 'Up to $120 every 4 years.',
                },
              ],
            },
          },
          {
            name: 'Customized Cash Rewards',
            issuer: 'Bank of America',
            lastFour: '3342',
            design: 'bofa-customized-cash',
            perks: {
              create: [
                {
                  name: 'Online shopping credit',
                  totalAmount: 25,
                  period: 'QUARTERLY',
                  periodStartMonth: 1,
                  notes: '3% cash back on your chosen category, up to $2,500/quarter.',
                  perkCredit: {
                    create: [{ amount: 18, date: new Date('2026-04-30'), description: 'Amazon purchases' }],
                  },
                },
              ],
            },
          },
          {
            name: 'United Explorer',
            issuer: 'Chase',
            lastFour: '5513',
            design: 'united-explorer',
            perks: {
              create: [
                {
                  name: 'United Club passes',
                  totalAmount: 100,
                  period: 'ANNUAL',
                  periodStartMonth: 1,
                  notes: '2 one-time United Club passes per year.',
                  perkCredit: {
                    create: [{ amount: 50, date: new Date('2026-02-20'), description: 'United Club · ORD' }],
                  },
                },
                {
                  name: 'Global Entry / TSA PreCheck',
                  totalAmount: 120,
                  period: 'ANNUAL',
                  periodStartMonth: 1,
                  notes: 'Up to $120 every 4 years.',
                },
              ],
            },
          },
          {
            name: 'United Gateway',
            issuer: 'Chase',
            lastFour: '7790',
            design: 'united-gateway',
            perks: {
              create: [
                {
                  name: 'United purchase credit',
                  totalAmount: 100,
                  period: 'ANNUAL',
                  periodStartMonth: 1,
                  notes: '$100 statement credit on United purchases after $10,000 spend.',
                },
              ],
            },
          },
          {
            name: 'Aeroplan',
            issuer: 'Chase',
            lastFour: '2284',
            design: 'chase-aeroplan',
            perks: {
              create: [
                {
                  name: 'Air Canada credit',
                  totalAmount: 100,
                  period: 'ANNUAL',
                  periodStartMonth: 1,
                  notes: 'Applies to Air Canada purchases.',
                  perkCredit: {
                    create: [{ amount: 100, date: new Date('2026-03-05'), description: 'Air Canada · YYZ' }],
                  },
                },
                {
                  name: 'DoorDash credit',
                  totalAmount: 10,
                  period: 'MONTHLY',
                  periodStartMonth: 1,
                  notes: 'Monthly DashPass credit.',
                  perkCredit: {
                    create: [{ amount: 10, date: new Date('2026-05-15'), description: 'DoorDash' }],
                  },
                },
              ],
            },
          },
          {
            name: 'Bilt Obsidian',
            issuer: 'Bilt',
            lastFour: '4417',
            design: 'bilt-obsidian',
            perks: {
              create: [
                {
                  name: 'Rent day bonus',
                  totalAmount: 0,
                  period: 'MONTHLY',
                  periodStartMonth: 1,
                  notes: 'Double points on all purchases on the 1st of each month (except rent).',
                },
                {
                  name: 'Travel credit',
                  totalAmount: 100,
                  period: 'ANNUAL',
                  periodStartMonth: 1,
                  notes: '$100 annual travel credit via Bilt Travel.',
                  perkCredit: {
                    create: [{ amount: 100, date: new Date('2026-02-10'), description: 'Bilt Travel · flight' }],
                  },
                },
                {
                  name: 'Lyft credit',
                  totalAmount: 5,
                  period: 'MONTHLY',
                  periodStartMonth: 1,
                  notes: '$5 Lyft credit after 5 rides.',
                },
              ],
            },
          },
          {
            name: 'Bilt Palladium',
            issuer: 'Bilt',
            lastFour: '9901',
            design: 'bilt-palladium',
            perks: {
              create: [
                {
                  name: 'Rent day bonus',
                  totalAmount: 0,
                  period: 'MONTHLY',
                  periodStartMonth: 1,
                  notes: 'Double points on all purchases on the 1st of each month (except rent).',
                },
                {
                  name: 'Lyft credit',
                  totalAmount: 5,
                  period: 'MONTHLY',
                  periodStartMonth: 1,
                  notes: '$5 Lyft credit after 5 rides.',
                  perkCredit: {
                    create: [{ amount: 5, date: new Date('2026-05-22'), description: 'Lyft rides' }],
                  },
                },
              ],
            },
          },
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
