import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { brand } from '@/lib/theme'
import { Dot, Row, Stat, SurfaceCard, VDivider } from '@/components/ui'
import { fmtMoney, fmtSigned } from '@/utils/format'
import type { Totals } from '@/utils/budget'

const LEGEND = [
  { c: brand.anchor[600], label: 'Spent + saved' },
  { c: brand.anchor[200], label: 'Budgeted, not yet spent' },
  { c: brand.gold[500], label: 'Sent to goals' },
  { c: 'grey.200', label: 'Unallocated surplus' },
]

export function SummaryStrip({ totals }: { totals: Totals }) {
  const { income, budgeted, spentSaved, allocated, surplus } = totals
  const deficit = surplus < 0

  const segs = income > 0
    ? [
        { w: spentSaved / income, c: brand.anchor[600] },
        { w: Math.max(0, budgeted - spentSaved) / income, c: brand.anchor[200] },
        { w: allocated / income, c: brand.gold[500] },
      ]
    : []

  const cellSx = (hero?: boolean) => ({ flex: hero ? 1.1 : 1, px: { xs: 2, sm: 2.5 } })

  return (
    <SurfaceCard>
      <Row align="stretch" sx={{ py: 2.5, px: 1 }}>
        <Stat label="Income" value={fmtMoney(income)} sub={`${totals.incomeCount} source${totals.incomeCount !== 1 ? 's' : ''}`} sx={cellSx()} />
        <VDivider sx={{ my: 0.75 }} />
        <Stat label="Budgeted" value={fmtMoney(budgeted)} sub={`${income > 0 ? Math.round(budgeted / income * 100) : 0}% of income`} sx={cellSx()} />
        <VDivider sx={{ my: 0.75 }} />
        <Stat label="Spent + saved" value={fmtMoney(spentSaved)} sub={`${budgeted > 0 ? Math.round(spentSaved / budgeted * 100) : 0}% of budget`} sx={cellSx()} />
        <VDivider sx={{ my: 0.75 }} />
        <Stat
          hero
          label={deficit ? 'Deficit' : 'Surplus'}
          value={fmtSigned(surplus)}
          sub={deficit ? 'Over budget this month' : allocated > 0 ? `${fmtMoney(allocated)} sent to goals` : 'Unallocated'}
          color={deficit ? brand.red[600] : brand.anchor[700]}
          sx={cellSx(true)}
        />
      </Row>
      <Box sx={{ px: 3.25, pb: 2.5 }}>
        <Row align="stretch" sx={{ height: 8, borderRadius: 999, overflow: 'hidden', bgcolor: 'grey.100' }}>
          {segs.map((s, i) =>
            s.w > 0 ? (
              <Box key={i} sx={{ width: `${Math.min(100, s.w * 100)}%`, bgcolor: s.c, transition: 'width 0.3s ease' }} />
            ) : null
          )}
        </Row>
        <Row gap={2.25} wrap sx={{ mt: 1.25 }}>
          {LEGEND.map(({ c, label }) => (
            <Row key={label} inline gap="7px">
              <Dot size={9} color={c} />
              <Typography variant="label" color="text.secondary">{label}</Typography>
            </Row>
          ))}
        </Row>
      </Box>
    </SurfaceCard>
  )
}
