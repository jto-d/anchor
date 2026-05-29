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
  await prisma.user.deleteMany()
  const user = await prisma.user.create({
    data: {
      email: 'demo@example.com',
      accounts: {
        create: [
          {
            name: 'Checking',
            transactions: {
              create: [
                {
                  amount: 1250.0,
                  description: 'Paycheck',
                  occurredAt: new Date('2026-05-01'),
                },
                {
                  amount: -45.99,
                  description: 'Groceries',
                  occurredAt: new Date('2026-05-03'),
                },
                {
                  amount: -12.5,
                  description: 'Coffee',
                  occurredAt: new Date('2026-05-04'),
                },
              ],
            },
          },
          {
            name: 'Savings',
            transactions: {
              create: [
                {
                  amount: 500.0,
                  description: 'Transfer in',
                  occurredAt: new Date('2026-05-02'),
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
