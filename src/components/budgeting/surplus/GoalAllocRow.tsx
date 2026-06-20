import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { brand } from '@/lib/theme'
import { CatGlyph, EditableMoney, Eyebrow, ListRow, ProgressBar, Row } from '@/components/ui'
import { tabularNums } from '@/lib/sx'
import { fmtMoney, monthShort, clamp01 } from '@/utils/format'
import type { GoalData, MonthSel } from '@/utils/budget'

interface GoalAllocRowProps {
  goal: GoalData
  amount: number
  sel: MonthSel
  onSet: (v: number) => void
  last: boolean
}

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
    <ListRow last={last} gap={1.5} sx={{ py: 1.75 }}>
      <CatGlyph icon={goal.icon} size={38} tone={done ? 'accent' : 'neutral'} />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="bodyStrong">{goal.name}</Typography>
        <Row gap={1} sx={{ my: '7px' }}>
          <Box sx={{ flex: 1, maxWidth: 230 }}>
            <ProgressBar value={ratio} color={brand.anchor[600]} thin />
          </Box>
          <Typography variant="note" sx={{ color: 'text.secondary', whiteSpace: 'nowrap', ...tabularNums }}>
            {fmtMoney(current)}{goal.target && <Box component="span" sx={{ color: 'text.disabled' }}> / {fmtMoney(goal.target)}</Box>}
          </Typography>
        </Row>
        <Typography variant="note" color="text.disabled">
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
    </ListRow>
  )
}
