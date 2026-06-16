import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { brand } from '@/lib/theme'
import { CatGlyph } from '@/components/ui/CatGlyph'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { EditableMoney } from './EditableMoney'
import { ThinProgressBar } from './ThinProgressBar'
import { fmtMoney, monthShort, clamp01 } from './format'
import type { GoalData, MonthSel } from './types'

interface GoalAllocRowProps {
  goal: GoalData
  amount: number
  sel: MonthSel
  onSet: (v: number) => void
  last: boolean
}

/** One allocatable goal in the surplus panel: progress, a pace recommendation, and this-month input. */
export function GoalAllocRow({ goal, amount, sel, onSet, last }: GoalAllocRowProps) {
  const current = goal.running + amount
  const ratio = clamp01(goal.target ? current / goal.target : 0)
  const done = !!goal.target && current >= goal.target

  let rec: number | null = null
  if (goal.target && goal.targetYear != null && goal.targetMonth != null) {
    const monthsLeft = goal.targetYear * 12 + goal.targetMonth - (sel.y * 12 + sel.m)
    const remaining = Math.max(0, goal.target - goal.running)
    if (monthsLeft > 0 && remaining > 0) rec = remaining / monthsLeft
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2.5, py: 1.75, borderBottom: last ? 'none' : '1px solid', borderColor: 'divider' }}>
      <CatGlyph icon={goal.icon} size={38} tone={done ? 'accent' : 'neutral'} />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.005em' }}>{goal.name}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, my: '7px' }}>
          <Box sx={{ flex: 1, maxWidth: 230 }}>
            <ThinProgressBar value={ratio} tone={done ? 'pos' : 'accent'} />
          </Box>
          <Typography sx={{ fontSize: 11.5, color: 'text.secondary', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
            {fmtMoney(current)}{goal.target && <Box component="span" sx={{ color: 'text.disabled' }}> / {fmtMoney(goal.target)}</Box>}
          </Typography>
        </Box>
        <Typography sx={{ fontSize: 11.5, color: 'text.disabled' }}>
          {rec != null
            ? <>Recommended <Box component="span" sx={{ color: 'text.secondary', fontWeight: 600 }}>{fmtMoney(rec)}/mo</Box> to reach {monthShort(goal.targetYear!, goal.targetMonth!)}</>
            : 'No target date set'}
        </Typography>
      </Box>
      <Box sx={{ textAlign: 'right' }}>
        <Eyebrow sx={{ fontSize: '10px', mb: '4px' }}>This month</Eyebrow>
        <EditableMoney
          value={amount} muted
          color={amount > 0 ? brand.anchor[700] : undefined}
          onChange={onSet} size={15} weight={600}
        />
      </Box>
    </Box>
  )
}
