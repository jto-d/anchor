import { builder } from '../builder'
import { prisma } from '@/lib/prisma'
import { BudgetMonthPayload, BudgetYearPayload } from './types'
import { sumCents, roundCents } from '@/utils/money'
import {
  DEFAULT_GROUPS,
  DEFAULT_INCOME,
  DEFAULT_SAVINGS,
  DEFAULT_GOALS,
} from '@/data/budgetDefaults'

builder.queryField('budgetMonth', (t) =>
  t.field({
    type: BudgetMonthPayload,
    args: {
      year: t.arg.int({ required: true }),
      month: t.arg.int({ required: true }),
    },
    resolve: async (_root, { year, month }, ctx) => {
      const userId = ctx.userId

      // Auto-init: if the user has no budget groups, seed defaults
      const groupCount = await prisma.budgetGroup.count({ where: { userId } })
      if (groupCount === 0) {
        await prisma.$transaction(async (tx) => {
          for (const g of DEFAULT_INCOME) {
            await tx.incomeSource.create({ data: { userId, ...g } })
          }
          for (const g of DEFAULT_GROUPS) {
            const { categories, ...groupData } = g
            const group = await tx.budgetGroup.create({ data: { userId, ...groupData } })
            for (const c of categories) {
              await tx.budgetCategory.create({ data: { groupId: group.id, ...c } })
            }
          }
          for (const s of DEFAULT_SAVINGS) {
            await tx.savingsAccount.create({ data: { userId, ...s } })
          }
          for (const g of DEFAULT_GOALS) {
            await tx.savingsGoal.create({ data: { userId, ...g } })
          }
        })
      }

      // Fetch all data in parallel
      const [user, incomeSources, groups, savings, goals, subscriptions] = await Promise.all([
        prisma.user.findUnique({ where: { id: userId }, select: { budgetStartYear: true, budgetStartMonth: true } }),
        prisma.incomeSource.findMany({ where: { userId }, orderBy: { position: 'asc' } }),
        prisma.budgetGroup.findMany({
          where: { userId },
          orderBy: { position: 'asc' },
          include: {
            categories: {
              orderBy: { position: 'asc' },
              include: {
                spends: { where: { year, month } },
                monthlyBudgets: { where: { year, month } },
                lineItems: {
                  orderBy: { position: 'asc' },
                  include: {
                    spends: { where: { year, month } },
                    monthlyBudgets: { where: { year, month } },
                  },
                },
              },
            },
          },
        }),
        prisma.savingsAccount.findMany({
          where: { userId },
          orderBy: { position: 'asc' },
          include: {
            contributions: { where: { year } }, // all months of this year for YTD
          },
        }),
        prisma.savingsGoal.findMany({
          where: { userId },
          include: { allocations: true },
        }),
        prisma.subscription.findMany({
          where: { userId, paused: false, cancelPending: false },
          select: { cost: true, period: true, renewM: true },
        }),
      ])

      // Shape income sources
      const incomeSourcesOut = incomeSources.map((s) => ({
        id: s.id,
        label: s.label,
        sub: s.sub,
        amount: Number(s.amount),
        position: s.position,
      }))

      // Shape groups with categories + this month's spend
      const groupsOut = groups.map((g) => ({
        id: g.id,
        label: g.label,
        icon: g.icon,
        position: g.position,
        categories: g.categories.map((c) => ({
          id: c.id,
          label: c.label,
          icon: c.icon,
          budget: Number(c.monthlyBudgets[0]?.budget ?? c.budget),
          position: c.position,
          monthSpent: Number(c.spends[0]?.amount ?? 0),
          lineItems: c.lineItems.map((l) => ({
            id: l.id,
            label: l.label,
            icon: l.icon,
            budget: Number(l.monthlyBudgets[0]?.budget ?? l.budget),
            position: l.position,
            monthSpent: Number(l.spends[0]?.amount ?? 0),
          })),
        })),
      }))

      // Shape savings with this month's contribution and YTD
      const savingsOut = savings.map((s) => {
        const monthContrib = s.contributions.find((c) => c.month === month)?.amount ?? 0
        const ytd = sumCents(
          s.contributions.filter((c) => c.month <= month),
          (c) => Number(c.amount)
        )
        return {
          id: s.id,
          label: s.label,
          accountType: s.accountType,
          icon: s.icon,
          monthly: Number(s.monthly),
          annualLimit: s.annualLimit == null ? null : Number(s.annualLimit),
          position: s.position,
          monthContrib: Number(monthContrib),
          ytd,
        }
      })

      // Shape goals: running total = base + all allocations EXCEPT this month
      const goalsOut = goals.map((g) => {
        const monthAlloc = g.allocations.find((a) => a.year === year && a.month === month)
        const running =
          Number(g.base) +
          sumCents(
            g.allocations.filter((a) => !(a.year === year && a.month === month)),
            (a) => Number(a.amount)
          )
        return {
          id: g.id,
          name: g.name,
          icon: g.icon,
          target: g.target == null ? null : Number(g.target),
          base: Number(g.base),
          targetYear: g.targetYear,
          targetMonth: g.targetMonth,
          running,
          monthAllocated: Number(monthAlloc?.amount ?? 0),
        }
      })

      // month is 0-based. Annual/semiannual charge in their specific renewal month(s);
      // quarterly has no tracked start month so we use the monthly equivalent;
      // monthly charges every month.
      // The quarterly term (cost * 4) / 12 is a genuine fraction of a cent, not a stored
      // money value, so terms are summed at full float precision and only the final total
      // is rounded to cents — rounding each term first would throw away real precision.
      const subscriptionsMonthlyRaw = subscriptions.reduce((sum, s) => {
        const cost = Number(s.cost)
        switch (s.period) {
          case 'monthly':
            return sum + cost
          case 'quarterly':
            return sum + (cost * 4) / 12
          case 'semiannual': {
            const renewM = s.renewM ?? 0
            return sum + (month === renewM || month === (renewM + 6) % 12 ? cost : 0)
          }
          case 'annual': {
            const renewM = s.renewM ?? 0
            return sum + (month === renewM ? cost : 0)
          }
          default:
            return sum
        }
      }, 0)
      const subscriptionsMonthly = roundCents(subscriptionsMonthlyRaw)

      return {
        incomeSources: incomeSourcesOut,
        groups: groupsOut,
        savings: savingsOut,
        goals: goalsOut,
        budgetStartYear: user?.budgetStartYear ?? null,
        budgetStartMonth: user?.budgetStartMonth ?? null,
        subscriptionsMonthly,
      }
    },
  })
)

