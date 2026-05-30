'use client'

import Box from '@mui/material/Box'
import CardActionArea from '@mui/material/CardActionArea'
import LinearProgress from '@mui/material/LinearProgress'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import AnchorIcon from '@mui/icons-material/Anchor'
import { brand } from '@/lib/theme'
import { cardCaptured, cardAvailable, cardTheme } from '@/utils/card'
import { fmt } from '@/utils/format'
import type { Card } from '@/utils/types'

interface CardTileProps {
  card: Card
  onOpen?: (card: Card) => void
  compact?: boolean
}

export function CardTile({ card, onOpen, compact }: CardTileProps) {
  const captured = cardCaptured(card)
  const available = cardAvailable(card)
  const pct = available ? Math.min(1, captured / available) : 0
  const theme = cardTheme(card.issuer)

  const content = (
    <>
      <AnchorIcon sx={{ position: 'absolute', top: 16, right: 17, fontSize: 19, opacity: 0.9 }} />
      <Typography
        sx={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', opacity: 0.75, textTransform: 'uppercase' }}
      >
        {card.issuer}
      </Typography>
      <Typography sx={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em', mt: 3 }}>{card.name}</Typography>
      {card.lastFour && (
        <Typography
          sx={{ fontSize: 12, fontVariantNumeric: 'tabular-nums', letterSpacing: '0.12em', opacity: 0.8, mt: '3px' }}
        >
          •••• •••• •••• {card.lastFour}
        </Typography>
      )}
      <Box sx={{ mt: 2 }}>
        <LinearProgress
          variant="determinate"
          value={pct * 100}
          sx={{ height: 5, bgcolor: 'rgba(255,255,255,0.22)', '& .MuiLinearProgress-bar': { bgcolor: '#fff' } }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mt: 1.25 }}>
          <Box>
            <Typography sx={{ fontSize: 10, opacity: 0.65, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Recovered
            </Typography>
            <Typography sx={{ fontSize: 16, fontWeight: 600, fontVariantNumeric: 'tabular-nums', mt: '2px' }}>
              {fmt(captured)}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography sx={{ fontSize: 10, opacity: 0.65, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Available
            </Typography>
            <Typography sx={{ fontSize: 16, fontWeight: 600, fontVariantNumeric: 'tabular-nums', mt: '2px' }}>
              {fmt(available)}
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  )

  const surfaceSx = {
    width: compact ? 290 : 'auto',
    color: '#fff',
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '16px',
    background: brand.cardGradient[theme],
    boxShadow: brand.shadow.md,
  } as const

  if (onOpen) {
    return (
      <Paper
        sx={{
          ...surfaceSx,
          transition: 'transform 180ms, box-shadow 180ms',
          '&:hover': { transform: 'translateY(-2px)', boxShadow: brand.shadow.lg },
        }}
      >
        <CardActionArea onClick={() => onOpen(card)} sx={{ p: '18px 20px' }}>
          {content}
        </CardActionArea>
      </Paper>
    )
  }

  return <Paper sx={{ ...surfaceSx, p: '18px 20px' }}>{content}</Paper>
}
