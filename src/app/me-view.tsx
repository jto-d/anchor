'use client'

import { useQuery } from '@urql/next'
import { graphql } from '@/gql'
import type { MeQuery, MeQueryVariables } from '@/gql/graphql'

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
          <ul className="mt-1 divide-y divide-zinc-200 dark:divide-zinc-800">
            {me.creditCards.map((card) => (
              <li
                key={card.id}
                className="flex items-baseline justify-between py-2 text-sm"
              >
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
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
