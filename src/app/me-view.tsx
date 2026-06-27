'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@urql/next'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'
import { Row, Segmented, Stack, Toast } from '@/components/ui'
import { PerksDashboard } from '@/components/perks/PerksDashboard'
import { CardDetail } from '@/components/perks/CardDetail'
import { LogCreditDialog } from '@/components/perks/LogCreditDialog'
import { CardsView } from '@/components/cards/CardsView'
import { AddCardDialog } from '@/components/cards/AddCardDialog'
import { RemoveCardDialog } from '@/components/cards/RemoveCardDialog'
import { BudgetView, YearView } from '@/components/budgeting'
import { SubscriptionsView } from '@/components/subscriptions'
import { AccountsView } from '@/components/accounts/AccountsView'
import { CARD_CATALOG } from '@/data/cardCatalog'
import type { SubCard } from '@/data/subscriptionData'
import type { Card, Perk } from '@/utils/types'
import {
  MeDocument,
  LogPerkCreditDocument,
  RemoveCardDocument,
  AddCardDocument,
} from './me-view.queries'

type Route = 'perks' | 'card' | 'cards' | 'budgeting' | 'subscriptions' | 'accounts'

export function MeView() {
  const [route, setRoute] = useState<Route>('perks')
  const [budgetView, setBudgetView] = useState<'monthly' | 'yearly'>('monthly')
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
  const [dialogPerk, setDialogPerk] = useState<Perk | null>(null)
  const [addCardOpen, setAddCardOpen] = useState(false)
  const [pendingRemoveId, setPendingRemoveId] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const [{ data, fetching, error }, reexecuteQuery] = useQuery({ query: MeDocument })
  const [, logPerkCredit] = useMutation(LogPerkCreditDocument)
  const [, removeCard] = useMutation(RemoveCardDocument)
  const [, addCard] = useMutation(AddCardDocument)

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
    setToast(`Logged $${amount.toFixed(2)} to ${perkName}`)
  }

  async function handleAddCard(catalogKey: string, lastFour: string, openedDate: string) {
    const result = await addCard({ catalogKey, lastFour: lastFour || undefined, openedDate: openedDate || undefined })
    reexecuteQuery({ requestPolicy: 'network-only' })
    setAddCardOpen(false)
    if (result.error) {
      setToast(result.error.message.replace(/^\[\w+\]\s*/, ''))
    } else {
      const name = CARD_CATALOG[catalogKey]?.name ?? 'Card'
      setToast(`${name} added to your wallet`)
    }
  }

  async function handleRemoveCard() {
    if (!pendingRemoveId) return
    const name = cards.find((c) => c.id === pendingRemoveId)?.name ?? 'Card'
    await removeCard({ cardId: pendingRemoveId })
    reexecuteQuery({ requestPolicy: 'network-only' })
    setPendingRemoveId(null)
    setToast(`${name} removed from your wallet`)
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
          <>
            <Topbar
              title="Cards"
              subtitle="Your wallet and where each card earns the most."
              onAddCard={() => setAddCardOpen(true)}
            />
            <CardsView
              cards={cards}
              onAddCard={() => setAddCardOpen(true)}
              onManageCard={(action, cardId) => {
                if (action === 'remove') setPendingRemoveId(cardId)
              }}
            />
          </>
        ) : route === 'subscriptions' ? (
          <SubscriptionsView cards={subCards} />
        ) : route === 'accounts' ? (
          <AccountsView />
        ) : route === 'budgeting' ? (
          <>
            <Topbar
              title="Budgeting"
              subtitle="Plan the month, log what you spend, send the surplus to a goal."
              rightSlot={
                <Segmented
                  size="sm"
                  value={budgetView}
                  onChange={(v) => setBudgetView(v as 'monthly' | 'yearly')}
                  options={[{ value: 'monthly', label: 'Monthly' }, { value: 'yearly', label: 'Yearly' }]}
                />
              }
            />
            {budgetView === 'monthly' ? (
              <BudgetView userEmail={userEmail} />
            ) : (
              <YearView />
            )}
          </>
        ) : (
          <>
            <Topbar title="Dashboard" subtitle="Track every perk before it expires." />
            <PerksDashboard cards={cards} onOpenCard={openCard} onLog={setDialogPerk} />
          </>
        )}
      </Stack>

      <LogCreditDialog perk={livePerk} onClose={() => setDialogPerk(null)} onSave={handleSaveCredit} />

      <AddCardDialog
        open={addCardOpen}
        existingDesigns={cards.map((c) => c.design).filter((d): d is string => !!d)}
        onClose={() => setAddCardOpen(false)}
        onAdd={handleAddCard}
      />

      <RemoveCardDialog
        cardName={pendingRemoveId ? (cards.find((c) => c.id === pendingRemoveId)?.name ?? 'this card') : null}
        onClose={() => setPendingRemoveId(null)}
        onConfirm={handleRemoveCard}
      />

      <Toast message={toast} onClose={() => setToast(null)} />
    </Row>
  )
}
