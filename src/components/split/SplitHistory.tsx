'use client'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { SurfaceCard } from '@/components/ui'
import { brand } from '@/lib/theme'
import { monthTotals, balanceStatus, splitMoney, type SplitMonth } from '@/data/splitData'
import { SplitStatusChip } from './SplitPrimitives'

function MonthRow({
  month,
  cents,
  isCurrent,
  onOpen,
}: {
  month: SplitMonth
  cents: boolean
  isCurrent: boolean
  onOpen: () => void
}) {
  const totals = monthTotals(month)
  const status = balanceStatus(totals.net)

  return (
    <Box
      component="button"
      onClick={onOpen}
      sx={{
        display: 'grid',
        gridTemplateColumns: '44px minmax(0,1fr) auto 28px',
        alignItems: 'center',
        gap: '14px',
        width: '100%',
        textAlign: 'left',
        p: '15px 18px 15px 16px',
        border: 'none',
        borderBottom: '1px solid',
        borderColor: 'divider',
        cursor: 'pointer',
        fontFamily: 'inherit',
        bgcolor: 'transparent',
        '&:hover': { bgcolor: brand.zinc[50] },
        transition: 'background 0.15s',
      }}
    >
      <Box sx={{ width: 44, height: 44, borderRadius: '10px', bgcolor: brand.zinc[100], display: 'grid', placeItems: 'center', color: 'text.secondary' }}>
        <CalendarTodayOutlinedIcon sx={{ fontSize: 19 }} />
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Typography sx={{ fontSize: 14.5, fontWeight: 600, letterSpacing: '-0.01em' }}>{month.label}</Typography>
          {isCurrent && (
            <Box component="span" sx={{ height: 20, px: '8px', borderRadius: '999px', bgcolor: brand.anchor[50], color: brand.anchor[700], fontSize: 11.5, fontWeight: 600, display: 'inline-flex', alignItems: 'center' }}>
              Current
            </Box>
          )}
        </Box>
        <Typography sx={{ fontSize: 12.5, color: 'text.disabled', mt: '3px', fontVariantNumeric: 'tabular-nums' }}>
          {month.expenses.length} expense{month.expenses.length === 1 ? '' : 's'} · {splitMoney(totals.total, cents)} total
          {totals.settledTotal > 0 ? ` · ${splitMoney(totals.settledTotal, cents)} settled` : ''}
        </Typography>
      </Box>
      <SplitStatusChip status={status} cents={cents} />
      <ChevronRightIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
    </Box>
  )
}

export function MonthHistory({
  months,
  cents,
  currentKey,
  onOpen,
}: {
  months: SplitMonth[]
  cents: boolean
  currentKey: string
  onOpen: (key: string) => void
}) {
  return (
    <SurfaceCard>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: '16px 20px', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
          <Typography sx={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em' }}>Month history</Typography>
          <Typography sx={{ fontSize: 12.5, color: 'text.disabled', fontVariantNumeric: 'tabular-nums' }}>{months.length}</Typography>
        </Box>
        <Typography sx={{ fontSize: 12, color: 'text.disabled' }}>Each month is independent — no rollover.</Typography>
      </Box>
      <Box>
        {months.map((m) => (
          <MonthRow key={m.key} month={m} cents={cents} isCurrent={m.key === currentKey} onOpen={() => onOpen(m.key)} />
        ))}
      </Box>
    </SurfaceCard>
  )
}
