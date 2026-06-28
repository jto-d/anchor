import { builder } from '../builder'
import { prisma } from '@/lib/prisma'

builder.mutationFields((t) => ({
  setSplitPartner: t.prismaField({
    type: 'SplitPartner',
    args: { name: t.arg.string({ required: true }) },
    resolve: (query, _root, { name }, ctx) =>
      prisma.splitPartner.upsert({
        ...query,
        where: { userId: ctx.userId },
        create: { userId: ctx.userId, name },
        update: { name },
      }),
  }),

  addSplitExpense: t.prismaField({
    type: 'SplitExpense',
    args: {
      year: t.arg.int({ required: true }),
      month: t.arg.int({ required: true }),
      date: t.arg.string(),
      desc: t.arg.string({ required: true }),
      amount: t.arg.string({ required: true }),
      payer: t.arg.string({ required: true }),
      cat: t.arg.string({ required: true }),
      splitYou: t.arg.int({ required: true }),
      splitThem: t.arg.int({ required: true }),
    },
    resolve: (query, _root, args, ctx) =>
      prisma.splitExpense.create({
        ...query,
        data: {
          userId: ctx.userId,
          year: args.year,
          month: args.month,
          date: args.date ?? null,
          desc: args.desc,
          amount: args.amount,
          payer: args.payer,
          cat: args.cat,
          splitYou: args.splitYou,
          splitThem: args.splitThem,
        },
      }),
  }),

  updateSplitExpense: t.prismaField({
    type: 'SplitExpense',
    args: {
      id: t.arg.string({ required: true }),
      date: t.arg.string(),
      desc: t.arg.string(),
      amount: t.arg.string(),
      payer: t.arg.string(),
      cat: t.arg.string(),
      splitYou: t.arg.int(),
      splitThem: t.arg.int(),
    },
    resolve: async (query, _root, { id, date, desc, amount, payer, cat, splitYou, splitThem }, ctx) => {
      const existing = await prisma.splitExpense.findUnique({ where: { id } })
      if (!existing || existing.userId !== ctx.userId) throw new Error('Not found')
      return prisma.splitExpense.update({
        ...query,
        where: { id },
        data: {
          ...(date !== undefined && { date: date ?? null }),
          ...(desc != null && { desc }),
          ...(amount != null && { amount }),
          ...(payer != null && { payer }),
          ...(cat != null && { cat }),
          ...(splitYou != null && { splitYou }),
          ...(splitThem != null && { splitThem }),
        },
      })
    },
  }),

  removeSplitExpense: t.field({
    type: 'Boolean',
    args: { id: t.arg.string({ required: true }) },
    resolve: async (_root, { id }, ctx) => {
      const existing = await prisma.splitExpense.findUnique({ where: { id } })
      if (!existing || existing.userId !== ctx.userId) throw new Error('Not found')
      await prisma.splitExpense.delete({ where: { id } })
      return true
    },
  }),

  addSplitSettlement: t.prismaField({
    type: 'SplitSettlement',
    args: {
      year: t.arg.int({ required: true }),
      month: t.arg.int({ required: true }),
      date: t.arg.string(),
      amount: t.arg.string({ required: true }),
      fromPayer: t.arg.string({ required: true }),
    },
    resolve: (query, _root, args, ctx) =>
      prisma.splitSettlement.create({
        ...query,
        data: {
          userId: ctx.userId,
          year: args.year,
          month: args.month,
          date: args.date ?? null,
          amount: args.amount,
          fromPayer: args.fromPayer,
        },
      }),
  }),

  removeSplitSettlement: t.field({
    type: 'Boolean',
    args: { id: t.arg.string({ required: true }) },
    resolve: async (_root, { id }, ctx) => {
      const existing = await prisma.splitSettlement.findUnique({ where: { id } })
      if (!existing || existing.userId !== ctx.userId) throw new Error('Not found')
      await prisma.splitSettlement.delete({ where: { id } })
      return true
    },
  }),
}))
