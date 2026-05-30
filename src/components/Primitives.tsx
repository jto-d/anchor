'use client'

import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import type { SxProps, Theme } from '@mui/material/styles'
import { brand } from '@/lib/theme'
import type { StatusKey } from '@/utils/types'

/** Small uppercase section label (the old "Eyebrow"), now a themed Typography. */
export function Eyebrow({
  children,
  sx,
}: {
  children: React.ReactNode
  sx?: SxProps<Theme>
}) {
  return (
    <Typography
      variant="overline"
      component="div"
      sx={[
        { color: 'grey.500', display: 'block', lineHeight: 1.4 },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      {children}
    </Typography>
  )
}

const CHIP_SX: Record<StatusKey, { bgcolor: string; color: string }> = {
  captured: { bgcolor: brand.accentSoft, color: brand.anchor[700] },
  partial: { bgcolor: brand.accentSoft, color: brand.anchor[700] },
  expiring: { bgcolor: brand.amber[50], color: brand.amber[700] },
  open: { bgcolor: brand.zinc[100], color: brand.zinc[600] },
  forfeited: { bgcolor: brand.red[50], color: brand.red[600] },
}

/** Status pill mapping a perk's StatusKey to the right Anchor colors. */
export function StatusChip({
  status,
  label,
  icon,
}: {
  status: StatusKey
  label: string
  icon?: React.ReactElement
}) {
  return (
    <Chip
      size="small"
      label={label}
      icon={icon}
      sx={{
        height: 24,
        fontSize: 12,
        borderRadius: 999,
        ...CHIP_SX[status],
        '& .MuiChip-icon': { color: 'inherit', fontSize: 14, ml: '6px', mr: '-3px' },
        '& .MuiChip-label': { px: '10px' },
      }}
    />
  )
}
