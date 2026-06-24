import { builder } from '../builder'

builder.prismaObject('Subscription', {
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    cat: t.exposeString('cat'),
    icon: t.exposeString('icon'),
    cost: t.field({ type: 'String', resolve: (s) => s.cost.toString() }),
    period: t.exposeString('period'),
    day: t.exposeInt('day'),
    renewM: t.exposeInt('renewM', { nullable: true }),
    cardId: t.exposeString('cardId'),
    plan: t.exposeString('plan', { nullable: true }),
    paused: t.exposeBoolean('paused'),
    cancelPending: t.exposeBoolean('cancelPending'),
    createdAt: t.field({ type: 'String', resolve: (s) => s.createdAt.toISOString() }),
  }),
})
