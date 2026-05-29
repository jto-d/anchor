import { builder } from './builder'

builder.prismaObject('User', {
  fields: (t) => ({
    id: t.exposeID('id'),
    email: t.exposeString('email'),
    createdAt: t.string({ resolve: (u) => u.createdAt.toISOString() }),
    accounts: t.relation('accounts'),
  }),
})
