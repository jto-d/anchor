'use client'

import { useCallback, useState } from 'react'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Snackbar from '@mui/material/Snackbar'
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined'
import { brand } from '@/lib/theme'
import { SummaryStrip } from './SummaryStrip'
import { BudgetLedger } from './BudgetLedger'
import { SurplusPanel } from './SurplusPanel'
import { IncomePanel } from './IncomePanel'
import { GoalsRecap } from './GoalsRecap'
import { useBudgetMonth } from '@/hooks/useBudgetMonth'

/**
 * Budgeting screen. Owns view-only state (selected month, collapsed groups,
 * snackbar mount) and the page layout; all data and server interaction lives
 * in `useBudgetMonth`.
 */
export function BudgetView({ userEmail: _userEmail }: { userEmail: string }) {
  const now = new Date()
  const [sel] = useState({ y: now.getFullYear(), m: now.getMonth() })
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  const budget = useBudgetMonth(sel)

  const handleToggle = useCallback((key: string) => {
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }))
  }, [])

  if (budget.fetching && !budget.hasData) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ flex: 1, overflow: 'auto' }}>
      {/* Sticky summary */}
      <Box sx={{ position: 'sticky', top: 0, zIndex: 20, px: 4, pt: 2.75, pb: 1.75, bgcolor: 'background.default' }}>
        <SummaryStrip totals={budget.totals} />
      </Box>

      {/* Two-column body */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 344px', gap: 3, alignItems: 'start', px: 4, pb: 5.5 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
          <BudgetLedger
            groups={budget.groups} savings={budget.savings} collapsed={collapsed}
            onToggle={handleToggle}
            onBudget={budget.setBudget} onSpent={budget.setSpent}
            onSavingsMonthly={budget.setSavingsMonthly} onContribute={budget.contribute}
            onAddCategory={budget.addCategory} onAddSavings={budget.addSavings}
            totals={budget.totals}
          />
          <SurplusPanel goals={budget.goals} totals={budget.totals} sel={sel} onSet={budget.setAllocation} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <IncomePanel
            income={budget.incomeSources} total={budget.totals.income}
            onSetAmount={budget.setIncome} onAdd={budget.addIncome} onRemove={budget.removeIncome}
          />
          <GoalsRecap goals={budget.goals} />
        </Box>
      </Box>

      <Snackbar
        open={!!budget.toast}
        autoHideDuration={2800}
        onClose={budget.dismissToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.1, bgcolor: 'grey.900', color: '#fff', px: '18px', py: '11px', borderRadius: 999, fontSize: 13, fontWeight: 500, boxShadow: brand.shadow.lg }}>
          <AutoAwesomeOutlinedIcon sx={{ fontSize: 15, color: brand.anchor[300] }} />
          {budget.toast}
        </Box>
      </Snackbar>
    </Box>
  )
}
