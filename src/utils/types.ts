import type { MeQuery } from '@/gql/graphql'

export type Card = MeQuery['me']['creditCards'][number]
export type Perk = Card['perks'][number]
export type PerkCredit = Perk['perkCredits'][number]

export type StatusKey = 'captured' | 'partial' | 'expiring' | 'open' | 'forfeited' | 'ongoing'
export type VerdictKey = 'worthIt' | 'marginal' | 'reviewIt' | 'noFee'
