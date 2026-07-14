'use client'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { brand } from '@/lib/theme'
import { tabularNums } from '@/lib/sx'
import { cardAvailable, cardCapturedYTD, cardAnnualFee } from '@/utils/card'
import { fmtDollars, fmtSigned } from '@/utils/format'
import { Row } from '@/components/ui'
import type { Card } from '@/utils/types'

function walletTotals(cards: Card[]) {
  const fees = cards.reduce((s, c) => s + cardAnnualFee(c), 0)
  const avail = cards.reduce((s, c) => s + cardAvailable(c), 0)
  const captured = cards.reduce((s, c) => s + cardCapturedYTD(c), 0)
  return { fees, avail, net: captured - fees }
}

/* Three-column fee/value/net summary — placed inside the headline Paper. */
export function SummaryFigures({ cards, tone = 'panel' }: { cards: Card[]; tone?: 'panel' | 'headline' }) {
  const { fees, avail, net } = walletTotals(cards)
  const onAccent = tone === 'headline'
  const labelColor = onAccent ? brand.anchor[700] : brand.zinc[500]
  const valueColor = onAccent ? brand.anchor[800] : brand.zinc[900]
  const dividerColor = onAccent ? 'rgba(11,99,96,0.18)' : brand.zinc[200]

  const items = [
    { label: 'Annual fees', value: fmtDollars(fees), color: valueColor },
    { label: 'Perk value / yr', value: fmtDollars(avail), color: valueColor },
    { label: 'Net value', value: fmtSigned(net), color: net < 0 ? brand.red[600] : brand.anchor[700] },
  ]

  return (
    <Row align="stretch">
      {items.map((it, i) => (
        <Box
          key={it.label}
          sx={{
            flex: 1,
            pl: i ? '22px' : 0,
            ml: i ? '22px' : 0,
            borderLeft: i ? `1px solid ${dividerColor}` : 'none',
          }}
        >
          <Typography sx={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: labelColor }}>
            {it.label}
          </Typography>
          <Typography sx={{ ...tabularNums, fontSize: onAccent ? 22 : 26, fontWeight: 600, letterSpacing: '-0.025em', mt: 1, lineHeight: 1, color: it.color }}>
            {it.value}
          </Typography>
        </Box>
      ))}
    </Row>
  )
}
