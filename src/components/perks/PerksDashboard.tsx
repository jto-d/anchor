'use client'

import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { Eyebrow } from '../ui/Eyebrow'
import { ProgressBar } from '../ui/ProgressBar'
import { CardTile } from './CardTile'
import { PerkRow } from './PerkRow'
import { SummaryFigures, CardValueSection } from './CardValue'
import { brand } from '@/lib/theme'
import { tabularNums } from '@/lib/sx'
import { cardOnTheTable } from '@/utils/card'
import { capturedYTD, perkStatus } from '@/utils/perk'
import { fmtDollars } from '@/utils/format'
import type { Card, Perk } from '@/utils/types'

interface PerksDashboardProps {
  cards: Card[]
  onOpenCard: (card: Card) => void
  onLog: (perk: Perk) => void
}

export function PerksDashboard({ cards, onOpenCard, onLog }: PerksDashboardProps) {
  const captured = cards.reduce((s, c) => c.perks.reduce((ps, p) => ps + capturedYTD(p), s), 0)
  const onTheTable = cards.reduce((s, c) => s + cardOnTheTable(c), 0)
  const pct = (captured + onTheTable) ? captured / (captured + onTheTable) : 0

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

  return (
    <Box sx={{ p: '26px 30px' }}>
      {/* Headline */}
      <Paper sx={{ bgcolor: brand.accentSoft, border: 1, borderColor: brand.anchor[100], borderRadius: '18px', p: '22px 24px', mb: '22px' }}>
        <Eyebrow sx={{ color: 'primary.main' }}>This year</Eyebrow>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, mt: 1.25, flexWrap: 'wrap' }}>
          <Typography
            sx={{ ...tabularNums, fontSize: 42, fontWeight: 600, letterSpacing: '-0.03em', color: brand.anchor[800], lineHeight: 1 }}
          >
            {fmtDollars(captured)}
          </Typography>
          <Typography sx={{ fontSize: 16, color: 'primary.main', fontWeight: 500 }}>
            recovered · {fmtDollars(onTheTable)} still available
          </Typography>
        </Box>
        <Box sx={{ mt: 2, maxWidth: 500 }}>
          <ProgressBar value={pct} track="rgba(11,99,96,0.15)" sx={{ height: 7 }} />
          <Typography sx={{ fontSize: 12, color: 'primary.main', mt: '7px', fontWeight: 500 }}>
            {Math.round(pct * 100)}% of active cycles captured
          </Typography>
        </Box>
        <Box sx={{ mt: '22px', pt: '20px', borderTop: '1px solid rgba(11,99,96,0.18)', maxWidth: 560 }}>
          <SummaryFigures cards={cards} tone="headline" />
        </Box>
      </Paper>

      {/* Card value */}
      <CardValueSection cards={cards} onOpenCard={onOpenCard} />

      {/* Card tiles */}
      <Eyebrow sx={{ mb: 1.5 }}>Your cards</Eyebrow>
      <Box sx={{ display: 'flex', gap: 1.75, flexWrap: 'wrap', mb: 4 }}>
        {cards.map((c) => (
          <CardTile key={c.id} card={c} onOpen={onOpenCard} />
        ))}
      </Box>

      {/* Needs attention */}
      <Eyebrow sx={{ mb: '4px' }}>Needs attention</Eyebrow>
      <Typography sx={{ mb: 1, fontSize: 13, color: 'grey.500' }}>
        Perks with value still available this period.
      </Typography>
      <Paper variant="outlined" sx={{ borderColor: 'divider', borderRadius: '14px', px: 2, py: '4px' }}>
        {atRisk.length === 0 ? (
          <Typography sx={{ py: '18px', px: '4px', fontSize: 14, color: 'grey.500' }}>
            All caught up. Nothing on the table.
          </Typography>
        ) : (
          atRisk.slice(0, 6).map(({ card, perk }) => <PerkRow key={perk.id} perk={perk} card={card} cardOpenedDate={card.openedDate} onLog={onLog} />)
        )}
      </Paper>

      {/* Used perks */}
      {used.length > 0 && (
        <>
          <Eyebrow sx={{ mt: '28px', mb: '4px' }}>Used perks</Eyebrow>
          <Typography sx={{ mb: 1, fontSize: 13, color: 'grey.500' }}>
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
