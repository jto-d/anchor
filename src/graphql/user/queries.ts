import { builder } from "../builder";
import { prisma } from "@/lib/prisma";

builder.queryType({
    fields: (t) => ({
        me: t.prismaField({
            type: 'User',
            resolve: async (query, root, args, ctx, info) =>
                prisma.user.findUniqueOrThrow({
                    ...query,
                    where: { id: ctx.userId },
                }),
        })
    })
})