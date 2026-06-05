'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@urql/next'
import { graphql } from '@/gql'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Snackbar from '@mui/material/Snackbar'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { Sidebar } from '@/components/ui/Sidebar'
import { Topbar } from '@/components/ui/Topbar'
import { PerksDashboard } from '@/components/PerksDashboard'
import { CardDetail } from '@/components/CardDetail'
import { LogCreditDialog } from '@/components/LogCreditDialog'
import { CardsView } from '@/components/cards/CardsView'
import { AddCardDialog } from '@/components/cards/AddCardDialog'
import { brand } from '@/lib/theme'
import { CARD_CATALOG } from '@/data/cardCatalog'
import type { Card, Perk } from '@/utils/types'

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
        design
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

const AddCardDocument = graphql(`
  mutation AddCard($catalogKey: String!, $lastFour: String) {
    addCard(catalogKey: $catalogKey, lastFour: $lastFour) {
      id
      name
      issuer
      lastFour
      design
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
`)

type Route = 'perks' | 'card' | 'cards'

export function MeView() {
  const [route, setRoute] = useState<Route>('perks')
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
  const [dialogPerk, setDialogPerk] = useState<Perk | null>(null)
  const [addCardOpen, setAddCardOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const [{ data, fetching, error }, reexecuteQuery] = useQuery({ query: MeDocument })
  const [, logPerkCredit] = useMutation(LogPerkCreditDocument)
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

  async function handleAddCard(catalogKey: string, lastFour: string) {
    const result = await addCard({ catalogKey, lastFour: lastFour || undefined })
    reexecuteQuery({ requestPolicy: 'network-only' })
    setAddCardOpen(false)
    if (result.error) {
      setToast(result.error.message.replace(/^\[\w+\]\s*/, ''))
    } else {
      const name = CARD_CATALOG[catalogKey]?.name ?? 'Card'
      setToast(`${name} added to your wallet`)
    }
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
        route={route === 'card' || route === 'cards' ? 'cards' : route}
        userEmail={userEmail}
        onNavigate={(key) => {
          if (key === 'cards') setRoute('cards')
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
            <CardDetail card={selectedCard} onBack={back} onLog={setDialogPerk} onAddPerk={() => {}} />
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
              onManageCard={(action, cardId) =>
                setToast(`${action === 'remove' ? 'Remove' : 'Edit'} — not wired yet (card ${cardId.slice(-4)}).`)
              }
            />
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

      <Snackbar
        open={!!toast}
        autoHideDuration={2600}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.1,
            bgcolor: 'grey.900',
            color: '#fff',
            px: '18px',
            py: '11px',
            borderRadius: 999,
            fontSize: 13,
            fontWeight: 500,
            boxShadow: brand.shadow.lg,
          }}
        >
          <CheckCircleIcon sx={{ fontSize: 15, color: brand.anchor[300] }} />
          {toast}
        </Box>
      </Snackbar>
    </Box>
  )
}
