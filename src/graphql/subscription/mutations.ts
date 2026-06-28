import { builder } from '../builder'
import { prisma } from '@/lib/prisma'

const MAX_NAME_LENGTH = 50

builder.mutationFields((t) => ({
  addSubscription: t.prismaField({
    type: 'Subscription',
    args: {
      name: t.arg.string({ required: true }),
      cat: t.arg.string({ required: true }),
      icon: t.arg.string({ required: true }),
      cost: t.arg.string({ required: true }),
      period: t.arg.string({ required: true }),
      day: t.arg.int({ required: true }),
      renewM: t.arg.int(),
      cardId: t.arg.string({ required: true }),
      plan: t.arg.string(),
    },
    resolve: (query, _root, args, ctx) => {
      if (args.name.length > MAX_NAME_LENGTH) {
        throw new Error('Name must be less than 50 characters')
      }
      return prisma.subscription.create({
        ...query,
        data: {
          userId: ctx.userId,
          name: args.name,
          cat: args.cat,
          icon: args.icon,
          cost: args.cost,
          period: args.period,
          day: args.day,
          renewM: args.renewM ?? null,
          cardId: args.cardId,
          plan: args.plan ?? null,
        },
      })
    },
  }),

  removeSubscription: t.field({
    type: 'Boolean',
    args: { id: t.arg.string({ required: true }) },
    resolve: async (_root, { id }, ctx) => {
      await prisma.subscription.delete({ where: { id, userId: ctx.userId } })
      return true
    },
  }),

  updateSubscription: t.prismaField({
    type: 'Subscription',
    args: {
      id: t.arg.string({ required: true }),
      name: t.arg.string(),
      cost: t.arg.string(),
      paused: t.arg.boolean(),
      cancelPending: t.arg.boolean(),
    },
    resolve: (query, _root, { id, name, cost, paused, cancelPending }, ctx) => {
      if (name && name.length > MAX_NAME_LENGTH) {
        throw new Error('Name must be less than 50 characters')
      }
      return prisma.subscription.update({
        ...query,
        where: { id, userId: ctx.userId },
        data: {
          ...(name != null && { name }),
          ...(cost != null && { cost }),
          ...(paused != null && { paused }),
          ...(cancelPending != null && { cancelPending }),
        },
      })
    },
  }),
}))
