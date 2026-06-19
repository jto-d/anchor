import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import AddIcon from '@mui/icons-material/Add'
import { CatGlyph } from '@/components/ui/CatGlyph'
import { SurfaceCard } from '@/components/ui/SurfaceCard'
import { EditableMoney } from '@/components/ui/EditableMoney'
import { fmtMoney } from '@/utils/format'
import type { IncomeSource } from '@/utils/budget'

interface IncomePanelProps {
  income: IncomeSource[]
  total: number
  onSetAmount: (id: string, v: number) => void
  onAdd: () => void
  onRemove: (id: string) => void
}

/** Sidebar list of monthly income sources with an editable amount and a running total. */
export function IncomePanel({ income, total, onSetAmount, onAdd }: IncomePanelProps) {
  return (
    <SurfaceCard>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2.25, py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <CatGlyph icon="wallet" size={30} tone="accent" />
          <Box>
            <Typography sx={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em' }}>Income</Typography>
            <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>Net, monthly</Typography>
          </Box>
        </Box>
        <IconButton size="small" title="Add income source" onClick={onAdd} sx={{ width: 30, height: 30, borderRadius: '7px', color: 'text.secondary' }}>
          <AddIcon sx={{ fontSize: 17 }} />
        </IconButton>
      </Box>

      {income.map((src, i) => (
        <Box key={src.id} sx={{ display: 'flex', alignItems: 'center', gap: 1.25, px: 2.25, py: 1.375, borderBottom: i < income.length - 1 ? '1px solid' : 'none', borderColor: 'divider' }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{src.label}</Typography>
            {src.sub && <Typography sx={{ fontSize: 11.5, color: 'text.disabled', mt: '2px' }}>{src.sub}</Typography>}
          </Box>
          <EditableMoney value={src.amount} onChange={(v) => onSetAmount(src.id, v)} weight={600} />
        </Box>
      ))}

      {income.length === 0 && (
        <Box sx={{ px: 2.25, py: 3.5, textAlign: 'center' }}>
          <Typography sx={{ fontSize: 13, color: 'text.disabled' }}>No income yet. Add a source to start.</Typography>
        </Box>
      )}

      <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', px: 2.5, py: 1.75, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'grey.50', borderRadius: '0 0 14px 14px' }}>
        <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: 'text.secondary' }}>Total monthly income</Typography>
        <Typography sx={{ fontSize: 19, fontWeight: 700, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
          {fmtMoney(total)}
        </Typography>
      </Box>
    </SurfaceCard>
  )
}
