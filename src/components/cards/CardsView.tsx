'use client'

import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Segmented } from '@/components/ui/Segmented'
import { CardListRow } from './RewardCard'
import { SuggestPicker } from './SuggestPicker'
import { SuggestMatrix } from './SuggestMatrix'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { dbCardToRewardCard } from '@/utils/cardRewards'
import { brand } from '@/lib/theme'
import { tabularNums } from '@/lib/sx'
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
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: '16px',
        flexWrap: 'wrap',
        mb: '18px',
      }}
    >
      <Box>
        <Eyebrow sx={{ mb: '8px' }}>{eyebrow}</Eyebrow>
        <Typography
          sx={{ fontSize: '22px', fontWeight: 600, letterSpacing: '-0.018em', color: 'text.primary' }}
        >
          {title}
        </Typography>
        {sub && (
          <Typography sx={{ fontSize: '13.5px', color: 'text.disabled', maxWidth: '46ch', mt: '6px' }}>
            {sub}
          </Typography>
        )}
      </Box>
      {right}
    </Box>
  )
}

interface CardsViewProps {
  cards: Card[]
  onAddCard: () => void
  onManageCard?: (action: string, cardId: string) => void
}

export function CardsView({ cards: dbCards, onAddCard, onManageCard }: CardsViewProps) {
  const cards = dbCards.map(dbCardToRewardCard)
  const [suggestMode, setSuggestMode] = useState<SuggestMode>('picker')

  const cashbackCount = cards.filter((c) => c.type === 'cashback').length
  const pointsCount   = cards.filter((c) => c.type === 'points').length

  function handleCardAction(action: string, cardId: string) {
    onManageCard?.(action, cardId)
  }

  return (
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
            <Typography sx={{ ...tabularNums, fontSize: '12.5px', color: 'text.disabled' }}>
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
  )
}
