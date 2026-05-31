'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@urql/next'
import { graphql } from '@/gql'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Snackbar from '@mui/material/Snackbar'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { Sidebar, Topbar } from '@/components/Shell'
import { PerksDashboard } from '@/components/PerksDashboard'
import { CardDetail } from '@/components/CardDetail'
import { LogCreditDialog } from '@/components/LogCreditDialog'
import { brand } from '@/lib/theme'
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
    ? ((cards.flatMap((c) => c.perks).find((p) => p.id === dialogPerk.id) ?? dialogPerk) as Perk)
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
    const perkName = livePerk?.name ?? 'perk'
    await logPerkCredit({ perkId, amount, date, description: description || undefined })
    reexecuteQuery({ requestPolicy: 'network-only' })
    setDialogPerk(null)
    setToast(`Logged $${amount.toFixed(2)} to ${perkName}`)
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
        onNavigate={() => {
          setRoute('dashboard')
          setSelectedCardId(null)
        }}
      />

      <Box component="main" sx={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
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
            <Topbar title="Dashboard" subtitle="Track every perk before it expires." onAddCard={() => {}} />
            <PerksDashboard cards={cards} onOpenCard={openCard} onLog={setDialogPerk} />
          </>
        )}
      </Box>

      <LogCreditDialog perk={livePerk} onClose={() => setDialogPerk(null)} onSave={handleSaveCredit} />

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
