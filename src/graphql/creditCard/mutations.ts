import { builder } from "../builder"
import { prisma } from "@/lib/prisma"
import { CARD_CATALOG } from "@/data/cardCatalog"
import { PERK_CATALOG } from "@/data/perkCatalog"

builder.mutationFields((t) => ({
  removeCard: t.field({
    type: 'Boolean',
    args: {
      cardId: t.arg.string({ required: true }),
    },
    resolve: async (_root, { cardId }, ctx) => {
      await prisma.creditCard.delete({ where: { id: cardId, userId: ctx.userId } })
      return true
    },
  }),

  addCard: t.prismaField({
    type: "CreditCard",
    args: {
      catalogKey: t.arg.string({ required: true }),
      lastFour: t.arg.string(),
      openedDate: t.arg.string(),
    },
    resolve: async (query, _root, { catalogKey, lastFour, openedDate }, ctx) => {
      const entry = CARD_CATALOG[catalogKey]
      if (!entry) throw new Error(`Unknown catalog key: ${catalogKey}`)

      if (lastFour != null && !/^\d{4}$/.test(lastFour)) {
        throw new Error('lastFour must be exactly 4 digits')
      }

      if (openedDate != null) {
        const d = new Date(openedDate)
        if (isNaN(d.getTime())) throw new Error('openedDate is not a valid date')
        if (d > new Date()) throw new Error('openedDate cannot be in the future')
      }

      const perks = PERK_CATALOG[catalogKey] ?? []

      return prisma.creditCard.create({
        ...query,
        data: {
          userId: ctx.userId,
          name: entry.name,
          issuer: entry.issuer,
          design: catalogKey,
          lastFour: lastFour ?? null,
          openedDate: openedDate ? new Date(openedDate) : null,
          perks: perks.length ? { create: perks } : undefined,
        },
      })
    },
  }),
}))
