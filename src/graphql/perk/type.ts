import { builder } from "../builder"

const PerkPeriod = builder.enumType("PerkPeriod", {
    values: ["MONTHLY", "QUARTERLY", "SEMI_ANNUAL", "ANNUAL", "QUADRENNIAL"] as const,
})

const ResetType = builder.enumType("ResetType", {
    values: ["CALENDAR", "ANNIVERSARY"] as const,
})

builder.prismaObject("Perk", {
    fields: (t) => ({
        id: t.exposeID("id"),
        name: t.exposeString("name"),
        totalAmount: t.field({
            type: "Float",
            resolve: (perk) => perk.totalAmount.toNumber(),
        }),
        period: t.expose("period", { type: PerkPeriod }),
        resetType: t.expose("resetType", { type: ResetType }),
        enrollmentRequired: t.exposeBoolean("enrollmentRequired"),
        notes: t.exposeString("notes", { nullable: true }),
        createdAt: t.field({
            type: "String",
            resolve: (perk) => perk.createdAt.toISOString(),
        }),
        creditCard: t.relation("creditCard"),
        perkCredits: t.relation("perkCredit"),
    })
})
