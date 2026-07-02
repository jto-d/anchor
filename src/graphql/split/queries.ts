import { builder } from '../builder'
import { prisma } from '@/lib/prisma'

builder.queryFields((t) => ({
  splitPartner: t.prismaField({
    type: 'SplitPartner',
    nullable: true,
    resolve: (query, _root, _args, ctx) =>
      prisma.splitPartner.findUnique({ ...query, where: { userId: ctx.userId } }),
  }),

  splitExpenses: t.prismaField({
    type: ['SplitExpense'],
    resolve: (query, _root, _args, ctx) =>
      prisma.splitExpense.findMany({
        ...query,
        where: { userId: ctx.userId },
        orderBy: [{ year: 'desc' }, { month: 'desc' }, { createdAt: 'asc' }],
      }),
  }),

  splitSettlements: t.prismaField({
    type: ['SplitSettlement'],
    resolve: (query, _root, _args, ctx) =>
      prisma.splitSettlement.findMany({
        ...query,
        where: { userId: ctx.userId },
        orderBy: [{ year: 'desc' }, { month: 'desc' }, { createdAt: 'asc' }],
      }),
  }),

  subscriptionSplitExclusions: t.prismaField({
    type: ['SubscriptionSplitExclusion'],
    resolve: (query, _root, _args, ctx) =>
      prisma.subscriptionSplitExclusion.findMany({
        ...query,
        where: { userId: ctx.userId },
      }),
  }),
}))
