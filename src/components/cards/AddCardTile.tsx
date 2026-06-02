'use client'

import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { RewardIcon } from './RewardIcon'
import { brand } from '@/lib/theme'

interface AddCardTileProps {
  onClick: () => void
  dense?: boolean
}

export function AddCardTile({ onClick, dense }: AddCardTileProps) {
  const [hover, setHover] = useState(false)

  return (
    <Box
      component="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      sx={{
        border: `1.5px dashed ${hover ? brand.anchor[700] : brand.zinc[300]}`,
        borderRadius: '14px',
        background: hover ? brand.accentSoft : 'transparent',
        cursor: 'pointer',
        minHeight: dense ? '220px' : '260px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        fontFamily: 'inherit',
        transition: 'background 180ms ease, border-color 180ms ease',
        width: '100%',
      }}
    >
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: '999px',
          display: 'grid',
          placeItems: 'center',
          background: hover ? brand.anchor[700] : brand.zinc[100],
          color: hover ? '#fff' : brand.zinc[500],
          transition: 'background 180ms ease, color 180ms ease',
        }}
      >
        <RewardIcon name="plus" size={22} strokeWidth={2} />
      </Box>
      <Typography
        sx={{
          fontSize: '14px',
          fontWeight: 600,
          color: hover ? brand.anchor[700] : 'text.secondary',
          whiteSpace: 'nowrap',
        }}
      >
        Add a card
      </Typography>
      <Typography
        sx={{
          fontSize: '12px',
          color: brand.zinc[400],
          maxWidth: '180px',
          textAlign: 'center',
          lineHeight: 1.4,
        }}
      >
        Name, last 4, issuer & reward categories
      </Typography>
    </Box>
  )
}
