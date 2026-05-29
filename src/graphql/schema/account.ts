import { builder } from './builder'

builder.prismaObject('Account', {
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    createdAt: t.string({ resolve: (a) => a.createdAt.toISOString() }),
    user: t.relation('user'),
    transactions: t.relation('transactions'),
  }),
})
