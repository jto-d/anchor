import { builder } from '../builder'
import { prisma } from '@/lib/prisma'
import { BudgetMonthPayload, BudgetYearPayload } from './types'
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
      const [user, incomeSources, groups, savings, goals] = await Promise.all([
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
      ])

      // Shape income sources
      const incomeSourcesOut = incomeSources.map((s) => ({
        id: s.id,
        label: s.label,
        sub: s.sub,
        amount: s.amount.toString(),
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
          budget: (c.monthlyBudgets[0]?.budget ?? c.budget).toString(),
          position: c.position,
          monthSpent: (c.spends[0]?.amount ?? 0).toString(),
        })),
      }))

      // Shape savings with this month's contribution and YTD
      const savingsOut = savings.map((s) => {
        const monthContrib = s.contributions.find((c) => c.month === month)?.amount ?? 0
        const ytd = s.contributions
          .filter((c) => c.month <= month)
          .reduce((sum, c) => sum + Number(c.amount), 0)
        return {
          id: s.id,
          label: s.label,
          accountType: s.accountType,
          icon: s.icon,
          monthly: s.monthly.toString(),
          annualLimit: s.annualLimit?.toString() ?? null,
          position: s.position,
          monthContrib: monthContrib.toString(),
          ytd: ytd.toString(),
        }
      })

      // Shape goals: running total = base + all allocations EXCEPT this month
      const goalsOut = goals.map((g) => {
        const monthAlloc = g.allocations.find((a) => a.year === year && a.month === month)
        const running =
          Number(g.base) +
          g.allocations
            .filter((a) => !(a.year === year && a.month === month))
            .reduce((sum, a) => sum + Number(a.amount), 0)
        return {
          id: g.id,
          name: g.name,
          icon: g.icon,
          target: g.target?.toString() ?? null,
          base: g.base.toString(),
          targetYear: g.targetYear,
          targetMonth: g.targetMonth,
          running: running.toString(),
          monthAllocated: (monthAlloc?.amount ?? 0).toString(),
        }
      })

      return {
        incomeSources: incomeSourcesOut,
        groups: groupsOut,
        savings: savingsOut,
        goals: goalsOut,
        budgetStartYear: user?.budgetStartYear ?? null,
        budgetStartMonth: user?.budgetStartMonth ?? null,
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
        amount: s.amount.toString(), position: s.position,
      }))

      const groupsOut = groups.map((g) => ({
        id: g.id, label: g.label, icon: g.icon, position: g.position,
        categories: g.categories.map((c) => ({
          id: c.id, label: c.label, icon: c.icon,
          budget: c.budget.toString(), position: c.position, monthSpent: '0',
        })),
      }))

      const savingsOut = savings.map((s) => ({
        id: s.id, label: s.label, accountType: s.accountType, icon: s.icon,
        monthly: s.monthly.toString(), annualLimit: s.annualLimit?.toString() ?? null,
        position: s.position, monthContrib: '0', ytd: '0',
      }))

      // Goals: running = base + all allocations this year
      const goalsOut = goals.map((g) => {
        const running = Number(g.base) + g.allocations.reduce((sum, a) => sum + Number(a.amount), 0)
        return {
          id: g.id, name: g.name, icon: g.icon, target: g.target?.toString() ?? null,
          base: g.base.toString(), targetYear: g.targetYear, targetMonth: g.targetMonth,
          running: running.toString(), monthAllocated: '0',
        }
      })

      // Per-month data for all 12 months of the requested year
      const monthlyData = Array.from({ length: 12 }, (_, month) => {
        const categorySpends = groups.flatMap((g) =>
          g.categories.flatMap((c) => {
            const spend = c.spends.find((s) => s.month === month)
            return spend ? [{ categoryId: c.id, amount: spend.amount.toString() }] : []
          })
        )
        const savingsContribs = savings.flatMap((s) => {
          const contrib = s.contributions.find((c) => c.month === month)
          return contrib ? [{ accountId: s.id, amount: contrib.amount.toString() }] : []
        })
        const surplusAllocations = goals.flatMap((g) => {
          const alloc = g.allocations.find((a) => a.month === month)
          return alloc ? [{ goalId: g.id, amount: alloc.amount.toString() }] : []
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
