import SchemaBuilder from '@pothos/core'
import PrismaPlugin from '@pothos/plugin-prisma'
import type PrismaTypes from '@pothos/plugin-prisma/generated'
import { getDatamodel } from '@pothos/plugin-prisma/generated'
import { prisma } from '@/lib/prisma'

export const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes
  DefaultFieldNullability: false
  Context: { userId: string }
}>({
  defaultFieldNullability: false,
  plugins: [PrismaPlugin],
  prisma: {
    client: prisma,
    dmmf: getDatamodel(),
    onUnusedQuery: process.env.NODE_ENV === 'production' ? null : 'warn',
  },
})

builder.queryType({})
builder.mutationType({})