import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { brand } from '@/lib/theme'
import { CatGlyph, EditableMoney, ListRow, ProgressBar, Row } from '@/components/ui'
import { COL_W } from './ColHeader'
import { tabularNums } from '@/lib/sx'
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
    const barColor = lr >= 1 ? brand.red[500] : lr >= 0.85 ? brand.gold[500] : brand.anchor[600]
    const tColor = lr >= 1 ? brand.red[600] : lr >= 0.85 ? brand.amber[700] : 'text.secondary'
    irsBar = (
      <Box sx={{ mt: 1, maxWidth: 340 }}>
        <Row justify="between" sx={{ mb: 0.5 }}>
          <Typography variant="note" color="text.disabled">IRS limit · YTD</Typography>
          <Typography variant="note" sx={{ color: tColor, fontWeight: 600, ...tabularNums }}>
            {fmtMoney(ytd)} of {fmtMoney(annualLimit)}
          </Typography>
        </Row>
        <ProgressBar value={lr} color={barColor} thin sx={{ height: 4 }} />
      </Box>
    )
  }

  return (
    <ListRow last={last} direction="column" sx={{ py: 1.375 }}>
      <Row gap={1}>
        <Row gap={1.375} min0 sx={{ flex: 1 }}>
          <CatGlyph icon={icon} size={32} tone={isSavings ? 'accent' : 'neutral'} />
          <Typography sx={{ fontSize: 14, fontWeight: 500 }}>{label}</Typography>
        </Row>
        <Row justify="end" sx={{ width: COL_W }}>
          <EditableMoney value={budget} onChange={onBudget} weight={500} />
        </Row>
        <Row justify="end" sx={{ width: COL_W }}>
          <EditableMoney value={spent} onChange={onSpent} muted weight={500} />
        </Row>
        <Row justify="end" sx={{ width: COL_W, pr: 1 }}>
          <Typography variant="bodyStrong" sx={{
            ...tabularNums,
            color: over ? brand.red[600] : remaining < budget * 0.12 ? brand.amber[700] : 'text.secondary',
          }}>
            {fmtSigned(remaining)}
          </Typography>
        </Row>
        <Box sx={{ width: 28 }} />
      </Row>
      {irsBar}
    </ListRow>
  )
}
