'use client'

import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useMutation } from '@urql/next'
import { Topbar } from '@/components/layout/Topbar'
import { Eyebrow, Row, Segmented, useToast } from '@/components/ui'
import { CardListRow } from './RewardCard'
import { SuggestPicker } from './SuggestPicker'
import { SuggestMatrix } from './SuggestMatrix'
import { AddCardDialog } from './AddCardDialog'
import { RemoveCardDialog } from './RemoveCardDialog'
import { dbCardToRewardCard } from '@/utils/cardRewards'
import { brand } from '@/lib/theme'
import { tabularNums } from '@/lib/sx'
import { CARD_CATALOG } from '@/data/cardCatalog'
import { AddCardDocument, RemoveCardDocument } from '@/app/me-view.queries'
import type { SuggestMode } from '@/utils/cardRewards'
import type { Card } from '@/utils/types'

interface SectionHeadProps {
  eyebrow: string
  title: string
  sub?: string | null
  right?: React.ReactNode
}

function SectionHead({ eyebrow, title, sub, right }: SectionHeadProps) {
  return (
    <Row align="end" justify="between" gap="16px" wrap sx={{ mb: '18px' }}>
      <Box>
        <Eyebrow sx={{ mb: '8px' }}>{eyebrow}</Eyebrow>
        <Typography
          sx={{ fontSize: '22px', fontWeight: 600, letterSpacing: '-0.018em', color: 'text.primary' }}
        >
          {title}
        </Typography>
        {sub && (
          <Typography variant="body" sx={{ color: 'text.disabled', maxWidth: '46ch', mt: '6px' }}>
            {sub}
          </Typography>
        )}
      </Box>
      {right}
    </Row>
  )
}

interface CardsViewProps {
  cards: Card[]
  onRefetch: () => void
}

export function CardsView({ cards: dbCards, onRefetch }: CardsViewProps) {
  const cards = dbCards.map(dbCardToRewardCard)
  const [suggestMode, setSuggestMode] = useState<SuggestMode>('picker')
  const [addCardOpen, setAddCardOpen] = useState(false)
  const [pendingRemoveId, setPendingRemoveId] = useState<string | null>(null)

  const [, addCard] = useMutation(AddCardDocument)
  const [, removeCard] = useMutation(RemoveCardDocument)
  const notify = useToast()

  const cashbackCount = cards.filter((c) => c.type === 'cashback').length
  const pointsCount   = cards.filter((c) => c.type === 'points').length

  function handleCardAction(action: string, cardId: string) {
    if (action === 'remove') setPendingRemoveId(cardId)
  }

  async function handleAddCard(catalogKey: string, lastFour: string, openedDate: string) {
    const result = await addCard({ catalogKey, lastFour: lastFour || undefined, openedDate: openedDate || undefined })
    onRefetch()
    setAddCardOpen(false)
    if (result.error) {
      notify(result.error.message.replace(/^\[\w+\]\s*/, ''))
    } else {
      notify(`${CARD_CATALOG[catalogKey]?.name ?? 'Card'} added to your wallet`)
    }
  }

  async function handleRemoveCard() {
    if (!pendingRemoveId) return
    const name = dbCards.find((c) => c.id === pendingRemoveId)?.name ?? 'Card'
    await removeCard({ cardId: pendingRemoveId })
    onRefetch()
    setPendingRemoveId(null)
    notify(`${name} removed from your wallet`)
  }

  return (
    <>
      <Topbar
        title="Cards"
        subtitle="Your wallet and where each card earns the most."
        onAddCard={() => setAddCardOpen(true)}
      />

      <Box sx={{ p: '30px 32px 64px', maxWidth: '1120px', margin: '0 auto' }}>

        {/* === SUGGESTION ENGINE === */}
        <Box component="section" sx={{ mb: '44px' }}>
          <SectionHead
            eyebrow="Best card by category"
            title="Which card should you reach for?"
            sub="Pick a spending category to see the card that earns the most. A reference, not a tracker."
            right={
              <Segmented
                value={suggestMode}
                onChange={(v) => setSuggestMode(v as SuggestMode)}
                options={[
                  { value: 'picker', label: 'Spotlight', icon: 'trophy' },
                  { value: 'matrix', label: 'Grid',      icon: 'grid' },
                ]}
              />
            }
          />
          {suggestMode === 'matrix'
            ? <SuggestMatrix cards={cards} />
            : <SuggestPicker cards={cards} />}
        </Box>

        {/* === INVENTORY === */}
        <Box component="section">
          <SectionHead
            eyebrow="Your cards"
            title="Wallet"
            right={
              <Typography variant="label" sx={{ ...tabularNums, color: 'text.disabled' }}>
                {cards.length} cards · {pointsCount} points · {cashbackCount} cash back
              </Typography>
            }
          />

          <Box
            sx={{
              background: '#fff',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: '14px',
              overflow: 'hidden',
              boxShadow: brand.shadow.sm,
            }}
          >
            {cards.map((card, i) => (
              <Box
                key={card.id}
                sx={{ borderTop: i ? '1px solid' : 'none', borderColor: 'divider' }}
              >
                <CardListRow
                  card={card}
                  density="compact"
                  onAction={(k) => handleCardAction(k, card.id)}
                />
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      <AddCardDialog
        open={addCardOpen}
        existingDesigns={dbCards.map((c) => c.design).filter((d): d is string => !!d)}
        onClose={() => setAddCardOpen(false)}
        onAdd={handleAddCard}
      />

      <RemoveCardDialog
        cardName={pendingRemoveId ? (dbCards.find((c) => c.id === pendingRemoveId)?.name ?? 'this card') : null}
        onClose={() => setPendingRemoveId(null)}
        onConfirm={handleRemoveCard}
      />
    </>
  )
}
