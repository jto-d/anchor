'use client'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TrendingUpIcon from '@mui/icons-material/TrendingUpOutlined'
import { brand } from '@/lib/theme'
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
  const { grossAnnual, coveredAnnual, netAnnual, netMonthly, count, coveredCount } = totals
  const coverRatio = grossAnnual > 0 ? coveredAnnual / grossAnnual : 0

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
          label="Covered by credits"
          value={fmtMoney(coveredAnnual)}
          sub={coveredCount > 0 ? `${coveredCount} offset by a card` : 'No credits applied'}
          color={brand.anchor[700]}
          labelColor={brand.anchor[600]}
        />
        <VDivider sx={{ my: 0.75 }} />
        <StatCell
          label="You pay"
          value={fmtMoney(netAnnual)}
          sub={`${fmtMoney(netMonthly)} a month`}
        />
      </Row>

      <Box sx={{ px: 3.25, pb: 2.5 }}>
        <Box sx={{ display: 'flex', height: 8, borderRadius: 999, overflow: 'hidden', bgcolor: 'grey.100' }}>
          <Box sx={{ width: `${Math.min(100, coverRatio * 100)}%`, bgcolor: 'primary.main', transition: 'width 0.4s ease' }} />
          <Box sx={{ flex: 1, bgcolor: 'grey.300' }} />
        </Box>
        <Row justify="between" sx={{ mt: 1.25, flexWrap: 'wrap', gap: 1.5 }}>
          <Row gap={2.25} sx={{ flexWrap: 'wrap' }}>
            <LegendDot color={brand.anchor[600]} label={`Covered · ${fmtMoney(coveredAnnual)}/yr`} />
            <LegendDot color={brand.zinc[300]} label={`Out of pocket · ${fmtMoney(netAnnual)}/yr`} />
          </Row>
          {coveredAnnual > 0 && (
            <Row gap={0.75} sx={{ fontSize: 12.5, fontWeight: 600, color: brand.anchor[700] }}>
              <TrendingUpIcon sx={{ fontSize: 14 }} />
              Credits save you {fmtMoney(coveredAnnual)} a year
            </Row>
          )}
        </Row>
      </Box>
    </SurfaceCard>
  )
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <Row gap={0.875} sx={{ fontSize: 12, color: 'grey.500' }}>
      <Box sx={{ width: 9, height: 9, borderRadius: 999, bgcolor: color, flexShrink: 0 }} />
      {label}
    </Row>
  )
}
