import { AccountType, AccountSource } from '@prisma/client'
import { builder } from '../builder'
import { prisma } from '@/lib/prisma'
import { plaid } from '@/lib/plaid'
import { CountryCode, Products } from 'plaid'

const SUBTYPE_MAP: Partial<Record<string, AccountType>> = {
  checking:        'CHECKING',
  savings:         'SAVINGS',
  money_market:    'MONEY_MARKET',
  cd:              'CD',
  brokerage:       'BROKERAGE',
  '401k':          'FOUR_OH_ONE_K',
  roth:            'ROTH_IRA',
  'traditional ira': 'TRADITIONAL_IRA',
  hsa:             'HSA',
  '529':           'FIVE_TWO_NINE',
  crypto:          'CRYPTO',
  'credit card':   'CREDIT_CARD',
}

const TYPE_FALLBACK: Partial<Record<string, AccountType>> = {
  depository: 'CHECKING',
  investment: 'BROKERAGE',
  credit:     'CREDIT_CARD',
  loan:       'CHECKING',
  other:      'CHECKING',
}

function resolveAccountType(type: string, subtype: string | null | undefined): AccountType {
  if (subtype) {
    const mapped = SUBTYPE_MAP[subtype.toLowerCase()]
    if (mapped) return mapped
  }
  return TYPE_FALLBACK[type.toLowerCase()] ?? 'CHECKING'
}

builder.queryFields((t) => ({
  listAccounts: t.prismaField({
    type: ['Account'],
    resolve: (query, _root, _args, ctx) =>
      prisma.account.findMany({ ...query, where: { userId: ctx.userId }, orderBy: { createdAt: 'asc' } }),
  }),
}))

builder.mutationFields((t) => ({
  createPlaidLinkToken: t.field({
    type: 'String',
    resolve: async (_root, _args, ctx) => {
      try {
        const response = await plaid.linkTokenCreate({
          user: { client_user_id: ctx.userId },
          client_name: 'Anchor',
          products: [Products.Transactions],
          country_codes: [CountryCode.Us],
          language: 'en',
        })
        return response.data.link_token
      } catch (err: unknown) {
        const data = (err as { response?: { data?: { error_message?: string; display_message?: string } } }).response?.data
        const msg = data?.display_message ?? data?.error_message ?? 'Plaid request failed'
        throw new Error(`Plaid: ${msg}`)
      }
    },
  }),

  exchangePlaidToken: t.prismaField({
    type: ['Account'],
    args: {
      publicToken:     t.arg.string({ required: true }),
      institutionId:   t.arg.string({ required: true }),
      institutionName: t.arg.string({ required: true }),
    },
    resolve: async (query, _root, { publicToken, institutionId, institutionName }, ctx) => {
      const { data: tokenData } = await plaid.itemPublicTokenExchange({ public_token: publicToken })
      const accessToken = tokenData.access_token
      const itemId = tokenData.item_id

      const { data: accountsData } = await plaid.accountsGet({ access_token: accessToken })

      const item = await prisma.plaidItem.create({
        data: { userId: ctx.userId, accessToken, itemId, institutionId, institutionName },
      })

      await prisma.account.createMany({
        data: accountsData.accounts.map((a) => ({
          userId: ctx.userId,
          plaidItemId: item.id,
          plaidAccountId: a.account_id,
          source: AccountSource.PLAID,
          type: resolveAccountType(a.type, a.subtype),
          nick: a.name,
          inst: institutionName,
          balance: a.balances.current ?? a.balances.available ?? 0,
          isEmergencyFund: false,
        })),
      })

      return prisma.account.findMany({
        ...query,
        where: { userId: ctx.userId, plaidItemId: item.id },
        orderBy: { createdAt: 'asc' },
      })
    },
  }),

  addManualAccount: t.prismaField({
    type: 'Account',
    args: {
      type:           t.arg.string({ required: true }),
      nick:           t.arg.string({ required: true }),
      inst:           t.arg.string({ required: true }),
      balance:        t.arg.string({ required: true }),
      isEmergencyFund: t.arg.boolean(),
    },
    resolve: async (query, _root, { type, nick, inst, balance, isEmergencyFund }, ctx) => {
      const validTypes = Object.values(AccountType)
      if (!validTypes.includes(type as AccountType)) {
        throw new Error(`Invalid account type: ${type}`)
      }
      const balanceNum = parseFloat(balance)
      if (isNaN(balanceNum) || balanceNum < 0) {
        throw new Error('balance must be a non-negative number')
      }
      return prisma.account.create({
        ...query,
        data: {
          userId: ctx.userId,
          source: AccountSource.MANUAL,
          type: type as AccountType,
          nick,
          inst,
          balance: balanceNum,
          isEmergencyFund: isEmergencyFund ?? false,
        },
      })
    },
  }),

  removeAccount: t.field({
    type: 'Boolean',
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (_root, { id }, ctx) => {
      const account = await prisma.account.findUnique({ where: { id } })
      if (!account || account.userId !== ctx.userId) throw new Error('Not found')

      const plaidItemId = account.plaidItemId
      await prisma.account.delete({ where: { id } })

      if (plaidItemId) {
        const remaining = await prisma.account.count({ where: { plaidItemId } })
        if (remaining === 0) {
          await prisma.plaidItem.delete({ where: { id: plaidItemId } })
        }
      }
      return true
    },
  }),
}))
