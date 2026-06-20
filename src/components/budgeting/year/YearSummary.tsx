import Typography from '@mui/material/Typography'
import { brand } from '@/lib/theme'
import { Row, Stat, SurfaceCard, Tag, VDivider } from '@/components/ui'
import { fmtMoney, fmtSigned } from '@/utils/format'
import type { YearAnnual } from '@/hooks/useBudgetYear'
import { MONTHS_LONG } from './constants'

export function YearSummary({ annual, completed, projected, currentLabel }: {
  annual: YearAnnual
  completed: number
  projected: number
  currentLabel: number | null
}) {
  const deficit = annual.surplus < 0
  const rate = annual.income > 0 ? (annual.saved + Math.max(0, annual.surplus)) / annual.income : 0

  const cellSx = (hero?: boolean) => ({ flex: hero ? 1.15 : 1, px: { xs: 2, sm: 2.75 } })

  return (
    <SurfaceCard>
      <Row align="stretch" sx={{ py: 2.5, px: 1 }}>
        <Stat label="Income" value={fmtMoney(annual.income)} sub={`${fmtMoney(annual.monthlyIncome)}/mo · full year`} sx={cellSx()} />
        <VDivider sx={{ my: 0.75 }} />
        <Stat label="Spent" value={fmtMoney(annual.spent)} sub={`${Math.round(annual.income > 0 ? annual.spent / annual.income * 100 : 0)}% of income`} sx={cellSx()} />
        <VDivider sx={{ my: 0.75 }} />
        <Stat label="Saved" value={fmtMoney(annual.saved)} sub={`${Math.round(annual.income > 0 ? annual.saved / annual.income * 100 : 0)}% to accounts`} sx={cellSx()} />
        <VDivider sx={{ my: 0.75 }} />
        <Stat
          hero
          label={deficit ? 'Net shortfall' : 'Surplus'}
          value={fmtSigned(annual.surplus)}
          sub={`${Math.round(rate * 100)}% kept or saved`}
          color={deficit ? brand.red[600] : brand.anchor[700]}
          sx={cellSx(true)}
        />
      </Row>
      <Row gap={1.5} wrap sx={{ px: 3.25, pb: 2 }}>
        <Tag tone="accent">✓ {completed} logged</Tag>
        {currentLabel != null && <Tag tone="amber">◷ {MONTHS_LONG[currentLabel]} in progress</Tag>}
        {projected > 0 && <Tag tone="neutral">{projected} projected</Tag>}
        <Typography variant="label" color="text.secondary" sx={{ ml: '2px' }}>
          Estimated months assume your budget is met on-track.
        </Typography>
      </Row>
    </SurfaceCard>
  )
}
