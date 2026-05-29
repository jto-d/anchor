'use client'

import { useQuery } from '@urql/next'
import { graphql } from '@/gql'
import type { MeQuery, MeQueryVariables } from '@/gql/graphql'

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

const PERIOD_LABEL: Record<string, string> = {
  MONTHLY: 'Monthly',
  QUARTERLY: 'Quarterly',
  SEMI_ANNUAL: 'Semi-annual',
  ANNUAL: 'Annual',
}

const MeDocument = graphql(`
  query Me {
    me {
      id
      email
      creditCards {
        id
        name
        issuer
        lastFour
        perks {
          id
          name
          totalAmount
          period
          periodStartMonth
          notes
          perkCredits {
            id
            amount
            date
            description
          }
        }
      }
    }
  }
`)

export function MeView() {
  const [{ data, fetching, error }] = useQuery<MeQuery, MeQueryVariables>({
    query: MeDocument,
  })

  if (fetching) return <p className="text-sm text-zinc-500">Loading…</p>
  if (error) return <p className="text-sm text-red-500">{error.message}</p>
  if (!data) return null

  const { me } = data

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sm uppercase tracking-wide text-zinc-500">User</h2>
        <p className="mt-1 font-mono text-sm">{me.id}</p>
        <p className="text-base">{me.email}</p>
      </div>

      <div>
        <h2 className="text-sm uppercase tracking-wide text-zinc-500">
          Credit cards
        </h2>
        {me.creditCards.length === 0 ? (
          <p className="mt-1 text-sm text-zinc-500">No cards yet.</p>
        ) : (
          <ul className="mt-2 space-y-6">
            {me.creditCards.map((card) => (
              <li key={card.id}>
                <div className="flex items-baseline justify-between text-sm">
                  <span>
                    <span className="font-medium">{card.name}</span>
                    <span className="ml-2 text-xs text-zinc-500">
                      {card.issuer}
                    </span>
                  </span>
                  {card.lastFour && (
                    <span className="font-mono tabular-nums text-zinc-500">
                      •••• {card.lastFour}
                    </span>
                  )}
                </div>

                {card.perks.length > 0 && (
                  <ul className="mt-2 space-y-4 pl-3 border-l border-zinc-200 dark:border-zinc-800">
                    {card.perks.map((perk) => (
                      <li key={perk.id}>
                        <div className="flex items-baseline justify-between text-sm">
                          <span className="font-medium">{perk.name}</span>
                          <span className="text-xs text-zinc-500 tabular-nums">
                            ${perk.totalAmount} ·{' '}
                            {PERIOD_LABEL[perk.period] ?? perk.period} from{' '}
                            {MONTHS[perk.periodStartMonth - 1]}
                          </span>
                        </div>
                        {perk.notes && (
                          <p className="mt-0.5 text-xs text-zinc-500">{perk.notes}</p>
                        )}

                        {perk.perkCredits.length > 0 && (
                          <ul className="mt-1.5 space-y-0.5">
                            {perk.perkCredits.map((credit) => (
                              <li
                                key={credit.id}
                                className="flex items-baseline justify-between text-xs text-zinc-600 dark:text-zinc-400"
                              >
                                <span>
                                  {new Date(credit.date).toLocaleDateString(
                                    'en-US',
                                    { month: 'short', day: 'numeric', year: 'numeric' },
                                  )}
                                  {credit.description && (
                                    <span className="ml-2 text-zinc-400">
                                      {credit.description}
                                    </span>
                                  )}
                                </span>
                                <span className="tabular-nums">${credit.amount}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
