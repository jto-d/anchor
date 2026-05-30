import { builder } from "../builder"

builder.prismaObject("PerkCredit", {
    fields: (t) => ({
        id: t.exposeID("id"),
        amount: t.field({
            type: "String",
            resolve: (pc) => pc.amount.toString(),
        }),
        date: t.field({
            type: "String",
            resolve: (pc) => pc.date.toISOString(),
        }),
        description: t.exposeString("description", { nullable: true }),
        createdAt: t.field({
            type: "String",
            resolve: (pc) => pc.createdAt.toISOString(),
        }),
        perk: t.relation("perk"),
    })
})
