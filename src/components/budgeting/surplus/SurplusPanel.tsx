import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import AddIcon from '@mui/icons-material/Add'
import { brand } from '@/lib/theme'
import { CatGlyph, Eyebrow, ProgressBar, Row, SurfaceCard } from '@/components/ui'
import { GoalAllocRow } from './GoalAllocRow'
import { tabularNums } from '@/lib/sx'
import { fmtMoney } from '@/utils/format'
import type { GoalData, MonthSel, Totals } from '@/utils/budget'

interface SurplusPanelProps {
  goals: GoalData[]
  totals: Totals
  sel: MonthSel
  onSet: (goalId: string, v: number) => void
  onAddGoal: () => void
  onRenameGoal: (id: string, name: string) => void
  onRemoveGoal: (id: string) => void
}

export function SurplusPanel({ goals, totals, sel, onSet, onAddGoal, onRenameGoal, onRemoveGoal }: SurplusPanelProps) {
  const { baseSurplus, allocated } = totals
  const unallocated = baseSurplus - allocated
  const active = baseSurplus > 0

  return (
    <SurfaceCard>
      <Row
        align="start"
        justify="between"
        gap={2}
        sx={{
          px: 2.75, py: 2.5,
          background: active ? `linear-gradient(0deg, #fff, ${brand.accentSoft})` : 'grey.50',
          borderBottom: '1px solid', borderColor: 'divider',
        }}
      >
        <Row gap={1.5}>
          <CatGlyph icon="sparkles" size={38} tone={active ? 'accent' : 'neutral'} />
          <Box>
            <Typography variant="cardTitle">Surplus allocation</Typography>
            <Typography variant="label" color="text.secondary" sx={{ mt: '2px', maxWidth: 340 }}>
              {active
                ? "Send what's left to a goal. Each allocation counts as a spend this month."
                : 'Allocation opens when your income covers everything budgeted.'}
            </Typography>
          </Box>
        </Row>
        <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
          <Eyebrow sx={{ fontSize: '10px', mb: '6px' }}>Unallocated</Eyebrow>
          <Typography variant="statXl" sx={{
            fontWeight: 700,
            color: !active ? 'text.disabled' : unallocated <= 0 ? brand.anchor[600] : 'text.primary',
          }}>
            {fmtMoney(Math.max(0, unallocated))}
          </Typography>
          {active && (
            <Typography variant="note" sx={{ color: 'text.secondary', mt: '6px', ...tabularNums }}>
              {fmtMoney(allocated)} of {fmtMoney(baseSurplus)} allocated
            </Typography>
          )}
        </Box>
      </Row>

      {active ? (
        <>
          <Box sx={{ px: 2.75, pt: 1.75 }}>
            <ProgressBar value={baseSurplus > 0 ? allocated / baseSurplus : 0} color={allocated > baseSurplus * 1.001 ? brand.red[500] : brand.gold[500]} thin sx={{ height: 6 }} />
            {unallocated > 0 ? (
              <Typography variant="label" sx={{ color: 'text.secondary', mt: '9px', mb: '2px' }}>
                {fmtMoney(unallocated)} still on the table — assign it to a goal so it doesn't drift.
              </Typography>
            ) : (
              <Row gap="6px" sx={{ mt: '9px', mb: '2px' }}>
                <CheckCircleIcon sx={{ fontSize: 14, color: brand.anchor[600] }} />
                <Typography variant="label" sx={{ color: brand.anchor[600], fontWeight: 600 }}>
                  Every surplus dollar is working toward a goal.
                </Typography>
              </Row>
            )}
          </Box>
          <Box sx={{ mt: 1.5 }}>
            {goals.map((g, i) => (
              <GoalAllocRow key={g.id} goal={g} amount={g.monthAllocated} sel={sel}
                onSet={(v) => onSet(g.id, v)}
                onRename={(name) => onRenameGoal(g.id, name)}
                onRemove={() => onRemoveGoal(g.id)}
                last={i === goals.length - 1} />
            ))}
          </Box>
        </>
      ) : (
        <Box sx={{ px: 2.75, py: 4.25, textAlign: 'center' }}>
          <Typography variant="body" sx={{ color: 'text.secondary', maxWidth: 380, mx: 'auto', lineHeight: 1.5 }}>
            {baseSurplus < 0
              ? <><strong style={{ color: brand.red[600] }}>You're {fmtMoney(-baseSurplus)} over budget</strong> this month. Trim a category or lower a contribution to free up surplus.</>
              : 'Income exactly meets everything budgeted — no surplus to allocate this month.'}
          </Typography>
        </Box>
      )}

      <Row sx={{ px: 2.5, py: 1.25, borderTop: '1px solid', borderColor: 'divider' }}>
        <Button
          size="small"
          startIcon={<AddIcon sx={{ fontSize: 14 }} />}
          onClick={onAddGoal}
          sx={{ textTransform: 'none', fontSize: 12, fontWeight: 500, color: 'text.disabled', px: 1, py: 0.5, borderRadius: '7px', '&:hover': { color: 'text.secondary', bgcolor: 'grey.100' } }}
        >
          Add goal
        </Button>
      </Row>
    </SurfaceCard>
  )
}
