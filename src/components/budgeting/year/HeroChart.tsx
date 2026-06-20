'use client'

import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { brand } from '@/lib/theme'
import { CatGlyph, Dot, Row, Segmented, SurfaceCard } from '@/components/ui'
import type { YearMonth } from '@/hooks/useBudgetYear'
import { CashflowBars } from './CashflowBars'
import { CumulativeArea } from './CumulativeArea'

export function HeroChart({ months, currentIdx }: { months: YearMonth[]; currentIdx: number }) {
  const [mode, setMode] = useState<'bars' | 'cumulative'>('bars')
  const bars = mode === 'bars'

  const legend = bars
    ? [
        [brand.anchor[200], 'Income'],
        [brand.anchor[600], 'Spent'],
        [brand.gold[500], 'Saved'],
      ]
    : [
        [brand.anchor[600], 'Saved + surplus'],
        [brand.gold[500], 'Into accounts'],
      ]

  return (
    <SurfaceCard sx={{ overflow: 'visible' }}>
      <Row align="start" justify="between" gap={2} sx={{ px: 2.75, pt: 2.25, pb: '6px' }}>
        <Row gap={1.5}>
          <CatGlyph icon={bars ? 'trendingUp' : 'piggyBank'} tone="accent" size={34} />
          <Box>
            <Typography variant="cardTitle">
              {bars ? 'Income vs. spending' : 'Money kept, building up'}
            </Typography>
            <Typography variant="label" color="text.secondary" sx={{ mt: '2px' }}>
              {bars ? 'Each month, side by side — striped months are estimates' : 'Cumulative savings + surplus across the year'}
            </Typography>
          </Box>
        </Row>

        <Row gap={2} wrap justify="end" sx={{ flexShrink: 0 }}>
          {legend.map(([c, l]) => (
            <Row key={l} inline gap="7px">
              <Dot size={10} square color={c} />
              <Typography variant="label" color="text.secondary">{l}</Typography>
            </Row>
          ))}
          <Box sx={{ ml: 1 }}>
            <Segmented
              size="sm"
              value={mode}
              onChange={(v) => setMode(v as 'bars' | 'cumulative')}
              options={[{ value: 'bars', label: 'Bars' }, { value: 'cumulative', label: 'Cumulative' }]}
            />
          </Box>
        </Row>
      </Row>

      <Box sx={{ px: 2.25, pb: 2.25 }}>
        {bars
          ? <CashflowBars months={months} />
          : <CumulativeArea months={months} currentIdx={currentIdx} />}
      </Box>
    </SurfaceCard>
  )
}
