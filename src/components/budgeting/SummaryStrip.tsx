import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { brand } from '@/lib/theme'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { SurfaceCard } from '@/components/ui/SurfaceCard'
import { fmtMoney, fmtSigned } from '@/utils/format'
import type { Totals } from '@/utils/budget'

const LEGEND = [
  { c: brand.anchor[600], label: 'Spent + saved' },
  { c: brand.anchor[200], label: 'Budgeted, not yet spent' },
  { c: brand.gold[500], label: 'Sent to goals' },
  { c: 'grey.200', label: 'Unallocated surplus' },
]

/** Sticky top strip: income / budgeted / spent + saved / surplus, plus an allocation bar. */
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

  const cell = (label: string, value: string, sub: string, hero?: boolean, heroColor?: string) => (
    <Box sx={{ flex: hero ? 1.1 : 1, minWidth: 0, px: { xs: 2, sm: 2.5 } }}>
      <Eyebrow sx={{ fontSize: '10.5px', mb: 0.75, color: heroColor ? `${heroColor}` : 'text.secondary' }}>
        {label}
      </Eyebrow>
      <Typography sx={{ fontSize: hero ? 28 : 23, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1, fontVariantNumeric: 'tabular-nums', color: heroColor || 'text.primary' }}>
        {value}
      </Typography>
      <Typography sx={{ mt: '6px', fontSize: 12, color: 'text.secondary', lineHeight: 1.3 }}>{sub}</Typography>
    </Box>
  )

  const divider = <Box sx={{ width: '1px', alignSelf: 'stretch', bgcolor: 'divider', my: 0.75 }} />

  return (
    <SurfaceCard>
      <Box sx={{ display: 'flex', alignItems: 'stretch', py: 2.5, px: 1 }}>
        {cell('Income', fmtMoney(income), `${totals.incomeCount} source${totals.incomeCount !== 1 ? 's' : ''}`)}
        {divider}
        {cell('Budgeted', fmtMoney(budgeted), `${income > 0 ? Math.round(budgeted / income * 100) : 0}% of income`)}
        {divider}
        {cell('Spent + saved', fmtMoney(spentSaved), `${budgeted > 0 ? Math.round(spentSaved / budgeted * 100) : 0}% of budget`)}
        {divider}
        {cell(
          deficit ? 'Deficit' : 'Surplus',
          fmtSigned(surplus),
          deficit ? 'Over budget this month' : allocated > 0 ? `${fmtMoney(allocated)} sent to goals` : 'Unallocated',
          true,
          deficit ? brand.red[600] : brand.anchor[700],
        )}
      </Box>
      <Box sx={{ px: 3.25, pb: 2.5 }}>
        <Box sx={{ display: 'flex', height: 8, borderRadius: 999, overflow: 'hidden', bgcolor: 'grey.100' }}>
          {segs.map((s, i) =>
            s.w > 0 ? (
              <Box key={i} sx={{ width: `${Math.min(100, s.w * 100)}%`, bgcolor: s.c, transition: 'width 0.3s ease' }} />
            ) : null
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 2.25, mt: 1.25, flexWrap: 'wrap' }}>
          {LEGEND.map(({ c, label }) => (
            <Box key={label} sx={{ display: 'inline-flex', alignItems: 'center', gap: '7px' }}>
              <Box sx={{ width: 9, height: 9, borderRadius: 999, bgcolor: c, flexShrink: 0 }} />
              <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{label}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </SurfaceCard>
  )
}
