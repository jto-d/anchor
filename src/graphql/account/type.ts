import { builder } from '../builder'

builder.prismaObject('Account', {
  fields: (t) => ({
    id: t.exposeID('id'),
    nick: t.exposeString('nick'),
    inst: t.exposeString('inst'),
    source: t.field({ type: 'String', resolve: (a) => a.source }),
    type: t.field({ type: 'String', resolve: (a) => a.type }),
    balance: t.field({ type: 'Float', resolve: (a) => a.balance.toNumber() }),
    isEmergencyFund: t.exposeBoolean('isEmergencyFund'),
    balanceUpdatedAt: t.field({ type: 'String', resolve: (a) => a.balanceUpdatedAt.toISOString() }),
    createdAt: t.field({ type: 'String', resolve: (a) => a.createdAt.toISOString() }),
  }),
})
