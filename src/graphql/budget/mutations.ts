import type { Prisma } from '@prisma/client'
import { builder } from '../builder'
import { prisma } from '@/lib/prisma'
import { sumCents } from '@/utils/money'

/**
 * Keeps a category's stored MonthlyBudget/MonthlySpend rows for (year, month) equal to the
 * sum of its line items, so every existing category-level read (totals, group headers, the
 * category row itself) stays correct without special-casing "does this category have lines".
 * No-op once a category has no line items left — its last-known rollup is left in place
 * rather than reverting to a stale pre-breakdown value.
 */
async function syncCategoryMonthTotals(
  tx: Prisma.TransactionClient,
  categoryId: string,
  year: number,
  month: number,
) {
  const lineItems = await tx.budgetLineItem.findMany({
    where: { categoryId },
    include: {
      monthlyBudgets: { where: { year, month } },
      spends: { where: { year, month } },
    },
  })
  if (lineItems.length === 0) return

  const budgetTotal = sumCents(lineItems, (l) => Number(l.monthlyBudgets[0]?.budget ?? l.budget))
  const spentTotal = sumCents(lineItems, (l) => Number(l.spends[0]?.amount ?? 0))

  await tx.monthlyBudget.upsert({
    where: { categoryId_year_month: { categoryId, year, month } },
    create: { categoryId, year, month, budget: budgetTotal },
    update: { budget: budgetTotal },
  })
  await tx.monthlySpend.upsert({
    where: { categoryId_year_month: { categoryId, year, month } },
    create: { categoryId, year, month, amount: spentTotal },
    update: { amount: spentTotal },
  })
}

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

  // ---- Groups --------------------------------------------------------------

  addBudgetGroup: t.field({
    type: 'Boolean',
    args: {
      label: t.arg.string({ required: true }),
      icon: t.arg.string({ required: true }),
    },
    resolve: async (_root, { label, icon }, ctx) => {
      const count = await prisma.budgetGroup.count({ where: { userId: ctx.userId } })
      await prisma.budgetGroup.create({ data: { userId: ctx.userId, label, icon, position: count } })
      return true
    },
  }),

  renameBudgetGroup: t.field({
    type: 'Boolean',
    args: {
      id: t.arg.string({ required: true }),
      label: t.arg.string({ required: true }),
    },
    resolve: async (_root, { id, label }, ctx) => {
      await prisma.budgetGroup.updateMany({ where: { id, userId: ctx.userId }, data: { label } })
      return true
    },
  }),

  removeBudgetGroup: t.field({
    type: 'Boolean',
    args: { id: t.arg.string({ required: true }) },
    resolve: async (_root, { id }, ctx) => {
      await prisma.budgetGroup.deleteMany({ where: { id, userId: ctx.userId } })
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

  // ---- Line items ------------------------------------------------------------

  addBudgetLineItem: t.field({
    type: 'Boolean',
    args: {
      categoryId: t.arg.string({ required: true }),
      year: t.arg.int({ required: true }),
      month: t.arg.int({ required: true }),
      label: t.arg.string({ required: true }),
      icon: t.arg.string({ required: true }),
    },
    resolve: async (_root, { categoryId, year, month, label, icon }, ctx) => {
      const cat = await prisma.budgetCategory.findFirst({
        where: { id: categoryId, group: { userId: ctx.userId } },
        include: {
          lineItems: true,
          monthlyBudgets: { where: { year, month } },
          spends: { where: { year, month } },
        },
      })
      if (!cat) throw new Error('Category not found')

      // The first line item inherits the category's current budget/spend so the
      // category's displayed total doesn't drop to zero the moment it's broken out.
      const isFirst = cat.lineItems.length === 0
      const seedBudget = isFirst ? Number(cat.monthlyBudgets[0]?.budget ?? cat.budget) : 0
      const seedSpent = isFirst ? Number(cat.spends[0]?.amount ?? 0) : 0

      await prisma.$transaction(async (tx) => {
        const line = await tx.budgetLineItem.create({
          data: { categoryId, label, icon, budget: seedBudget, position: cat.lineItems.length },
        })
        if (isFirst && seedSpent > 0) {
          await tx.monthlyLineSpend.create({ data: { lineItemId: line.id, year, month, amount: seedSpent } })
        }
        await syncCategoryMonthTotals(tx, categoryId, year, month)
      })
      return true
    },
  }),

  setLineItemBudget: t.field({
    type: 'Boolean',
    args: {
      id: t.arg.string({ required: true }),
      budget: t.arg.float({ required: true }),
    },
    resolve: async (_root, { id, budget }, ctx) => {
      const line = await prisma.budgetLineItem.findFirst({
        where: { id, category: { group: { userId: ctx.userId } } },
      })
      if (!line) throw new Error('Line item not found')
      await prisma.budgetLineItem.update({ where: { id }, data: { budget } })
      return true
    },
  }),

  setLineItemMonthBudget: t.field({
    type: 'Boolean',
    args: {
      id: t.arg.string({ required: true }),
      year: t.arg.int({ required: true }),
      month: t.arg.int({ required: true }),
      budget: t.arg.float({ required: true }),
    },
    resolve: async (_root, { id, year, month, budget }, ctx) => {
      const line = await prisma.budgetLineItem.findFirst({
        where: { id, category: { group: { userId: ctx.userId } } },
      })
      if (!line) throw new Error('Line item not found')
      await prisma.$transaction(async (tx) => {
        await tx.monthlyLineBudget.upsert({
          where: { lineItemId_year_month: { lineItemId: id, year, month } },
          create: { lineItemId: id, year, month, budget },
          update: { budget },
        })
        await syncCategoryMonthTotals(tx, line.categoryId, year, month)
      })
      return true
    },
  }),

  setMonthlyLineSpend: t.field({
    type: 'Boolean',
    args: {
      lineItemId: t.arg.string({ required: true }),
      year: t.arg.int({ required: true }),
      month: t.arg.int({ required: true }),
      amount: t.arg.float({ required: true }),
    },
    resolve: async (_root, { lineItemId, year, month, amount }, ctx) => {
      const line = await prisma.budgetLineItem.findFirst({
        where: { id: lineItemId, category: { group: { userId: ctx.userId } } },
      })
      if (!line) throw new Error('Line item not found')
      await prisma.$transaction(async (tx) => {
        await tx.monthlyLineSpend.upsert({
          where: { lineItemId_year_month: { lineItemId, year, month } },
          create: { lineItemId, year, month, amount },
          update: { amount },
        })
        await syncCategoryMonthTotals(tx, line.categoryId, year, month)
      })
      return true
    },
  }),

  renameLineItem: t.field({
    type: 'Boolean',
    args: {
      id: t.arg.string({ required: true }),
      label: t.arg.string({ required: true }),
    },
    resolve: async (_root, { id, label }, ctx) => {
      const line = await prisma.budgetLineItem.findFirst({
        where: { id, category: { group: { userId: ctx.userId } } },
      })
      if (!line) throw new Error('Line item not found')
      await prisma.budgetLineItem.update({ where: { id }, data: { label } })
      return true
    },
  }),

  removeBudgetLineItem: t.field({
    type: 'Boolean',
    args: {
      id: t.arg.string({ required: true }),
      year: t.arg.int({ required: true }),
      month: t.arg.int({ required: true }),
    },
    resolve: async (_root, { id, year, month }, ctx) => {
      const line = await prisma.budgetLineItem.findFirst({
        where: { id, category: { group: { userId: ctx.userId } } },
      })
      if (!line) throw new Error('Line item not found')
      await prisma.$transaction(async (tx) => {
        await tx.budgetLineItem.delete({ where: { id } })
        await syncCategoryMonthTotals(tx, line.categoryId, year, month)
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

  setCategoryMonthBudget: t.field({
    type: 'Boolean',
    args: {
      id: t.arg.string({ required: true }),
      year: t.arg.int({ required: true }),
      month: t.arg.int({ required: true }),
      budget: t.arg.float({ required: true }),
    },
    resolve: async (_root, { id, year, month, budget }, ctx) => {
      const cat = await prisma.budgetCategory.findFirst({
        where: { id, group: { userId: ctx.userId } },
      })
      if (!cat) throw new Error('Category not found')
      await prisma.monthlyBudget.upsert({
        where: { categoryId_year_month: { categoryId: id, year, month } },
        create: { categoryId: id, year, month, budget },
        update: { budget },
      })
      return true
    },
  }),

  setBudgetStart: t.field({
    type: 'Boolean',
    args: {
      year: t.arg.int({ required: true }),
      month: t.arg.int({ required: true }),
    },
    resolve: async (_root, { year, month }, ctx) => {
      await prisma.user.update({
        where: { id: ctx.userId },
        data: { budgetStartYear: year, budgetStartMonth: month },
      })
      return true
    },
  }),
}))
