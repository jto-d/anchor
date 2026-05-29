import { builder } from '../builder';

builder.prismaObject("User", {
    fields: (t) => ({
        id: t.exposeID("id"),
        email: t.exposeString("email"),
        creditCards: t.relation("creditCards"),
    })
})