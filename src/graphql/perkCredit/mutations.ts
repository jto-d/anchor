import { builder } from "../builder"
import { prisma } from "@/lib/prisma"
import { roundCents } from "@/utils/money"

builder.mutationFields((t) => ({
  logPerkCredit: t.prismaField({
    type: "PerkCredit",
    args: {
      perkId: t.arg.string({ required: true }),
      amount: t.arg.float({ required: true }),
      date: t.arg.string({ required: true }),
      description: t.arg.string(),
    },
    resolve: async (query, _root, { perkId, amount, date, description }, ctx) => {
      if (amount <= 0) throw new Error('amount must be greater than 0')

      const parsedDate = new Date(date)
      if (isNaN(parsedDate.getTime())) throw new Error('date is not a valid date')

      const perk = await prisma.perk.findFirst({
        where: { id: perkId, creditCard: { userId: ctx.userId } },
        select: { id: true },
      })
      if (!perk) throw new Error('Perk not found')

      return prisma.perkCredit.create({
        ...query,
        data: {
          perkId,
          amount: roundCents(amount),
          date: parsedDate,
          description: description ?? null,
        },
      })
    },
  }),
}))
