'use client'

import Box from '@mui/material/Box'
import CardActionArea from '@mui/material/CardActionArea'
import LinearProgress from '@mui/material/LinearProgress'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'
import AnchorIcon from '@mui/icons-material/Anchor'
import { brand } from '@/lib/theme'
import { resolveCardDesign } from '@/utils/cardDesigns'
import { cardCapturedYTD, cardAvailable, cardNet, cardVerdict } from '@/utils/card'
import { fmtDollars, fmtSigned } from '@/utils/format'
import type { Card } from '@/utils/types'

const VERDICT_DOT: Record<string, string> = {
  worthIt: '#5BC1C0',
  marginal: '#F0B23E',
  reviewIt: '#F2777C',
}

interface CardTileProps {
  card: Card
  onOpen?: (card: Card) => void
}

export function CardTile({ card, onOpen }: CardTileProps) {
  const captured = cardCapturedYTD(card)
  const available = cardAvailable(card)
  const pct = available ? Math.min(1, captured / available) : 0
  const design = resolveCardDesign(card.design)
  const net = cardNet(card)
  const verdict = cardVerdict(card)

  const content = (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, mb: '18px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '7px', minWidth: 0 }}>
          <AnchorIcon sx={{ fontSize: 14, opacity: 0.85, flexShrink: 0 }} />
          <Typography
            sx={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', opacity: 0.8, textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            {card.issuer}
          </Typography>
        </Box>
        <Box
          component="span"
          sx={{
            display: 'inline-flex', alignItems: 'center', gap: '5px', flexShrink: 0,
            height: '22px', px: '9px', borderRadius: '999px',
            background: 'rgba(255,255,255,0.13)', border: '1px solid rgba(255,255,255,0.16)',
            fontSize: '11px', fontWeight: 600, letterSpacing: '-0.005em',
            fontVariantNumeric: 'tabular-nums', color: '#fff', backdropFilter: 'blur(2px)',
            whiteSpace: 'nowrap',
          }}
        >
          <Box component="span" sx={{ width: 6, height: 6, borderRadius: '999px', bgcolor: VERDICT_DOT[verdict.key], flexShrink: 0 }} />
          {fmtSigned(net)}<Box component="span" sx={{ opacity: 0.65, fontWeight: 500 }}>/yr</Box>
        </Box>
      </Box>
      <Typography sx={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em' }}>{card.name}</Typography>
      {(card.lastFour || card.openedDate) && (
        <Typography
          sx={{ fontSize: 12, fontVariantNumeric: 'tabular-nums', letterSpacing: '0.12em', opacity: 0.8, mt: '3px' }}
        >
          {card.lastFour ? `•••• •••• •••• ${card.lastFour}` : ''}
          {card.lastFour && card.openedDate ? '  ·  ' : ''}
          {card.openedDate ? `Opened ${new Date(card.openedDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}` : ''}
        </Typography>
      )}
      <Box sx={{ mt: 2 }}>
        <LinearProgress
          variant="determinate"
          value={pct * 100}
          sx={{ height: 5, bgcolor: alpha(design.text, 0.22), '& .MuiLinearProgress-bar': { bgcolor: design.text } }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mt: 1.25 }}>
          <Box>
            <Typography sx={{ fontSize: 10, opacity: 0.65, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Recovered
            </Typography>
            <Typography sx={{ fontSize: 16, fontWeight: 600, fontVariantNumeric: 'tabular-nums', mt: '2px' }}>
              {fmtDollars(captured)}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography sx={{ fontSize: 10, opacity: 0.65, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Available
            </Typography>
            <Typography sx={{ fontSize: 16, fontWeight: 600, fontVariantNumeric: 'tabular-nums', mt: '2px' }}>
              {fmtDollars(available)}
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  )

  const surfaceSx = {
    width: 312,
    color: design.text,
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '16px',
    background: design.gradient,
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
