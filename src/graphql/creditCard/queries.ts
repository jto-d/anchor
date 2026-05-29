import { builder } from "../builder";
import { prisma } from "@/lib/prisma"

builder.queryFields((t) => ({
    creditCards: t.prismaField({
        type: ["CreditCard"],
        resolve: (query, root, args, ctx, info) =>
            prisma.creditCard.findMany({
                ...query,
                where: { userId: ctx.userId},
            }),
    }),
}));