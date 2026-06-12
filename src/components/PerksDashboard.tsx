'use client'

import { useState } from 'react'
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Typography from '@mui/material/Typography'
import { Eyebrow } from './ui/Eyebrow'
import { CardTile } from './CardTile'
import { PerkRow } from './PerkRow'
import { brand } from '@/lib/theme'
import { cardOnTheTable } from '@/utils/card'
import { capturedYTD, capturedThisMonth, perkStatus } from '@/utils/perk'
import { fmtDollars } from '@/utils/format'
import type { Card, Perk } from '@/utils/types'

interface PerksDashboardProps {
  cards: Card[]
  onOpenCard: (card: Card) => void
  onLog: (perk: Perk) => void
}

export function PerksDashboard({ cards, onOpenCard, onLog }: PerksDashboardProps) {
  const [view, setView] = useState<'ytd' | 'month'>('ytd')

  const captured =
    view === 'ytd'
      ? cards.reduce((s, c) => c.perks.reduce((ps, p) => ps + capturedYTD(p), s), 0)
      : cards.reduce((s, c) => c.perks.reduce((ps, p) => ps + capturedThisMonth(p), s), 0)
  const onTheTable = cards.reduce((s, c) => s + cardOnTheTable(c), 0)
  const pct = (captured + onTheTable) ? captured / (captured + onTheTable) : 0

  const atRisk: { card: Card; perk: Perk }[] = []
  const used: { card: Card; perk: Perk }[] = []
  cards.forEach((c) =>
    c.perks.forEach((p) => {
      const st = perkStatus(p, c.openedDate)
      if (st.key === 'open' || st.key === 'expiring' || st.key === 'partial') atRisk.push({ card: c, perk: p })
      else if (st.key === 'captured') used.push({ card: c, perk: p })
    })
  )

  return (
    <Box sx={{ p: '26px 30px' }}>
      {/* Headline */}
      <Paper sx={{ bgcolor: brand.accentSoft, border: 1, borderColor: brand.anchor[100], borderRadius: '18px', p: '22px 24px', mb: '22px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Eyebrow sx={{ color: 'primary.main' }}>{view === 'ytd' ? 'This year' : 'This month'}</Eyebrow>
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={(_, v) => v && setView(v)}
            size="small"
            sx={{ '& .MuiToggleButton-root': { px: 1.5, py: 0.25, fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', border: 1, borderColor: brand.anchor[200], color: 'primary.main' }, '& .Mui-selected': { bgcolor: 'primary.main', color: '#fff', '&:hover': { bgcolor: 'primary.dark' } } }}
          >
            <ToggleButton value="ytd">YTD</ToggleButton>
            <ToggleButton value="month">Month</ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, mt: 1.25, flexWrap: 'wrap' }}>
          <Typography
            sx={{ fontSize: 42, fontWeight: 600, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums', color: brand.anchor[800], lineHeight: 1 }}
          >
            {fmtDollars(captured)}
          </Typography>
          <Typography sx={{ fontSize: 16, color: 'primary.main', fontWeight: 500 }}>
            recovered · {fmtDollars(onTheTable)} still available
          </Typography>
        </Box>
        <Box sx={{ mt: 2, maxWidth: 500 }}>
          <LinearProgress
            variant="determinate"
            value={Math.min(1, pct) * 100}
            sx={{ height: 7, bgcolor: 'rgba(11,99,96,0.15)', '& .MuiLinearProgress-bar': { bgcolor: 'primary.main' } }}
          />
          <Typography sx={{ fontSize: 12, color: 'primary.main', mt: '7px', fontWeight: 500 }}>
            {Math.round(pct * 100)}% of active cycles captured
          </Typography>
        </Box>
      </Paper>

      {/* Stats */}
      <Stack direction="row" spacing={1.75} sx={{ mb: '28px' }}>
        <StatCard label="Cards tracked" value={String(cards.length)} sub="Across all issuers" />
        <StatCard label="Recovered" value={fmtDollars(captured)} sub={`Credits captured ${view === 'ytd' ? 'this year' : 'this month'}`} accent="primary.main" />
        <StatCard
          label="On the table"
          value={fmtDollars(onTheTable)}
          sub={`${atRisk.length} perks need attention`}
          accent="warning.main"
        />
      </Stack>

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
    </Box>
  )
}

function StatCard({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: string }) {
  return (
    <Paper variant="outlined" sx={{ borderColor: 'divider', borderRadius: '14px', p: '16px 18px', flex: 1 }}>
      <Eyebrow>{label}</Eyebrow>
      <Typography
        sx={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.025em', fontVariantNumeric: 'tabular-nums', mt: 1.25, color: accent ?? 'text.primary', lineHeight: 1 }}
      >
        {value}
      </Typography>
      {sub && <Typography sx={{ fontSize: 12, color: 'grey.500', mt: '5px' }}>{sub}</Typography>}
    </Paper>
  )
}
