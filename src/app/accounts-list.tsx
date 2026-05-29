'use client'

import { useQuery } from '@urql/next'
import { graphql } from '@/gql'
import type { AccountsQuery, AccountsQueryVariables } from '@/gql/graphql'

const AccountsDocument = graphql(`
  query Accounts {
    accounts {
      id
      name
      transactions {
        id
        description
        amount
        occurredAt
      }
    }
  }
`)

export function AccountsList() {
  const [{ data, fetching, error }] = useQuery<
    AccountsQuery,
    AccountsQueryVariables
  >({ query: AccountsDocument })

  if (fetching) return <p className="text-sm text-zinc-500">Loading…</p>
  if (error) return <p className="text-sm text-red-500">{error.message}</p>
  if (!data) return null

  return (
    <ul className="space-y-8">
      {data.accounts.map((account) => (
        <li key={account.id}>
          <h2 className="text-xl font-semibold mb-3">{account.name}</h2>
          {account.transactions.length === 0 ? (
            <p className="text-sm text-zinc-500">No transactions yet.</p>
          ) : (
            <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {account.transactions.map((tx) => (
                <li
                  key={tx.id}
                  className="flex items-baseline justify-between py-2 text-sm"
                >
                  <span>
                    <span className="font-medium">{tx.description}</span>
                    <span className="ml-2 text-xs text-zinc-500">
                      {new Date(tx.occurredAt).toLocaleDateString()}
                    </span>
                  </span>
                  <span className="font-mono tabular-nums">{tx.amount}</span>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  )
}
