'use client'

import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import CheckIcon from '@mui/icons-material/Check'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import { brand } from '@/lib/theme'
import { truncate, tabularNums } from '@/lib/sx'
import { resolveCardDesign } from '@/utils/cardDesigns'
import {
  cardAnnualFee,
  cardAvailable,
  cardCapturedYTD,
  cardNet,
  cardPerksUsed,
  cardVerdict,
} from '@/utils/card'
import { fmtDollars, fmtMonthYear, fmtSigned } from '@/utils/format'
import { Dot, Eyebrow, ProgressBar, Row, Stack, StatusChip } from '@/components/ui'
import type { Card, VerdictKey } from '@/utils/types'

function verdictIcon(key: VerdictKey) {
  if (key === 'worthIt' || key === 'noFee') return <CheckIcon />
  if (key === 'reviewIt') return <WarningAmberIcon />
  return <AccessTimeIcon />
}

/* Right-aligned ledger column. Deliberately not `Stat` — that renders its value at
   statLg (22px); this ledger reads at 14px. */
function Col({ label, width = 96, children }: { label: string; width?: number; children: React.ReactNode }) {
  return (
    <Box sx={{ width, flexShrink: 0, textAlign: 'right' }}>
      <Typography
        sx={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: brand.zinc[400], whiteSpace: 'nowrap' }}
      >
        {label}
      </Typography>
      <Typography sx={{ ...tabularNums, mt: '4px', fontSize: 14, fontWeight: 600, color: brand.zinc[900] }}>
        {children}
      </Typography>
    </Box>
  )
}

/* One ledger row: who the card is, what it costs, what it grants, what you've used, and the verdict. */
function WalletCard({ card, onOpenCard }: { card: Card; onOpenCard?: (c: Card) => void }) {
  const verdict = cardVerdict(card)
  const net = cardNet(card)
  const available = cardAvailable(card)
  const captured = cardCapturedYTD(card)

  const meta = [
    card.lastFour && `•••• ${card.lastFour}`,
    card.openedDate && `since ${fmtMonthYear(card.openedDate)}`,
  ].filter(Boolean).join(' · ')

  return (
    <Paper
      variant="outlined"
      onClick={() => onOpenCard?.(card)}
      sx={{
        borderColor: brand.zinc[200],
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: onOpenCard ? 'pointer' : 'default',
        transition: 'box-shadow 180ms cubic-bezier(0.2,0.6,0.2,1), border-color 180ms cubic-bezier(0.2,0.6,0.2,1)',
        '&:hover': onOpenCard ? { borderColor: brand.zinc[300], boxShadow: brand.shadow.sm } : {},
      }}
    >
      <Row wrap gap="18px" sx={{ p: '15px 20px' }}>
        {/* Identity */}
        <Row min0 gap="11px" sx={{ flex: 1, minWidth: 200 }}>
          <Dot size={11} color={resolveCardDesign(card.design).color} />
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ ...truncate, fontSize: 15.5, fontWeight: 600, letterSpacing: '-0.01em', color: brand.zinc[900] }}>
              {card.name}
            </Typography>
            {meta && (
              <Typography sx={{ ...tabularNums, fontSize: 12, color: brand.zinc[500], mt: '1px', whiteSpace: 'nowrap' }}>
                {meta}
              </Typography>
            )}
          </Box>
        </Row>

        <Col label="Annual fee">
          <Box component="span" sx={{ fontWeight: 500, color: brand.zinc[500] }}>{fmtDollars(cardAnnualFee(card))}</Box>
        </Col>
        <Col label="Perk value">{fmtDollars(available)}</Col>
        <Col label="Used" width={116}>
          <Box component="span" sx={{ fontWeight: 500, color: brand.zinc[500] }}>
            {cardPerksUsed(card)}/{card.perks.length} · {fmtDollars(captured)}
          </Box>
        </Col>
        <Col label="Net">
          <Box component="span" sx={{ color: net < 0 ? brand.red[600] : brand.anchor[700] }}>{fmtSigned(net)}</Box>
        </Col>

        <Row justify="end" sx={{ width: 92, flexShrink: 0 }}>
          <StatusChip status={verdict.key} label={verdict.label} icon={verdictIcon(verdict.key)} />
        </Row>
      </Row>

      {/* Hairline capture bar, clipped to the row's rounded corners. */}
      <ProgressBar
        value={available ? captured / available : 0}
        track={brand.zinc[100]}
        sx={{ height: 4, borderRadius: 0 }}
      />
    </Paper>
  )
}

/* Oldest card first, by the date it was opened — not the order it was added to Anchor.
   Cards with no opened date have nothing to place them by, so they sink to the bottom. */
function byOpenedDate(a: Card, b: Card): number {
  if (!a.openedDate) return b.openedDate ? 1 : 0
  if (!b.openedDate) return -1
  return a.openedDate.localeCompare(b.openedDate)
}

/* The dashboard's "Your cards" section — one ledger row per card. */
export function WalletSection({ cards, onOpenCard }: { cards: Card[]; onOpenCard?: (c: Card) => void }) {
  if (cards.length === 0) return null
  const ordered = [...cards].sort(byOpenedDate)
  return (
    <Box sx={{ mb: '34px' }}>
      <Eyebrow sx={{ mb: '6px' }}>Your cards</Eyebrow>
      <Typography variant="body" sx={{ mb: '14px', color: brand.zinc[500] }}>
        When you opened each card, its last four digits, and how the annual fee stacks up against the perks you&rsquo;re actually using.
      </Typography>
      <Stack gap="14px">
        {ordered.map((c) => (
          <WalletCard key={c.id} card={c} onOpenCard={onOpenCard} />
        ))}
      </Stack>
    </Box>
  )
}
