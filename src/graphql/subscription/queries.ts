import { builder } from '../builder'
import { prisma } from '@/lib/prisma'

builder.queryFields((t) => ({
  subscriptions: t.prismaField({
    type: ['Subscription'],
    resolve: (query, _root, _args, ctx) =>
      prisma.subscription.findMany({
        ...query,
        where: { userId: ctx.userId },
        orderBy: { createdAt: 'asc' },
      }),
  }),
}))
