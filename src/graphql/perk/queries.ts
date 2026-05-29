import { builder } from "../builder"
import { prisma } from "@/lib/prisma"

builder.queryFields((t) => ({
    perks: t.prismaField({
        type: ["Perk"],
        resolve: (query) =>
            prisma.perk.findMany({ ...query }),
    }),
    perkCredits: t.prismaField({
        type: ["PerkCredit"],
        args: {
            perkId: t.arg.string({ required: true }),
        },
        resolve: (query, _root, { perkId }) =>
            prisma.perkCredit.findMany({
                ...query,
                where: { perkId },
                orderBy: { date: "desc" },
            }),
    }),
}))
