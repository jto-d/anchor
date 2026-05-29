import { builder } from "../builder";

builder.prismaObject("CreditCard", {
    fields: (t) => ({
        id: t.exposeID('id'),
        name: t.exposeString("name"),
        issuer: t.exposeString("issuer"),
        lastFour: t.exposeString("lastFour", { nullable: true }),
        user: t.relation("user"),
    })
})