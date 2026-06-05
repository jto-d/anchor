import { builder } from "../builder";

builder.prismaObject("CreditCard", {
    fields: (t) => ({
        id: t.exposeID('id'),
        name: t.exposeString("name"),
        issuer: t.exposeString("issuer"),
        lastFour: t.exposeString("lastFour", { nullable: true }),
        openedDate: t.field({
            type: "String",
            nullable: true,
            resolve: (cc) => cc.openedDate?.toISOString() ?? null,
        }),
        design: t.exposeString("design", { nullable: true }),
        user: t.relation("user"),
        perks: t.relation("perks"),
    })
})