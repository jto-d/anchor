'use client'

import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import CheckIcon from '@mui/icons-material/Check'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import { brand } from '@/lib/theme'
import { resolveCardDesign } from '@/utils/cardDesigns'
import { cardAvailable, cardAnnualFee, cardNet, cardVerdict } from '@/utils/card'
import { fmtDollars, fmtSigned } from '@/utils/format'
import { StatusChip } from '@/components/ui/StatusChip'
import { Eyebrow } from '@/components/ui/Eyebrow'
import type { Card, VerdictKey } from '@/utils/types'

function walletTotals(cards: Card[]) {
  const fees = cards.reduce((s, c) => s + cardAnnualFee(c), 0)
  const avail = cards.reduce((s, c) => s + cardAvailable(c), 0)
  return { fees, avail, net: avail - fees }
}

function verdictIcon(key: VerdictKey) {
  if (key === 'worthIt') return <CheckIcon />
  if (key === 'reviewIt') return <WarningAmberIcon />
  return <AccessTimeIcon />
}

function dotColor(card: Card): string {
  const design = resolveCardDesign(card.design)
  const match = design.gradient.match(/#[0-9A-Fa-f]{6}/)
  return match ? match[0] : '#27272A'
}

/* Three-column fee/value/net summary — placed inside the headline Paper. */
export function SummaryFigures({ cards, tone = 'panel' }: { cards: Card[]; tone?: 'panel' | 'headline' }) {
  const { fees, avail, net } = walletTotals(cards)
  const onAccent = tone === 'headline'
  const labelColor = onAccent ? brand.anchor[700] : brand.zinc[500]
  const valueColor = onAccent ? brand.anchor[800] : brand.zinc[900]
  const dividerColor = onAccent ? 'rgba(11,99,96,0.18)' : brand.zinc[200]

  const items = [
    { label: 'Annual fees', value: fmtDollars(fees), color: valueColor },
    { label: 'Perk value / yr', value: fmtDollars(avail), color: valueColor },
    { label: 'Net value', value: fmtSigned(net), color: net < 0 ? brand.red[600] : brand.anchor[700] },
  ]

  return (
    <Box sx={{ display: 'flex' }}>
      {items.map((it, i) => (
        <Box
          key={it.label}
          sx={{
            flex: 1,
            pl: i ? '22px' : 0,
            ml: i ? '22px' : 0,
            borderLeft: i ? `1px solid ${dividerColor}` : 'none',
          }}
        >
          <Typography sx={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: labelColor }}>
            {it.label}
          </Typography>
          <Typography sx={{ fontSize: onAccent ? 22 : 26, fontWeight: 600, letterSpacing: '-0.025em', fontVariantNumeric: 'tabular-nums', mt: 1, lineHeight: 1, color: it.color }}>
            {it.value}
          </Typography>
        </Box>
      ))}
    </Box>
  )
}

/* Per-card row in the breakdown list. */
function ValueListRow({ card, onOpenCard, last }: { card: Card; onOpenCard?: (c: Card) => void; last: boolean }) {
  const verdict = cardVerdict(card)
  const net = cardNet(card)

  const Fig = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <Box sx={{ textAlign: 'right', width: 96, flexShrink: 0 }}>
      <Typography sx={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: brand.zinc[400] }}>
        {label}
      </Typography>
      <Box sx={{ mt: '4px', fontVariantNumeric: 'tabular-nums' }}>{children}</Box>
    </Box>
  )

  return (
    <Box
      onClick={() => onOpenCard?.(card)}
      sx={{
        display: 'flex', alignItems: 'center', gap: '14px',
        py: '15px', px: '6px',
        borderBottom: last ? 'none' : `1px solid ${brand.zinc[100]}`,
        cursor: onOpenCard ? 'pointer' : 'default',
        borderRadius: '10px',
        mx: '-6px',
        transition: 'background 150ms ease',
        '&:hover': onOpenCard ? { bgcolor: brand.zinc[50] } : {},
      }}
    >
      {/* Dot + name */}
      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Box sx={{ width: 8, height: 8, borderRadius: '999px', bgcolor: dotColor(card), flexShrink: 0 }} />
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.01em', color: brand.zinc[900], whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {card.name}
          </Typography>
          <Typography sx={{ fontSize: 12, color: brand.zinc[500] }}>{card.issuer}</Typography>
        </Box>
      </Box>

      <Fig label="Fee">
        <Typography sx={{ fontSize: 14, fontWeight: 500, color: brand.zinc[500] }}>{fmtDollars(cardAnnualFee(card))}</Typography>
      </Fig>
      <Fig label="Perk value">
        <Typography sx={{ fontSize: 14, fontWeight: 500, color: brand.zinc[800] }}>{fmtDollars(cardAvailable(card))}</Typography>
      </Fig>
      <Fig label="Net">
        <Typography sx={{ fontSize: 14, fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: net < 0 ? brand.red[600] : brand.anchor[700] }}>
          {fmtSigned(net)}
        </Typography>
      </Fig>
      <Box sx={{ width: 96, flexShrink: 0, display: 'flex', justifyContent: 'flex-end' }}>
        <StatusChip status={verdict.key} label={verdict.label} icon={verdictIcon(verdict.key)} />
      </Box>
    </Box>
  )
}

/* Full "Card value" section: eyebrow + description + per-card list. */
export function CardValueSection({ cards, onOpenCard }: { cards: Card[]; onOpenCard?: (c: Card) => void }) {
  if (cards.length === 0) return null
  return (
    <Box sx={{ mb: '34px' }}>
      <Eyebrow sx={{ mb: '6px' }}>Card value</Eyebrow>
      <Typography sx={{ mb: '14px', fontSize: 13, color: brand.zinc[500] }}>
        What each card costs in fees versus the perk value it puts on the table.
      </Typography>
      <Paper variant="outlined" sx={{ borderColor: brand.zinc[200], borderRadius: '14px', px: 2, py: '4px' }}>
        {cards.map((c, i) => (
          <ValueListRow key={c.id} card={c} onOpenCard={onOpenCard} last={i === cards.length - 1} />
        ))}
      </Paper>
    </Box>
  )
}
