import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import { brand } from '@/lib/theme'
import { CatGlyph, EditableLabel, EditableMoney, Eyebrow, ListRow, ProgressBar, Row } from '@/components/ui'
import { tabularNums } from '@/lib/sx'
import { fmtMoney, clamp01 } from '@/utils/format'
import type { GoalData, MonthSel } from '@/utils/budget'

interface GoalAllocRowProps {
  goal: GoalData
  amount: number
  sel: MonthSel
  onSet: (v: number) => void
  onRename: (name: string) => void
  onRemove: () => void
  onSetTarget: (target: number) => void
  last: boolean
}

export function GoalAllocRow({ goal, amount, sel: _sel, onSet, onRename, onRemove, onSetTarget, last }: GoalAllocRowProps) {
  const current = goal.running + amount
  const ratio = clamp01(goal.target ? current / goal.target : 0)
  const done = !!goal.target && current >= goal.target

  return (
    <ListRow last={last} gap={1.5} sx={{ py: 1.75 }}>
      <CatGlyph icon={goal.icon} size={38} tone={done ? 'accent' : 'neutral'} />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <EditableLabel value={goal.name} onChange={onRename} size={14} weight={600} />
        <Row gap={1} sx={{ my: '7px' }}>
          <Box sx={{ flex: 1, maxWidth: 230 }}>
            <ProgressBar value={ratio} color={brand.anchor[600]} thin />
          </Box>
          <Typography variant="note" sx={{ color: 'text.secondary', whiteSpace: 'nowrap', ...tabularNums }}>
            {fmtMoney(current)}{goal.target && <Box component="span" sx={{ color: 'text.disabled' }}> / {fmtMoney(goal.target)}</Box>}
          </Typography>
        </Row>
        <Row align="center" gap="6px">
          <Typography variant="note" color="text.disabled">Target</Typography>
          <EditableMoney
            value={goal.target ?? 0} muted={!goal.target}
            onChange={onSetTarget} size={12} weight={500}
          />
        </Row>
      </Box>
      <Box sx={{ textAlign: 'right' }}>
        <Eyebrow sx={{ fontSize: '10px', mb: '4px' }}>This month</Eyebrow>
        <EditableMoney
          value={amount} muted
          color={amount > 0 ? brand.anchor[700] : undefined}
          onChange={onSet} size={15} weight={600}
        />
      </Box>
      <IconButton
        size="small"
        onClick={onRemove}
        title="Remove goal"
        sx={{ width: 24, height: 24, borderRadius: '6px', color: 'text.disabled', '&:hover': { color: brand.red[500], bgcolor: brand.red[50] } }}
      >
        <DeleteOutlinedIcon sx={{ fontSize: 15 }} />
      </IconButton>
    </ListRow>
  )
}
