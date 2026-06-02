'use client'

import Box from '@mui/material/Box'
import { RewardIcon } from './RewardIcon'
import { brand } from '@/lib/theme'
import type { Category } from '@/data/cardRewards'

interface CatIconProps {
  cat: Category
  size?: number
  active?: boolean
  dark?: boolean
}

export function CatIcon({ cat, size = 34, active, dark }: CatIconProps) {
  const inner = Math.round(size * 0.52)
  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: `${Math.round(size * 0.3)}px`,
        flexShrink: 0,
        display: 'grid',
        placeItems: 'center',
        background: active ? brand.anchor[700] : dark ? 'rgba(255,255,255,0.12)' : brand.zinc[100],
        color: active ? '#fff' : dark ? '#fff' : brand.zinc[600],
        transition: 'background 180ms ease, color 180ms ease',
      }}
    >
      <RewardIcon name={cat.icon} size={inner} strokeWidth={1.8} />
    </Box>
  )
}
