import { builder } from '../builder'
import { prisma } from '@/lib/prisma'

// ---- Income ---------------------------------------------------------------

builder.mutationFields((t) => ({
  addIncomeSource: t.field({
    type: 'Boolean',
    args: {
      label: t.arg.string({ required: true }),
      amount: t.arg.float({ required: true }),
    },
    resolve: async (_root, { label, amount }, ctx) => {
      const count = await prisma.incomeSource.count({ where: { userId: ctx.userId } })
      await prisma.incomeSource.create({
        data: { userId: ctx.userId, label, amount, position: count },
      })
      return true
    },
  }),

  setIncomeAmount: t.field({
    type: 'Boolean',
    args: {
      id: t.arg.string({ required: true }),
      amount: t.arg.float({ required: true }),
    },
    resolve: async (_root, { id, amount }, ctx) => {
      await prisma.incomeSource.updateMany({
        where: { id, userId: ctx.userId },
        data: { amount },
      })
      return true
    },
  }),

  renameIncomeSource: t.field({
    type: 'Boolean',
    args: {
      id: t.arg.string({ required: true }),
      label: t.arg.string({ required: true }),
    },
    resolve: async (_root, { id, label }, ctx) => {
      await prisma.incomeSource.updateMany({
        where: { id, userId: ctx.userId },
        data: { label },
      })
      return true
    },
  }),

  removeIncomeSource: t.field({
    type: 'Boolean',
    args: { id: t.arg.string({ required: true }) },
    resolve: async (_root, { id }, ctx) => {
      await prisma.incomeSource.deleteMany({ where: { id, userId: ctx.userId } })
      return true
    },
  }),

  // ---- Categories ----------------------------------------------------------

  addBudgetCategory: t.field({
    type: 'Boolean',
    args: {
      groupId: t.arg.string({ required: true }),
      label: t.arg.string({ required: true }),
      icon: t.arg.string({ required: true }),
      budget: t.arg.float({ required: true }),
    },
    resolve: async (_root, { groupId, label, icon, budget }, ctx) => {
      const group = await prisma.budgetGroup.findFirst({ where: { id: groupId, userId: ctx.userId } })
      if (!group) throw new Error('Group not found')
      const count = await prisma.budgetCategory.count({ where: { groupId } })
      await prisma.budgetCategory.create({ data: { groupId, label, icon, budget, position: count } })
      return true
    },
  }),

  setCategoryBudget: t.field({
    type: 'Boolean',
    args: {
      id: t.arg.string({ required: true }),
      budget: t.arg.float({ required: true }),
    },
    resolve: async (_root, { id, budget }, ctx) => {
      const cat = await prisma.budgetCategory.findFirst({
        where: { id, group: { userId: ctx.userId } },
      })
      if (!cat) throw new Error('Category not found')
      await prisma.budgetCategory.update({ where: { id }, data: { budget } })
      return true
    },
  }),

  renameCategory: t.field({
    type: 'Boolean',
    args: {
      id: t.arg.string({ required: true }),
      label: t.arg.string({ required: true }),
    },
    resolve: async (_root, { id, label }, ctx) => {
      const cat = await prisma.budgetCategory.findFirst({
        where: { id, group: { userId: ctx.userId } },
      })
      if (!cat) throw new Error('Category not found')
      await prisma.budgetCategory.update({ where: { id }, data: { label } })
      return true
    },
  }),

  removeBudgetCategory: t.field({
    type: 'Boolean',
    args: { id: t.arg.string({ required: true }) },
    resolve: async (_root, { id }, ctx) => {
      const cat = await prisma.budgetCategory.findFirst({
        where: { id, group: { userId: ctx.userId } },
      })
      if (!cat) throw new Error('Category not found')
      await prisma.budgetCategory.delete({ where: { id } })
      return true
    },
  }),

  setMonthlySpend: t.field({
    type: 'Boolean',
    args: {
      categoryId: t.arg.string({ required: true }),
      year: t.arg.int({ required: true }),
      month: t.arg.int({ required: true }),
      amount: t.arg.float({ required: true }),
    },
    resolve: async (_root, { categoryId, year, month, amount }, ctx) => {
      const cat = await prisma.budgetCategory.findFirst({
        where: { id: categoryId, group: { userId: ctx.userId } },
      })
      if (!cat) throw new Error('Category not found')
      await prisma.monthlySpend.upsert({
        where: { categoryId_year_month: { categoryId, year, month } },
        create: { categoryId, year, month, amount },
        update: { amount },
      })
      return true
    },
  }),

  // ---- Savings -------------------------------------------------------------

  addSavingsAccount: t.field({
    type: 'Boolean',
    args: {
      label: t.arg.string({ required: true }),
      accountType: t.arg.string({ required: true }),
      icon: t.arg.string({ required: true }),
      monthly: t.arg.float({ required: true }),
      annualLimit: t.arg.float(),
    },
    resolve: async (_root, { label, accountType, icon, monthly, annualLimit }, ctx) => {
      const count = await prisma.savingsAccount.count({ where: { userId: ctx.userId } })
      await prisma.savingsAccount.create({
        data: { userId: ctx.userId, label, accountType, icon, monthly, annualLimit, position: count },
      })
      return true
    },
  }),

  setSavingsMonthly: t.field({
    type: 'Boolean',
    args: {
      id: t.arg.string({ required: true }),
      monthly: t.arg.float({ required: true }),
    },
    resolve: async (_root, { id, monthly }, ctx) => {
      await prisma.savingsAccount.updateMany({ where: { id, userId: ctx.userId }, data: { monthly } })
      return true
    },
  }),

  renameSavingsAccount: t.field({
    type: 'Boolean',
    args: {
      id: t.arg.string({ required: true }),
      label: t.arg.string({ required: true }),
    },
    resolve: async (_root, { id, label }, ctx) => {
      await prisma.savingsAccount.updateMany({ where: { id, userId: ctx.userId }, data: { label } })
      return true
    },
  }),

  removeSavingsAccount: t.field({
    type: 'Boolean',
    args: { id: t.arg.string({ required: true }) },
    resolve: async (_root, { id }, ctx) => {
      await prisma.savingsAccount.deleteMany({ where: { id, userId: ctx.userId } })
      return true
    },
  }),

  setMonthlyContribution: t.field({
    type: 'Boolean',
    args: {
      accountId: t.arg.string({ required: true }),
      year: t.arg.int({ required: true }),
      month: t.arg.int({ required: true }),
      amount: t.arg.float({ required: true }),
    },
    resolve: async (_root, { accountId, year, month, amount }, ctx) => {
      const acct = await prisma.savingsAccount.findFirst({ where: { id: accountId, userId: ctx.userId } })
      if (!acct) throw new Error('Account not found')
      await prisma.monthlyContribution.upsert({
        where: { accountId_year_month: { accountId, year, month } },
        create: { accountId, year, month, amount },
        update: { amount },
      })
      return true
    },
  }),

  // ---- Surplus allocation --------------------------------------------------

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
