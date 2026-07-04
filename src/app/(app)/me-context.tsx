'use client'

import { createContext, useContext } from 'react'
import type { MeQuery } from '@/gql/graphql'
import type { Card, Perk } from '@/utils/types'

export interface MeContextValue {
  /** The full Me graph, fetched once by the app layout. */
  data: MeQuery
  /** Convenience accessor for the user's credit cards. */
  cards: Card[]
  /** Re-run the Me query from the network (after a mutation). */
  refetch: () => void
  /** Open the shared "log a credit" dialog for a perk. */
  openLogDialog: (perk: Perk) => void
}

const MeContext = createContext<MeContextValue | null>(null)

export const MeProvider = MeContext.Provider

export function useMe(): MeContextValue {
  const ctx = useContext(MeContext)
  if (!ctx) throw new Error('useMe must be used within the app layout')
  return ctx
}
