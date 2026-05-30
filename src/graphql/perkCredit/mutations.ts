import { builder } from "../builder"
import { prisma } from "@/lib/prisma"

builder.mutationFields((t) => ({
  logPerkCredit: t.prismaField({
    type: "PerkCredit",
    args: {
      perkId: t.arg.string({ required: true }),
      amount: t.arg.float({ required: true }),
      date: t.arg.string({ required: true }),
      description: t.arg.string(),
    },
    resolve: async (query, _root, { perkId, amount, date, description }) =>
      prisma.perkCredit.create({
        ...query,
        data: {
          perkId,
          amount,
          date: new Date(date),
          description: description ?? null,
        },
      }),
  }),
}))
