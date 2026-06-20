'use client'

import Box from '@mui/material/Box'
import CardActionArea from '@mui/material/CardActionArea'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'
import AnchorIcon from '@mui/icons-material/Anchor'
import { brand } from '@/lib/theme'
import { Dot, ProgressBar, Row } from '@/components/ui'
import { truncate, tabularNums } from '@/lib/sx'
import { resolveCardDesign } from '@/utils/cardDesigns'
import { cardCapturedYTD, cardAvailable, cardNet, cardVerdict } from '@/utils/card'
import { fmtDollars, fmtSigned } from '@/utils/format'
import type { Card } from '@/utils/types'

const VERDICT_DOT: Record<string, string> = {
  worthIt: '#5BC1C0',
  marginal: '#F0B23E',
  reviewIt: '#F2777C',
  noFee: '#A1A1AA',
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
      <Row justify="between" gap={1} sx={{ mb: '18px' }}>
        <Row gap="7px" min0>
          <AnchorIcon sx={{ fontSize: 14, opacity: 0.85, flexShrink: 0 }} />
          <Typography
            sx={{ ...truncate, fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', opacity: 0.8, textTransform: 'uppercase' }}
          >
            {card.issuer}
          </Typography>
        </Row>
        <Row
          component="span"
          inline
          gap="5px"
          sx={{
            flexShrink: 0,
            height: '22px', px: '9px', borderRadius: '999px',
            background: 'rgba(255,255,255,0.13)', border: '1px solid rgba(255,255,255,0.16)',
            ...tabularNums,
            fontSize: '11px', fontWeight: 600, letterSpacing: '-0.005em',
            color: '#fff', backdropFilter: 'blur(2px)',
            whiteSpace: 'nowrap',
          }}
        >
          <Dot size={6} color={VERDICT_DOT[verdict.key]} />
          {fmtSigned(net)}<Box component="span" sx={{ opacity: 0.65, fontWeight: 500 }}>/yr</Box>
        </Row>
      </Row>
      <Typography sx={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em' }}>{card.name}</Typography>
      {(card.lastFour || card.openedDate) && (
        <Typography
          sx={{ ...tabularNums, fontSize: 12, letterSpacing: '0.12em', opacity: 0.8, mt: '3px' }}
        >
          {card.lastFour ? `•••• •••• •••• ${card.lastFour}` : ''}
          {card.lastFour && card.openedDate ? '  ·  ' : ''}
          {card.openedDate ? `Opened ${new Date(card.openedDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}` : ''}
        </Typography>
      )}
      <Box sx={{ mt: 2 }}>
        <ProgressBar value={pct} color={design.text} track={alpha(design.text, 0.22)} thin />
        <Row justify="between" align="end" sx={{ mt: 1.25 }}>
          <Box>
            <Typography sx={{ fontSize: 10, opacity: 0.65, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Recovered
            </Typography>
            <Typography sx={{ ...tabularNums, fontSize: 16, fontWeight: 600, mt: '2px' }}>
              {fmtDollars(captured)}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography sx={{ fontSize: 10, opacity: 0.65, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Available
            </Typography>
            <Typography sx={{ ...tabularNums, fontSize: 16, fontWeight: 600, mt: '2px' }}>
              {fmtDollars(available)}
            </Typography>
          </Box>
        </Row>
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
