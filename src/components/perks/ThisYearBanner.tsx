'use client'

import Typography from '@mui/material/Typography'
import { Dial, Eyebrow, Row, Stack, Stat, SurfaceCard } from '@/components/ui'
import { brand } from '@/lib/theme'
import { tabularNums } from '@/lib/sx'
import { cardAnnualFee, cardAvailable, cardCapturedYTD } from '@/utils/card'
import { fmtDollars, fmtSigned } from '@/utils/format'
import type { Card } from '@/utils/types'

function walletTotals(cards: Card[]) {
  const fees = cards.reduce((s, c) => s + cardAnnualFee(c), 0)
  const available = cards.reduce((s, c) => s + cardAvailable(c), 0)
  const captured = cards.reduce((s, c) => s + cardCapturedYTD(c), 0)
  return {
    fees,
    available,
    captured,
    left: Math.max(available - captured, 0),
    // Same formula as `cardNet` — actual value recovered against what the fees cost.
    net: captured - fees,
    pct: available ? captured / available : 0,
  }
}

/** "This year" headline — a capture dial beside the year's figures. Tops the perks dashboard. */
export function ThisYearBanner({ cards }: { cards: Card[] }) {
  const { fees, available, captured, left, net, pct } = walletTotals(cards)

  return (
    <SurfaceCard sx={{ borderRadius: '20px', p: '26px 28px', mb: '22px' }}>
      <Row gap="30px" wrap>
        <Dial value={pct} label="captured" />
        <Stack sx={{ flex: 1, minWidth: 260 }}>
          <Eyebrow>This year</Eyebrow>
          <Row align="baseline" gap={1.25} wrap sx={{ mt: 1.25 }}>
            <Typography sx={{ ...tabularNums, fontSize: 38, fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1 }}>
              {fmtDollars(captured)}
            </Typography>
            <Typography sx={{ fontSize: 15, fontWeight: 500, color: 'grey.500' }}>
              recovered of {fmtDollars(available)} · {fmtDollars(left)} left
            </Typography>
          </Row>
          <Row gap="34px" wrap sx={{ mt: '22px', pt: '18px', borderTop: '1px solid', borderColor: 'divider' }}>
            <Stat label="Annual fees" value={fmtDollars(fees)} />
            <Stat label="Perk value / yr" value={fmtDollars(available)} />
            <Stat
              label="Net value"
              value={fmtSigned(net)}
              valueColor={net < 0 ? brand.red[600] : brand.anchor[700]}
            />
          </Row>
        </Stack>
      </Row>
    </SurfaceCard>
  )
}
