'use client'

import Box from '@mui/material/Box'
import { fmtRate } from '@/utils/cardRewards'
import { brand } from '@/lib/theme'
import type { Reward } from '@/utils/cardRewards'

interface RateBadgeProps {
  reward: Reward
  winner?: boolean
  muted?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const SIZES = {
  sm: { height: 22, px: '8px',  fontSize: '12.5px' },
  md: { height: 26, px: '10px', fontSize: '13.5px' },
  lg: { height: 34, px: '14px', fontSize: '17px' },
}

export function RateBadge({ reward, winner, muted, size = 'md' }: RateBadgeProps) {
  const s = SIZES[size]

  const bg    = winner ? brand.anchor[700]  : muted ? 'transparent' : brand.accentSoft
  const color = winner ? '#fff'             : muted ? brand.zinc[400] : brand.anchor[700]
  const border = winner ? `1px solid ${brand.anchor[700]}`
               : muted  ? `1px solid ${brand.zinc[200]}`
               : '1px solid transparent'

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: s.height,
        minWidth: s.height,
        px: s.px,
        borderRadius: '7px',
        fontSize: s.fontSize,
        fontWeight: 700,
        letterSpacing: '-0.02em',
        fontVariantNumeric: 'tabular-nums',
        flexShrink: 0,
        background: bg,
        color,
        border,
      }}
    >
      {fmtRate(reward)}
    </Box>
  )
}
