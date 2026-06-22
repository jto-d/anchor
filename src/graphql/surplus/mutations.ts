import { builder } from '../builder'
import { prisma } from '@/lib/prisma'

builder.mutationFields((t) => ({
  // ---- Savings Goals -------------------------------------------------------

  addSavingsGoal: t.field({
    type: 'Boolean',
    args: {
      name: t.arg.string({ required: true }),
      icon: t.arg.string({ required: true }),
    },
    resolve: async (_root, { name, icon }, ctx) => {
      await prisma.savingsGoal.create({
        data: { userId: ctx.userId, name, icon, base: 0 },
      })
      return true
    },
  }),

  renameSavingsGoal: t.field({
    type: 'Boolean',
    args: {
      id: t.arg.string({ required: true }),
      name: t.arg.string({ required: true }),
    },
    resolve: async (_root, { id, name }, ctx) => {
      await prisma.savingsGoal.updateMany({ where: { id, userId: ctx.userId }, data: { name } })
      return true
    },
  }),

  setSavingsGoalTarget: t.field({
    type: 'Boolean',
    args: {
      id: t.arg.string({ required: true }),
      target: t.arg.float({ required: false }),
      targetYear: t.arg.int({ required: false }),
      targetMonth: t.arg.int({ required: false }),
    },
    resolve: async (_root, { id, target, targetYear, targetMonth }, ctx) => {
      await prisma.savingsGoal.updateMany({
        where: { id, userId: ctx.userId },
        data: {
          target: target ?? null,
          targetYear: targetYear ?? null,
          targetMonth: targetMonth ?? null,
        },
      })
      return true
    },
  }),

  removeSavingsGoal: t.field({
    type: 'Boolean',
    args: { id: t.arg.string({ required: true }) },
    resolve: async (_root, { id }, ctx) => {
      await prisma.savingsGoal.deleteMany({ where: { id, userId: ctx.userId } })
      return true
    },
  }),

  // ---- Surplus Allocation --------------------------------------------------

  setSurplusAllocation: t.field({
    type: 'Boolean',
    args: {
      goalId: t.arg.string({ required: true }),
      year: t.arg.int({ required: true }),
      month: t.arg.int({ required: true }),
      amount: t.arg.float({ required: true }),
    },
    resolve: async (_root, { goalId, year, month, amount }, ctx) => {
      const goal = await prisma.savingsGoal.findFirst({ where: { id: goalId, userId: ctx.userId } })
      if (!goal) throw new Error('Goal not found')
      if (amount <= 0) {
        await prisma.surplusAllocation.deleteMany({
          where: { goalId, year, month, userId: ctx.userId },
        })
      } else {
        await prisma.surplusAllocation.upsert({
          where: { goalId_year_month: { goalId, year, month } },
          create: { goalId, userId: ctx.userId, year, month, amount },
          update: { amount },
        })
      }
      return true
    },
  }),
}))
