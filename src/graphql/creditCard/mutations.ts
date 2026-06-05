import { builder } from "../builder"
import { prisma } from "@/lib/prisma"
import { CARD_CATALOG } from "@/data/cardCatalog"
import { PERK_CATALOG } from "@/data/perkCatalog"

builder.mutationFields((t) => ({
  addCard: t.prismaField({
    type: "CreditCard",
    args: {
      catalogKey: t.arg.string({ required: true }),
      lastFour: t.arg.string(),
    },
    resolve: async (query, _root, { catalogKey, lastFour }, ctx) => {
      const entry = CARD_CATALOG[catalogKey]
      if (!entry) throw new Error(`Unknown catalog key: ${catalogKey}`)

      const perks = PERK_CATALOG[catalogKey] ?? []

      return prisma.creditCard.create({
        ...query,
        data: {
          userId: ctx.userId,
          name: entry.name,
          issuer: entry.issuer,
          design: catalogKey,
          lastFour: lastFour ?? null,
          perks: perks.length ? { create: perks } : undefined,
        },
      })
    },
  }),
}))