builder.queryField('budgetYear', (t) =>
  t.field({
    type: BudgetYearPayload,
    args: { year: t.arg.int({ required: true }) },
    resolve: async (_root, { year }, ctx) => {
      const userId = ctx.userId

      const [user, incomeSources, groups, savings, goals] = await Promise.all([
        prisma.user.findUnique({ where: { id: userId }, select: { budgetStartYear: true, budgetStartMonth: true } }),
        prisma.incomeSource.findMany({ where: { userId }, orderBy: { position: 'asc' } }),
        prisma.budgetGroup.findMany({
          where: { userId },
          orderBy: { position: 'asc' },
          include: {
            categories: {
              orderBy: { position: 'asc' },
              include: { spends: { where: { year } } },
            },
          },
        }),
        prisma.savingsAccount.findMany({
          where: { userId },
          orderBy: { position: 'asc' },
          include: { contributions: { where: { year } } },
        }),
        prisma.savingsGoal.findMany({
          where: { userId },
          include: { allocations: { where: { year } } },
        }),
      ])

      const incomeSourcesOut = incomeSources.map((s) => ({
        id: s.id, label: s.label, sub: s.sub,
        amount: Number(s.amount), position: s.position,
      }))

      const groupsOut = groups.map((g) => ({
        id: g.id, label: g.label, icon: g.icon, position: g.position,
        categories: g.categories.map((c) => ({
          id: c.id, label: c.label, icon: c.icon,
          budget: Number(c.budget), position: c.position, monthSpent: 0,
          lineItems: [],
        })),
      }))

      const savingsOut = savings.map((s) => ({
        id: s.id, label: s.label, accountType: s.accountType, icon: s.icon,
        monthly: Number(s.monthly), annualLimit: s.annualLimit == null ? null : Number(s.annualLimit),
        position: s.position, monthContrib: 0, ytd: 0,
      }))

      // Goals: running = base + all allocations this year
      const goalsOut = goals.map((g) => {
        const running = Number(g.base) + sumCents(g.allocations, (a) => Number(a.amount))
        return {
          id: g.id, name: g.name, icon: g.icon, target: g.target == null ? null : Number(g.target),
          base: Number(g.base), targetYear: g.targetYear, targetMonth: g.targetMonth,
          running, monthAllocated: 0,
        }
      })

      // Per-month data for all 12 months of the requested year
      const monthlyData = Array.from({ length: 12 }, (_, month) => {
        const categorySpends = groups.flatMap((g) =>
          g.categories.flatMap((c) => {
            const spend = c.spends.find((s) => s.month === month)
            return spend ? [{ categoryId: c.id, amount: Number(spend.amount) }] : []
          })
        )
        const savingsContribs = savings.flatMap((s) => {
          const contrib = s.contributions.find((c) => c.month === month)
          return contrib ? [{ accountId: s.id, amount: Number(contrib.amount) }] : []
        })
        const surplusAllocations = goals.flatMap((g) => {
          const alloc = g.allocations.find((a) => a.month === month)
          return alloc ? [{ goalId: g.id, amount: Number(alloc.amount) }] : []
        })
        const hasData = categorySpends.length > 0 || savingsContribs.length > 0
        return { month, hasData, categorySpends, savingsContribs, surplusAllocations }
      })

      return {
        incomeSources: incomeSourcesOut, groups: groupsOut, savings: savingsOut, goals: goalsOut, monthlyData,
        budgetStartYear: user?.budgetStartYear ?? null,
        budgetStartMonth: user?.budgetStartMonth ?? null,
      }
    },
  })
)
