'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@urql/next'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'
import { Row, Stack, useToast } from '@/components/ui'
import { PerksDashboard } from '@/components/perks/PerksDashboard'
import { CardDetail } from '@/components/perks/CardDetail'
import { LogCreditDialog } from '@/components/perks/LogCreditDialog'
import { CardsView } from '@/components/cards/CardsView'
import { BudgetingView } from '@/components/budgeting'
import { SubscriptionsView } from '@/components/subscriptions'
import { AccountsView } from '@/components/accounts/AccountsView'
import { SplitView } from '@/components/split/SplitView'
import type { SubCard } from '@/data/subscriptionData'
import type { Card, Perk } from '@/utils/types'
import { MeDocument, LogPerkCreditDocument } from './me-view.queries'

type Route = 'perks' | 'card' | 'cards' | 'budgeting' | 'subscriptions' | 'accounts' | 'split'

export function MeView() {
  const [route, setRoute] = useState<Route>('perks')
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
  const [dialogPerk, setDialogPerk] = useState<Perk | null>(null)
  const notify = useToast()

  const [{ data, fetching, error }, reexecuteQuery] = useQuery({ query: MeDocument })
  const [, logPerkCredit] = useMutation(LogPerkCreditDocument)

  const cards: Card[] = (data?.me.creditCards ?? []) as Card[]
  const selectedCard = cards.find((c) => c.id === selectedCardId) ?? null

  const subCards: SubCard[] = cards.map((c) => ({
    id: c.id,
    name: c.name,
    issuer: c.issuer,
    short: c.issuer.toLowerCase().includes('american express')
      ? 'Amex'
      : c.issuer.toLowerCase().includes('bank of america')
      ? 'BofA'
      : c.issuer.split(' ')[0],
    lastFour: c.lastFour ?? '',
  }))

  const livePerk: Perk | null = dialogPerk
    ? ((cards.flatMap((c) => c.perks).find((p) => p.id === dialogPerk.id) ?? dialogPerk) as Perk)
    : null

  function openCard(card: Card) {
    setSelectedCardId(card.id)
    setRoute('card')
  }

  function back() {
    setRoute('perks')
    setSelectedCardId(null)
  }

  async function handleSaveCredit(perkId: string, amount: number, date: string, description: string) {
    const perkName = livePerk?.name ?? 'perk'
    await logPerkCredit({ perkId, amount, date, description: description || undefined })
    reexecuteQuery({ requestPolicy: 'network-only' })
    setDialogPerk(null)
    notify(`Logged $${amount.toFixed(2)} to ${perkName}`)
  }

  if (fetching) {
    return (
      <Row justify="center" sx={{ height: '100vh' }}>
        <CircularProgress />
      </Row>
    )
  }

  if (error) {
    return (
      <Row justify="center" sx={{ height: '100vh', p: 3 }}>
        <Alert severity="error" variant="outlined">
          {error.message}
        </Alert>
      </Row>
    )
  }

  if (!data) return null

  const userEmail = data.me.email

  return (
    <Row align="stretch" sx={{ height: '100vh', bgcolor: 'background.default', color: 'text.primary' }}>
      <Sidebar
        route={route === 'card' ? 'cards' : route}
        userEmail={userEmail}
        onNavigate={(key) => {
          if (key === 'cards') setRoute('cards')
          else if (key === 'budgeting') setRoute('budgeting')
          else if (key === 'subscriptions') setRoute('subscriptions')
          else if (key === 'accounts') setRoute('accounts')
          else if (key === 'split') setRoute('split')
          else setRoute('perks')
          setSelectedCardId(null)
        }}
      />

      <Stack component="main" sx={{ flex: 1, overflow: 'auto' }}>
        {route === 'card' && selectedCard ? (
          <>
            <Topbar
              title={selectedCard.name}
              subtitle={`${selectedCard.issuer}${selectedCard.lastFour ? ' · •••• ' + selectedCard.lastFour : ''}`}
            />
            <CardDetail card={selectedCard} onBack={back} onLog={setDialogPerk} />
          </>
        ) : route === 'cards' ? (
          <CardsView
            cards={cards}
            onRefetch={() => reexecuteQuery({ requestPolicy: 'network-only' })}
          />
        ) : route === 'subscriptions' ? (
          <SubscriptionsView cards={subCards} />
        ) : route === 'accounts' ? (
          <AccountsView />
        ) : route === 'split' ? (
          <SplitView />
        ) : route === 'budgeting' ? (
          <BudgetingView userEmail={userEmail} />
        ) : (
          <>
            <Topbar title="Dashboard" subtitle="Track every perk before it expires." />
            <PerksDashboard cards={cards} onOpenCard={openCard} onLog={setDialogPerk} />
          </>
        )}
      </Stack>

      <LogCreditDialog perk={livePerk} onClose={() => setDialogPerk(null)} onSave={handleSaveCredit} />
    </Row>
  )
}
