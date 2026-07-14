'use client'

import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { Eyebrow, Row } from '@/components/ui'
import { PerkRow } from './PerkRow'
import { ThisYearBanner } from './ThisYearBanner'
import { WalletSection } from './WalletCard'
import { perkStatus } from '@/utils/perk'
import type { Card, Perk } from '@/utils/types'

const AT_RISK_INITIAL = 10

interface PerksDashboardProps {
  cards: Card[]
  onOpenCard: (card: Card) => void
  onLog: (perk: Perk) => void
}

export function PerksDashboard({ cards, onOpenCard, onLog }: PerksDashboardProps) {
  const [atRiskExpanded, setAtRiskExpanded] = useState(false)

  const atRisk: { card: Card; perk: Perk }[] = []
  const used: { card: Card; perk: Perk }[] = []
  const ongoing: { card: Card; perk: Perk }[] = []
  cards.forEach((c) =>
    c.perks.forEach((p) => {
      const st = perkStatus(p, c.openedDate)
      if (st.key === 'ongoing') ongoing.push({ card: c, perk: p })
      else if (st.key === 'open' || st.key === 'expiring' || st.key === 'partial') atRisk.push({ card: c, perk: p })
      else if (st.key === 'captured') used.push({ card: c, perk: p })
    })
  )

  const atRiskOverflow = atRisk.length > AT_RISK_INITIAL
  const visibleAtRisk = atRiskExpanded ? atRisk : atRisk.slice(0, AT_RISK_INITIAL)

  return (
    <Box sx={{ p: '26px 30px' }}>
      {/* Headline */}
      <ThisYearBanner cards={cards} />

      {/* Your cards */}
      <WalletSection cards={cards} onOpenCard={onOpenCard} />

      {/* Needs attention */}
      <Eyebrow sx={{ mb: '4px' }}>Needs attention</Eyebrow>
      <Typography variant="body" sx={{ mb: 1, color: 'grey.500' }}>
        Perks with value still available this period.
      </Typography>
      <Paper variant="outlined" sx={{ borderColor: 'divider', borderRadius: '14px', px: 2, py: '4px' }}>
        {atRisk.length === 0 ? (
          <Typography variant="bodyStrong" sx={{ py: '18px', px: '4px', fontWeight: 500, color: 'grey.500' }}>
            All caught up. Nothing on the table.
          </Typography>
        ) : (
          <>
            {visibleAtRisk.map(({ card, perk }) => (
              <PerkRow key={perk.id} perk={perk} card={card} cardOpenedDate={card.openedDate} onLog={onLog} />
            ))}
            {atRiskOverflow && (
              <Row sx={{ py: 1, px: '4px' }}>
                <Button
                  size="small"
                  onClick={() => setAtRiskExpanded((v) => !v)}
                  sx={{
                    textTransform: 'none',
                    fontSize: 12,
                    fontWeight: 500,
                    color: 'text.disabled',
                    px: 1,
                    py: 0.5,
                    borderRadius: '7px',
                    '&:hover': { color: 'text.secondary', bgcolor: 'grey.100' },
                  }}
                >
                  {atRiskExpanded ? 'Show less' : `Show ${atRisk.length - AT_RISK_INITIAL} more`}
                </Button>
              </Row>
            )}
          </>
        )}
      </Paper>

      {/* Used perks */}
      {used.length > 0 && (
        <>
          <Eyebrow sx={{ mt: '28px', mb: '4px' }}>Used perks</Eyebrow>
          <Typography variant="body" sx={{ mb: 1, color: 'grey.500' }}>
            Fully captured this period.
          </Typography>
          <Paper variant="outlined" sx={{ borderColor: 'divider', borderRadius: '14px', px: 2, py: '4px' }}>
            {used.map(({ card, perk }) => <PerkRow key={perk.id} perk={perk} card={card} cardOpenedDate={card.openedDate} onLog={onLog} />)}
          </Paper>
        </>
      )}

      {/* Lounge & travel */}
      {ongoing.length > 0 && (
        <>
          <Eyebrow sx={{ mt: '28px', mb: '4px' }}>Lounge &amp; travel</Eyebrow>
          <Typography sx={{ mb: 1, fontSize: 13, color: 'grey.500' }}>
            Open-ended benefits. Log visits to track value.
          </Typography>
          <Paper variant="outlined" sx={{ borderColor: 'divider', borderRadius: '14px', px: 2, py: '4px' }}>
            {ongoing.map(({ card, perk }) => <PerkRow key={perk.id} perk={perk} card={card} cardOpenedDate={card.openedDate} onLog={onLog} />)}
          </Paper>
        </>
      )}
    </Box>
  )
}
