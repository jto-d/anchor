'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@urql/next'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'
import { Toast } from '@/components/ui/Toast'
import { PerksDashboard } from '@/components/perks/PerksDashboard'
import { CardDetail } from '@/components/perks/CardDetail'
import { LogCreditDialog } from '@/components/perks/LogCreditDialog'
import { CardsView } from '@/components/cards/CardsView'
import { AddCardDialog } from '@/components/cards/AddCardDialog'
import { RemoveCardDialog } from '@/components/cards/RemoveCardDialog'
import { BudgetView } from '@/components/budgeting/BudgetView'
import { BudgetMonthStepper } from '@/components/budgeting/BudgetMonthStepper'
import { stepMonth } from '@/components/budgeting/format'
import { brand } from '@/lib/theme'
import { CARD_CATALOG } from '@/data/cardCatalog'
import type { Card, Perk } from '@/utils/types'
import {
  MeDocument,
  LogPerkCreditDocument,
  RemoveCardDocument,
  AddCardDocument,
} from './me-view.queries'

type Route = 'perks' | 'card' | 'cards' | 'budgeting'

export function MeView() {
  const [route, setRoute] = useState<Route>('perks')
  const [budgetSel, setBudgetSel] = useState(() => {
    const now = new Date()
    return { y: now.getFullYear(), m: now.getMonth() }
  })
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
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', p: 3 }}>
        <Alert severity="error" variant="outlined">
          {error.message}
        </Alert>
      </Box>
    )
  }

  if (!data) return null

  const userEmail = data.me.email

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'background.default', color: 'text.primary' }}>
      <Sidebar
        route={route === 'card' ? 'cards' : route}
        userEmail={userEmail}
        onNavigate={(key) => {
          if (key === 'cards') setRoute('cards')
          else if (key === 'budgeting') setRoute('budgeting')
          else setRoute('perks')
          setSelectedCardId(null)
        }}
      />

      <Box component="main" sx={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
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
        ) : route === 'budgeting' ? (
          <>
            <Topbar
              title="Budgeting"
              subtitle="Plan the month, log what you spend, send the surplus to a goal."
              rightSlot={
                <BudgetMonthStepper
                  sel={budgetSel}
                  onStep={(dir) => {
                    const now = new Date()
                    setBudgetSel((prev) => {
                      const next = stepMonth(prev.y, prev.m, dir)
                      if (next.y > now.getFullYear() || (next.y === now.getFullYear() && next.m > now.getMonth())) return prev
                      return next
                    })
                  }}
                />
              }
            />
            <BudgetView userEmail={userEmail} />
          </>
        ) : (
          <>
            <Topbar title="Dashboard" subtitle="Track every perk before it expires." />
            <PerksDashboard cards={cards} onOpenCard={openCard} onLog={setDialogPerk} />
          </>
        )}
      </Box>

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
    </Box>
  )
}
