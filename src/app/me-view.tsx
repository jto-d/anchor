'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@urql/next'
import { graphql } from '@/gql'
import { Sidebar, Topbar } from './components/Shell'
import { Dashboard } from './components/Dashboard'
import { CardDetail } from './components/CardDetail'
import { LogCreditDialog } from './components/LogCreditDialog'
import { Icon } from './components/Icons'
import type { Card, Perk } from './helpers'

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

const LogPerkCreditDocument = graphql(`
  mutation LogPerkCredit($perkId: String!, $amount: Float!, $date: String!, $description: String) {
    logPerkCredit(perkId: $perkId, amount: $amount, date: $date, description: $description) {
      id
      amount
      date
      description
    }
  }
`)

type Route = 'dashboard' | 'card'

export function MeView() {
  const [route, setRoute] = useState<Route>('dashboard')
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
  const [dialogPerk, setDialogPerk] = useState<Perk | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const [{ data, fetching, error }, reexecuteQuery] = useQuery({ query: MeDocument })
  const [, logPerkCredit] = useMutation(LogPerkCreditDocument)

  const cards: Card[] = (data?.me.creditCards ?? []) as Card[]
  const selectedCard = cards.find((c) => c.id === selectedCardId) ?? null

  const livePerk: Perk | null = dialogPerk
    ? (cards.flatMap((c) => c.perks).find((p) => p.id === dialogPerk.id) ?? dialogPerk) as Perk
    : null

  function openCard(card: Card) {
    setSelectedCardId(card.id)
    setRoute('card')
  }

  function back() {
    setRoute('dashboard')
    setSelectedCardId(null)
  }

  async function handleSaveCredit(perkId: string, amount: number, date: string, description: string) {
    await logPerkCredit({ perkId, amount, date, description: description || undefined })
    reexecuteQuery({ requestPolicy: 'network-only' })
    setDialogPerk(null)
    const perkName = livePerk?.name ?? 'perk'
    setToast(`Logged $${amount.toFixed(2)} to ${perkName}`)
    setTimeout(() => setToast(null), 2600)
  }

  if (fetching) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'var(--font-sans)', color: 'var(--fg3)' }}>
        Loading…
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'var(--font-sans)', color: 'var(--neg)' }}>
        {error.message}
      </div>
    )
  }

  if (!data) return null

  const userEmail = data.me.email

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg-subtle)', color: 'var(--fg1)', fontFamily: 'var(--font-sans)' }}>
      <Sidebar
        route={route === 'card' ? 'cards' : route}
        userEmail={userEmail}
        onNavigate={() => { setRoute('dashboard'); setSelectedCardId(null) }}
      />

      <main style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
        {route === 'card' && selectedCard ? (
          <>
            <Topbar
              title={selectedCard.name}
              subtitle={`${selectedCard.issuer}${selectedCard.lastFour ? ' · •••• ' + selectedCard.lastFour : ''}`}
              onAddCard={() => {}}
            />
            <CardDetail card={selectedCard} onBack={back} onLog={setDialogPerk} onAddPerk={() => {}} />
          </>
        ) : (
          <>
            <Topbar
              title="Dashboard"
              subtitle="Track every perk before it expires."
              onAddCard={() => {}}
            />
            <Dashboard cards={cards} onOpenCard={openCard} onLog={setDialogPerk} />
          </>
        )}
      </main>

      <LogCreditDialog perk={livePerk} onClose={() => setDialogPerk(null)} onSave={handleSaveCredit} />

      {toast && (
        <div style={{
          position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
          background: 'var(--zinc-900)', color: '#fff', padding: '11px 18px', borderRadius: '999px',
          fontSize: '13px', fontWeight: 500, boxShadow: 'var(--shadow-lg)', zIndex: 60,
          display: 'flex', alignItems: 'center', gap: '9px',
          animation: 'anchorPop 200ms var(--ease)',
        }}>
          <Icon name="checkCircle" size={15} stroke={2} style={{ color: 'var(--anchor-300)' }} />
          {toast}
        </div>
      )}
    </div>
  )
}
