import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import AddIcon from '@mui/icons-material/Add'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { brand } from '@/lib/theme'
import { CatGlyph } from '@/components/ui/CatGlyph'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { fmtMoney } from '@/utils/format'
import type { GroupData } from '@/utils/budget'

/** Collapsible section header for a budget group: rolled-up spend/budget, progress, and an add button. */
export function GroupHeader({
  group, spent, budget, collapsed, onToggle, onAdd,
}: {
  group: GroupData
  spent: number
  budget: number
  collapsed: boolean
  onToggle: () => void
  onAdd: () => void
}) {
  const ratio = budget > 0 ? spent / budget : 0
  const over = spent - budget > 0.001

  return (
    <Box
      onClick={onToggle}
      sx={{
        display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer',
        px: 2.5, py: 1.5,
        bgcolor: 'grey.50',
        borderBottom: '1px solid', borderTop: '1px solid', borderColor: 'divider',
        '&:hover': { bgcolor: 'grey.100' },
        transition: 'background 0.15s ease',
      }}
    >
      <ExpandMoreIcon
        sx={{
          fontSize: 16, color: 'text.secondary', flexShrink: 0,
          transform: collapsed ? 'rotate(-90deg)' : 'none',
          transition: 'transform 0.18s ease',
        }}
      />
      <CatGlyph icon={group.icon} size={26} />
      <Typography sx={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.01em', textTransform: 'uppercase', flex: 1 }}>
        {group.label}
        <Box component="span" sx={{ ml: 1.1, fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', color: 'text.disabled' }}>
          {group.categories.length}
        </Box>
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Typography sx={{ fontSize: 12.5, color: over ? brand.red[600] : 'text.secondary', fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>
          {fmtMoney(spent)}{' '}
          <Box component="span" sx={{ color: 'text.disabled' }}>/ {fmtMoney(budget)}</Box>
        </Typography>
        <Box sx={{ width: 52 }}>
          <ProgressBar value={ratio} color={over ? brand.red[500] : brand.anchor[600]} thin />
        </Box>
        <IconButton
          size="small"
          title="Add line item"
          onClick={(e) => { e.stopPropagation(); onAdd() }}
          sx={{ width: 28, height: 28, borderRadius: '7px', color: 'text.secondary' }}
        >
          <AddIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>
    </Box>
  )
}
