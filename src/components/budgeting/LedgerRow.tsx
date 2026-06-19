import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { brand } from '@/lib/theme'
import { CatGlyph } from '@/components/ui/CatGlyph'
import { EditableMoney } from './EditableMoney'
import { ThinProgressBar } from './ThinProgressBar'
import { COL_W } from './ColHeader'
import { fmtMoney, fmtSigned } from '@/utils/format'

interface LedgerRowProps {
  id: string
  label: string
  icon: string
  budget: number
  spent: number
  isSavings?: boolean
  ytd?: number
  annualLimit?: number | null
  last?: boolean
  onBudget: (v: number) => void
  onSpent: (v: number) => void
}

/** One editable line item: budget / spent / remaining, with an optional IRS-limit bar for savings. */
export function LedgerRow({ id, label, icon, budget, spent, isSavings, ytd, annualLimit, last, onBudget, onSpent }: LedgerRowProps) {
  const remaining = budget - spent
  const over = remaining < -0.001

  let irsBar: React.ReactNode = null
  if (isSavings && annualLimit && ytd !== undefined) {
    const lr = ytd / annualLimit
    const tone = lr >= 1 ? 'red' : lr >= 0.85 ? 'amber' : 'accent'
    const tColor = lr >= 1 ? brand.red[600] : lr >= 0.85 ? brand.amber[700] : 'text.secondary'
    irsBar = (
      <Box sx={{ mt: 1, maxWidth: 340 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, mb: 0.5 }}>
          <Typography sx={{ fontSize: 11, color: 'text.disabled' }}>IRS limit · YTD</Typography>
          <Typography sx={{ fontSize: 11, color: tColor, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
            {fmtMoney(ytd)} of {fmtMoney(annualLimit)}
          </Typography>
        </Box>
        <ThinProgressBar value={lr} tone={tone} height={4} />
      </Box>
    )
  }

  return (
    <Box sx={{ px: 2.5, py: 1.375, borderBottom: last ? 'none' : '1px solid', borderColor: 'divider' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.375, flex: 1, minWidth: 0 }}>
          <CatGlyph icon={icon} size={32} tone={isSavings ? 'accent' : 'neutral'} />
          <Typography sx={{ fontSize: 14, fontWeight: 500 }}>{label}</Typography>
        </Box>
        <Box sx={{ width: COL_W, display: 'flex', justifyContent: 'flex-end' }}>
          <EditableMoney value={budget} onChange={onBudget} weight={500} />
        </Box>
        <Box sx={{ width: COL_W, display: 'flex', justifyContent: 'flex-end' }}>
          <EditableMoney value={spent} onChange={onSpent} muted weight={500} />
        </Box>
        <Box sx={{ width: COL_W, display: 'flex', justifyContent: 'flex-end', pr: 1 }}>
          <Typography sx={{
            fontVariantNumeric: 'tabular-nums', fontSize: 14, fontWeight: 600,
            color: over ? brand.red[600] : remaining < budget * 0.12 ? brand.amber[700] : 'text.secondary',
          }}>
            {fmtSigned(remaining)}
          </Typography>
        </Box>
        <Box sx={{ width: 28 }} />
      </Box>
      {irsBar}
    </Box>
  )
}
