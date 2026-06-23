'use client'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { brand } from '@/lib/theme'
import { SurfaceCard, PanelHeader, ListRow, CatGlyph, ProgressBar, Row } from '@/components/ui'
import { fmtMoney } from '@/utils/format'
import type { ByCardRow } from '@/data/subscriptionData'

export function CardBreakdown({ byCard }: { byCard: ByCardRow[] }) {
  return (
    <SurfaceCard sx={{ overflow: 'hidden' }}>
      <PanelHeader
        icon="creditCard"
        tone="accent"
        title="Credits at work"
        subtitle="What each card carries — and covers"
      />
      <Box>
        {byCard.map((r, i) => {
          const ratio = r.gross > 0 ? r.covered / r.gross : 0
          return (
            <ListRow key={r.card.id} last={i === byCard.length - 1}>
              <Row gap={1.25} sx={{ mb: 1.125 }}>
                <CatGlyph icon="creditCard" size={26} tone={r.covered > 0 ? 'accent' : 'neutral'} />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography noWrap sx={{ fontSize: 13.5, fontWeight: 600, letterSpacing: '-0.005em' }}>
                    {r.card.name}
                  </Typography>
                  <Typography sx={{ fontSize: 11, color: 'grey.400', fontVariantNumeric: 'tabular-nums' }}>
                    {r.card.short} ••{r.card.lastFour} · {r.count} subscription{r.count === 1 ? '' : 's'}
                  </Typography>
                </Box>
                {r.covered > 0
                  ? <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: brand.anchor[600], fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>
                      −{fmtMoney(r.covered)}/mo
                    </Typography>
                  : <Typography sx={{ fontSize: 11.5, color: 'grey.400', flexShrink: 0 }}>No credit</Typography>}
              </Row>
              {r.covered > 0 && <ProgressBar value={ratio} thin />}
            </ListRow>
          )
        })}
      </Box>
    </SurfaceCard>
  )
}
