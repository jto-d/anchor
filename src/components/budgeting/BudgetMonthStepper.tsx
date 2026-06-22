import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { brand } from '@/lib/theme'
import { Row } from '@/components/ui'
import { tabularNums } from '@/lib/sx'
import { monthLabel } from '@/utils/format'
import type { MonthSel } from '@/utils/budget'

interface BudgetMonthStepperProps {
  sel: MonthSel
  onStep: (dir: number) => void
  startYear?: number | null
  startMonth?: number | null
}

/** Prev/next month control. Forward navigation stops at the current month; back stops at the budget start month (if set). */
export function BudgetMonthStepper({ sel, onStep, startYear, startMonth }: BudgetMonthStepperProps) {
  const now = new Date()
  const selOrd = sel.y * 12 + sel.m
  const nowOrd = now.getFullYear() * 12 + now.getMonth()
  const atCurrent = selOrd >= nowOrd + 1

  const atStart = startYear != null && startMonth != null
    && sel.y === startYear && sel.m === startMonth

  return (
    <Row inline gap="2px" sx={{ p: '3px', bgcolor: 'grey.100', border: '1px solid', borderColor: 'divider', borderRadius: '9px' }}>
      <IconButton size="small" onClick={() => onStep(-1)} disabled={atStart}
        sx={{ width: 32, height: 32, borderRadius: '7px', color: atStart ? 'text.disabled' : 'text.secondary', '&:hover': { bgcolor: atStart ? 'transparent' : '#fff', boxShadow: atStart ? 'none' : brand.shadow.sm } }}>
        <ChevronLeftIcon sx={{ fontSize: 17 }} />
      </IconButton>
      <Typography variant="bodyStrong" sx={{ minWidth: 130, textAlign: 'center', ...tabularNums }}>
        {monthLabel(sel.y, sel.m)}
      </Typography>
      <IconButton size="small" onClick={() => onStep(1)} disabled={atCurrent}
        sx={{ width: 32, height: 32, borderRadius: '7px', color: atCurrent ? 'text.disabled' : 'text.secondary', '&:hover': { bgcolor: atCurrent ? 'transparent' : '#fff', boxShadow: atCurrent ? 'none' : brand.shadow.sm } }}>
        <ChevronRightIcon sx={{ fontSize: 17 }} />
      </IconButton>
    </Row>
  )
}
