import { builder } from "../builder";
import { prisma } from "@/lib/prisma"

builder.queryFields((t) => ({
    creditCards: t.prismaField({
        type: ["CreditCard"],
        resolve: (query) =>
            prisma.creditCard.findMany({
                ...query
            }),
    }),
}));