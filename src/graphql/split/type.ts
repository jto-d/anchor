import { builder } from '../builder'

builder.prismaObject('SplitPartner', {
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
  }),
})

builder.prismaObject('SplitExpense', {
  fields: (t) => ({
    id: t.exposeID('id'),
    year: t.exposeInt('year'),
    month: t.exposeInt('month'),
    date: t.exposeString('date', { nullable: true }),
    desc: t.exposeString('desc'),
    amount: t.field({ type: 'String', resolve: (e) => e.amount.toString() }),
    payer: t.exposeString('payer'),
    cat: t.exposeString('cat'),
    splitYou: t.exposeInt('splitYou'),
    splitThem: t.exposeInt('splitThem'),
    createdAt: t.field({ type: 'String', resolve: (e) => e.createdAt.toISOString() }),
  }),
})

builder.prismaObject('SplitSettlement', {
  fields: (t) => ({
    id: t.exposeID('id'),
    year: t.exposeInt('year'),
    month: t.exposeInt('month'),
    date: t.exposeString('date', { nullable: true }),
    amount: t.field({ type: 'String', resolve: (s) => s.amount.toString() }),
    fromPayer: t.exposeString('fromPayer'),
    createdAt: t.field({ type: 'String', resolve: (s) => s.createdAt.toISOString() }),
  }),
})
