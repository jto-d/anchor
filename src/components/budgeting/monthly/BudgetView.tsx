'use client'

import { useCallback, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Snackbar from '@mui/material/Snackbar'
import Typography from '@mui/material/Typography'
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined'
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined'
import { brand } from '@/lib/theme'
import { AppDialog, Row, Stack } from '@/components/ui'
import { Topbar } from '@/components/layout/Topbar'
import { BudgetMonthStepper } from '../BudgetMonthStepper'
import { SummaryStrip } from './SummaryStrip'
import { BudgetLedger } from './BudgetLedger'
import { SurplusPanel } from '../surplus/SurplusPanel'
import { IncomePanel } from './IncomePanel'
import { GoalsRecap } from './GoalsRecap'
import { useBudgetMonth } from '@/hooks/useBudgetMonth'
import type { MonthSel } from '@/utils/budget'

function stepMonth(sel: MonthSel, dir: number): MonthSel {
  const date = new Date(sel.y, sel.m + dir, 1)
  return { y: date.getFullYear(), m: date.getMonth() }
}

export function BudgetView({ userEmail: _userEmail }: { userEmail: string }) {
  const now = new Date()
  const [sel, setSel] = useState<MonthSel>({ y: now.getFullYear(), m: now.getMonth() })
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})
  const [confirmStart, setConfirmStart] = useState(false)

  const budget = useBudgetMonth(sel)

  const handleToggle = useCallback((key: string) => {
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }))
  }, [])

  const handleStep = useCallback((dir: number) => {
    setSel((s) => stepMonth(s, dir))
  }, [])

  const isCurrentStart = budget.budgetStartYear === sel.y && budget.budgetStartMonth === sel.m

  const stepper = (
    <Row gap={1.5}>
      <BudgetMonthStepper
        sel={sel} onStep={handleStep}
        startYear={budget.budgetStartYear}
        startMonth={budget.budgetStartMonth}
      />
      <Button
        size="small"
        startIcon={<FlagOutlinedIcon sx={{ fontSize: 14 }} />}
        onClick={() => setConfirmStart(true)}
        disabled={isCurrentStart}
        title={isCurrentStart ? 'This is your budget start month' : 'Mark this month as the budget start'}
        sx={{
          textTransform: 'none', fontSize: 12, fontWeight: 500, height: 38,
          color: isCurrentStart ? brand.anchor[600] : 'text.secondary',
          borderColor: isCurrentStart ? brand.anchor[300] : 'divider',
          '&:hover': { borderColor: brand.anchor[400] },
          border: '1px solid',
          borderRadius: '9px', px: 1.25,
        }}
      >
        {isCurrentStart ? 'Budget start' : 'Set as start'}
      </Button>
    </Row>
  )

  if (budget.fetching && !budget.hasData) {
    return (
      <Row justify="center" sx={{ flex: 1 }}>
        <CircularProgress />
      </Row>
    )
  }

  return (
    <Box sx={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      <Topbar title="Budget" rightSlot={stepper} />

      <Box sx={{ position: 'sticky', top: 0, zIndex: 20, px: 4, pt: 2.75, pb: 1.75, bgcolor: 'background.default' }}>
        <SummaryStrip totals={budget.totals} />
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 344px', gap: 3, alignItems: 'start', px: 4, pb: 5.5 }}>
        <Stack gap={3} sx={{ minWidth: 0 }}>
          <BudgetLedger
            groups={budget.groups} savings={budget.savings} collapsed={collapsed}
            onToggle={handleToggle}
            onBudget={budget.setBudget} onSpent={budget.setSpent}
            onRenameCategory={budget.renameCategory} onRemoveCategory={budget.removeCategory}
            onSavingsMonthly={budget.setSavingsMonthly} onContribute={budget.contribute}
            onRenameSavings={budget.renameSavings} onRemoveSavings={budget.removeSavings}
            onAddCategory={budget.addCategory} onAddSavings={budget.addSavings}
            onAddGroup={budget.addGroup} onRenameGroup={budget.renameGroup} onRemoveGroup={budget.removeGroup}
            totals={budget.totals}
          />
          <SurplusPanel
            goals={budget.goals} totals={budget.totals} sel={sel}
            onSet={budget.setAllocation}
            onAddGoal={budget.addGoal}
            onRenameGoal={budget.renameGoal}
            onRemoveGoal={budget.removeGoal}
            onSetGoalTarget={budget.setGoalTarget}
          />
        </Stack>
        <Stack gap={3}>
          <IncomePanel
            income={budget.incomeSources} total={budget.totals.income}
            onSetAmount={budget.setIncome} onRename={budget.renameIncome}
            onAdd={budget.addIncome} onRemove={budget.removeIncome}
          />
          <GoalsRecap goals={budget.goals} />
        </Stack>
      </Box>

      <AppDialog
        open={confirmStart}
        onClose={() => setConfirmStart(false)}
        title="Set budget start"
        subtitle={`${new Date(sel.y, sel.m).toLocaleString('default', { month: 'long', year: 'numeric' })}`}
        width={400}
      >
        <Box sx={{ px: '22px', pb: '4px' }}>
          <Typography variant="body" sx={{ color: 'grey.500', lineHeight: 1.5 }}>
            This will mark this month as your budget start. Months before it will be hidden from the budget view.
          </Typography>
        </Box>
        <Row justify="end" gap="10px" sx={{ p: '16px 22px 20px' }}>
          <Button variant="subtle" onClick={() => setConfirmStart(false)}>Cancel</Button>
          <Button
            variant="contained"
            startIcon={<FlagOutlinedIcon sx={{ fontSize: 15 }} />}
            onClick={() => { budget.setBudgetStart(sel.y, sel.m); setConfirmStart(false) }}
          >
            Set start
          </Button>
        </Row>
      </AppDialog>

      <Snackbar
        open={!!budget.toast}
        autoHideDuration={2800}
        onClose={budget.dismissToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Row gap={1.1} sx={{ bgcolor: 'grey.900', color: '#fff', px: '18px', py: '11px', borderRadius: 999, fontSize: 13, fontWeight: 500, boxShadow: brand.shadow.lg }}>
          <AutoAwesomeOutlinedIcon sx={{ fontSize: 15, color: brand.anchor[300] }} />
          {budget.toast}
        </Row>
      </Snackbar>
    </Box>
  )
}
