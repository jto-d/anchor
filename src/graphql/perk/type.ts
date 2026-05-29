import { builder } from "../builder"

const PerkPeriod = builder.enumType("PerkPeriod", {
    values: ["MONTHLY", "QUARTERLY", "SEMI_ANNUAL", "ANNUAL"] as const,
})

builder.prismaObject("Perk", {
    fields: (t) => ({
        id: t.exposeID("id"),
        name: t.exposeString("name"),
        totalAmount: t.field({
            type: "String",
            resolve: (perk) => perk.totalAmount.toString(),
        }),
        period: t.expose("period", { type: PerkPeriod }),
        periodStartMonth: t.exposeInt("periodStartMonth"),
        notes: t.exposeString("notes", { nullable: true }),
        createdAt: t.field({
            type: "String",
            resolve: (perk) => perk.createdAt.toISOString(),
        }),
        creditCard: t.relation("creditCard"),
        perkCredits: t.relation("perkCredit"),
    })
})