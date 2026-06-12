import { builder } from "../builder"
import { prisma } from "@/lib/prisma"

builder.queryFields((t) => ({
    perks: t.prismaField({
        type: ["Perk"],
        resolve: (query, _root, _args, ctx) =>
            prisma.perk.findMany({
                ...query,
                where: { creditCard: { userId: ctx.userId } },
            }),
    }),
    perkCredits: t.prismaField({
        type: ["PerkCredit"],
        args: {
            perkId: t.arg.string({ required: true }),
        },
        resolve: (query, _root, { perkId }, ctx) =>
            prisma.perkCredit.findMany({
                ...query,
                where: { perkId, perk: { creditCard: { userId: ctx.userId } } },
                orderBy: { date: "desc" },
            }),
    }),
}))
