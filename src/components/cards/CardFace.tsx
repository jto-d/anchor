'use client'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import AnchorIcon from '@mui/icons-material/Anchor'
import { themeOf } from '@/data/cardRewards'
import type { RewardCardData } from '@/data/cardRewards'

interface CardFaceProps {
  card: RewardCardData
  mini?: boolean
}

export function CardFace({ card, mini = false }: CardFaceProps) {
  const th = themeOf(card)
  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        color: '#fff',
        background: th.grad,
        borderRadius: mini ? '12px' : '16px',
        p: mini ? '14px 16px' : '18px 20px',
      }}
    >
      <AnchorIcon
        sx={{
          position: 'absolute',
          top: mini ? '13px' : '16px',
          right: mini ? '14px' : '18px',
          fontSize: mini ? 16 : 20,
          opacity: 0.9,
        }}
      />
      <Typography
        sx={{
          fontSize: mini ? 10 : 12,
          fontWeight: 600,
          letterSpacing: '0.06em',
          opacity: 0.82,
          textTransform: 'uppercase',
        }}
      >
        {card.issuer}
      </Typography>
      <Typography
        sx={{
          fontSize: mini ? 16 : 19,
          fontWeight: 600,
          letterSpacing: '-0.01em',
          mt: mini ? '14px' : '26px',
        }}
      >
        {card.name}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: mini ? '3px' : '6px' }}>
        <Typography sx={{ fontSize: mini ? 11.5 : 13, fontVariantNumeric: 'tabular-nums', letterSpacing: '0.1em', opacity: 0.78 }}>
          •••• {card.lastFour}
        </Typography>
        <Typography sx={{ fontSize: mini ? 10 : 11, opacity: 0.7, letterSpacing: '0.02em' }}>
          {card.network}
        </Typography>
      </Box>
    </Box>
  )
}
