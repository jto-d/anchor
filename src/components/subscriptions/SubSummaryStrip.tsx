'use client'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Row, SurfaceCard, VDivider } from '@/components/ui'
import { fmtMoney } from '@/utils/format'
import type { SubSummaryTotals } from '@/data/subscriptionData'

function StatCell({
  label,
  value,
  sub,
  color,
  labelColor,
}: {
  label: string
  value: string
  sub?: string
  color?: string
  labelColor?: string
}) {
  return (
    <Box sx={{ flex: 1, minWidth: 0, px: 2.75 }}>
      <Typography
        variant="overline"
        sx={{ display: 'block', mb: 0.875, fontSize: '10.5px', color: labelColor || 'grey.500' }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: 25,
          fontWeight: 600,
          letterSpacing: '-0.02em',
          lineHeight: 1,
          fontVariantNumeric: 'tabular-nums',
          color: color || 'text.primary',
        }}
      >
        {value}
      </Typography>
      {sub && (
        <Typography sx={{ mt: 0.75, fontSize: 12, color: 'grey.500', lineHeight: 1.3 }}>
          {sub}
        </Typography>
      )}
    </Box>
  )
}

export function SubSummaryStrip({ totals }: { totals: SubSummaryTotals }) {
  const { grossAnnual, monthly, count } = totals

  return (
    <SurfaceCard sx={{ overflow: 'hidden' }}>
      <Row align="stretch" sx={{ py: 2.5, px: 1.25 }}>
        <StatCell
          label="Per year"
          value={fmtMoney(grossAnnual)}
          sub={`${count} active subscription${count === 1 ? '' : 's'}`}
        />
        <VDivider sx={{ my: 0.75 }} />
        <StatCell
          label="Per month"
          value={fmtMoney(monthly)}
          sub="Monthly equivalent"
        />
      </Row>
    </SurfaceCard>
  )
}
