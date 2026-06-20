import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { brand } from '@/lib/theme'
import { Row } from '@/components/ui'
import { tabularNums } from '@/lib/sx'
import { monthLabel } from '@/utils/format'
import type { MonthSel } from '@/utils/budget'

/** Prev/next month control, rendered in the Topbar's right slot. Forward navigation stops at the current month. */
export function BudgetMonthStepper({ sel, onStep }: { sel: MonthSel; onStep: (dir: number) => void }) {
  const now = new Date()
  const atCurrent = sel.y === now.getFullYear() && sel.m === now.getMonth()

  return (
    <Row inline gap="2px" sx={{ p: '3px', bgcolor: 'grey.100', border: '1px solid', borderColor: 'divider', borderRadius: '9px' }}>
      <IconButton size="small" onClick={() => onStep(-1)}
        sx={{ width: 32, height: 32, borderRadius: '7px', color: 'text.secondary', '&:hover': { bgcolor: '#fff', boxShadow: brand.shadow.sm } }}>
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
