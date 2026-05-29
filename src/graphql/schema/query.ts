import { builder } from './builder'
import { prisma } from '@/lib/prisma'

builder.queryFields((t) => ({
  health: t.string({ resolve: () => 'ok' }),
  accounts: t.prismaField({
    type: ['Account'],
    resolve: (query) =>
      prisma.account.findMany({ ...query, orderBy: { createdAt: 'asc' } }),
  }),
  transactions: t.prismaField({
    type: ['Transaction'],
    resolve: (query) =>
      prisma.transaction.findMany({ ...query, orderBy: { occurredAt: 'desc' } }),
  }),
}))
