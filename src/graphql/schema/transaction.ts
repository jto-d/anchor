import { builder } from './builder'

builder.prismaObject('Transaction', {
  fields: (t) => ({
    id: t.exposeID('id'),
    description: t.exposeString('description'),
    amount: t.string({ resolve: (tx) => tx.amount.toString() }),
    occurredAt: t.string({ resolve: (tx) => tx.occurredAt.toISOString() }),
    createdAt: t.string({ resolve: (tx) => tx.createdAt.toISOString() }),
    account: t.relation('account'),
  }),
})
