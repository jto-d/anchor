import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { brand } from '@/lib/theme'
import { CatGlyph } from '@/components/ui/CatGlyph'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { SurfaceCard } from '@/components/ui/SurfaceCard'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { GoalAllocRow } from './GoalAllocRow'
import { fmtMoney } from '@/utils/format'
import type { GoalData, MonthSel, Totals } from '@/utils/budget'

interface SurplusPanelProps {
  goals: GoalData[]
  totals: Totals
  sel: MonthSel
  onSet: (goalId: string, v: number) => void
}

/** Surplus allocation: routes leftover income to goals once income covers everything budgeted. */
export function SurplusPanel({ goals, totals, sel, onSet }: SurplusPanelProps) {
  const { baseSurplus, allocated } = totals
  const unallocated = baseSurplus - allocated
  const active = baseSurplus > 0

  return (
    <SurfaceCard>
      <Box sx={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2,
        px: 2.75, py: 2.5,
        background: active ? `linear-gradient(0deg, #fff, ${brand.accentSoft})` : 'grey.50',
        borderBottom: '1px solid', borderColor: 'divider',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <CatGlyph icon="sparkles" size={38} tone={active ? 'accent' : 'neutral'} />
          <Box>
            <Typography sx={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.01em' }}>Surplus allocation</Typography>
            <Typography sx={{ fontSize: 12.5, color: 'text.secondary', mt: '2px', maxWidth: 340 }}>
              {active
                ? "Send what's left to a goal. Each allocation counts as a spend this month."
                : 'Allocation opens when your income covers everything budgeted.'}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
          <Eyebrow sx={{ fontSize: '10px', mb: '6px' }}>Unallocated</Eyebrow>
          <Typography sx={{
            fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1, fontVariantNumeric: 'tabular-nums',
            color: !active ? 'text.disabled' : unallocated <= 0 ? brand.anchor[600] : 'text.primary',
          }}>
            {fmtMoney(Math.max(0, unallocated))}
          </Typography>
          {active && (
            <Typography sx={{ fontSize: 11.5, color: 'text.secondary', mt: '6px', fontVariantNumeric: 'tabular-nums' }}>
              {fmtMoney(allocated)} of {fmtMoney(baseSurplus)} allocated
            </Typography>
          )}
        </Box>
      </Box>

      {active ? (
        <>
          <Box sx={{ px: 2.75, pt: 1.75 }}>
            <ProgressBar value={baseSurplus > 0 ? allocated / baseSurplus : 0} color={allocated > baseSurplus * 1.001 ? brand.red[500] : brand.gold[500]} thin sx={{ height: 6 }} />
            {unallocated > 0 ? (
              <Typography sx={{ fontSize: 12, color: 'text.secondary', mt: '9px', mb: '2px' }}>
                {fmtMoney(unallocated)} still on the table — assign it to a goal so it doesn't drift.
              </Typography>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', mt: '9px', mb: '2px' }}>
                <CheckCircleIcon sx={{ fontSize: 14, color: brand.anchor[600] }} />
                <Typography sx={{ fontSize: 12, color: brand.anchor[600], fontWeight: 600 }}>
                  Every surplus dollar is working toward a goal.
                </Typography>
              </Box>
            )}
          </Box>
          <Box sx={{ mt: 1.5 }}>
            {goals.map((g, i) => (
              <GoalAllocRow key={g.id} goal={g} amount={g.monthAllocated} sel={sel}
                onSet={(v) => onSet(g.id, v)} last={i === goals.length - 1} />
            ))}
          </Box>
        </>
      ) : (
        <Box sx={{ px: 2.75, py: 4.25, textAlign: 'center' }}>
          <Typography sx={{ fontSize: 13.5, color: 'text.secondary', maxWidth: 380, mx: 'auto', lineHeight: 1.5 }}>
            {baseSurplus < 0
              ? <><strong style={{ color: brand.red[600] }}>You're {fmtMoney(-baseSurplus)} over budget</strong> this month. Trim a category or lower a contribution to free up surplus.</>
              : 'Income exactly meets everything budgeted — no surplus to allocate this month.'}
          </Typography>
        </Box>
      )}
    </SurfaceCard>
  )
}
