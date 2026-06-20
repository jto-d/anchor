import Box from '@mui/material/Box'
import Collapse from '@mui/material/Collapse'
import Typography from '@mui/material/Typography'
import { brand } from '@/lib/theme'
import { Row, SurfaceCard } from '@/components/ui'
import { tabularNums } from '@/lib/sx'
import { ColHeader, COL_W } from './ColHeader'
import { GroupHeader } from './GroupHeader'
import { LedgerRow } from './LedgerRow'
import { fmtMoney, fmtSigned } from '@/utils/format'
import type { GroupData, SavingsData, Totals } from '@/utils/budget'

interface BudgetLedgerProps {
  groups: GroupData[]
  savings: SavingsData[]
  collapsed: Record<string, boolean>
  onToggle: (key: string) => void
  onBudget: (catId: string, v: number) => void
  onSpent: (catId: string, v: number) => void
  onRenameCategory: (catId: string, label: string) => void
  onRemoveCategory: (catId: string) => void
  onSavingsMonthly: (id: string, v: number) => void
  onContribute: (id: string, v: number) => void
  onRenameSavings: (id: string, label: string) => void
  onRemoveSavings: (id: string) => void
  onAddCategory: (groupId: string) => void
  onAddSavings: () => void
  totals: Totals
}

const SAVINGS_GROUP: GroupData = { id: '__savings', label: 'Savings', icon: 'savings', position: 999, categories: [] }

/** The full editable ledger: every spending group plus the savings group, with footer totals. */
export function BudgetLedger({
  groups, savings, collapsed, onToggle,
  onBudget, onSpent, onRenameCategory, onRemoveCategory,
  onSavingsMonthly, onContribute, onRenameSavings, onRemoveSavings,
  onAddCategory, onAddSavings, totals,
}: BudgetLedgerProps) {
  const savBudget = savings.reduce((s, x) => s + x.monthly, 0)
  const savSpent = savings.reduce((s, x) => s + x.monthContrib, 0)

  return (
    <SurfaceCard>
      <ColHeader />

      {groups.map((g) => {
        const gt = g.categories.reduce((acc, c) => ({ budget: acc.budget + c.budget, spent: acc.spent + c.monthSpent }), { budget: 0, spent: 0 })
        const isCollapsed = !!collapsed[g.id]
        return (
          <Box key={g.id}>
            <GroupHeader group={g} spent={gt.spent} budget={gt.budget} collapsed={isCollapsed}
              onToggle={() => onToggle(g.id)} onAdd={() => onAddCategory(g.id)} />
            <Collapse in={!isCollapsed}>
              {g.categories.map((c, i) => (
                <LedgerRow key={c.id} {...c} budget={c.budget} spent={c.monthSpent}
                  onBudget={(v) => onBudget(c.id, v)} onSpent={(v) => onSpent(c.id, v)}
                  onRename={(label) => onRenameCategory(c.id, label)}
                  onRemove={() => onRemoveCategory(c.id)}
                  last={i === g.categories.length - 1} />
              ))}
            </Collapse>
          </Box>
        )
      })}

      {/* Savings group */}
      <Box>
        <GroupHeader
          group={SAVINGS_GROUP}
          spent={savSpent} budget={savBudget}
          collapsed={!!collapsed['__savings']}
          onToggle={() => onToggle('__savings')} onAdd={onAddSavings}
        />
        <Collapse in={!collapsed['__savings']}>
          {savings.map((sv, i) => (
            <LedgerRow key={sv.id} id={sv.id} label={sv.label} icon={sv.icon}
              budget={sv.monthly} spent={sv.monthContrib}
              isSavings ytd={sv.ytd} annualLimit={sv.annualLimit}
              onBudget={(v) => onSavingsMonthly(sv.id, v)}
              onSpent={(v) => onContribute(sv.id, v)}
              onRename={(label) => onRenameSavings(sv.id, label)}
              onRemove={() => onRemoveSavings(sv.id)}
              last={i === savings.length - 1} />
          ))}
          {savings.length === 0 && (
            <Box sx={{ p: 2.5, textAlign: 'center' }}>
              <Typography variant="body" color="text.disabled">No savings accounts yet. Add one.</Typography>
            </Box>
          )}
        </Collapse>
      </Box>

      {/* Footer totals */}
      <Row gap={1} sx={{ px: 2.5, py: 1.875, borderTop: '1px solid', borderColor: 'grey.300', bgcolor: 'grey.50' }}>
        <Typography sx={{ flex: 1, fontSize: 13, fontWeight: 700, letterSpacing: '0.01em', textTransform: 'uppercase', color: 'text.secondary' }}>Total budgeted</Typography>
        {[totals.budgeted, totals.spentSaved, totals.budgeted - totals.spentSaved].map((v, i) => (
          <Box key={i} sx={{ width: COL_W, textAlign: 'right', ...(i === 2 ? { pr: '8px' } : {}) }}>
            <Typography sx={{ ...tabularNums, fontSize: 15, fontWeight: 700, color: i === 2 && v < 0 ? brand.red[600] : 'text.primary' }}>
              {i === 2 ? fmtSigned(v) : fmtMoney(v)}
            </Typography>
          </Box>
        ))}
        <Box sx={{ width: 28 }} />
      </Row>
    </SurfaceCard>
  )
}
