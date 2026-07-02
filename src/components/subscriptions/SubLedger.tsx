'use client'

import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import Divider from '@mui/material/Divider'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined'
import PercentOutlinedIcon from '@mui/icons-material/PercentOutlined'
import PauseOutlinedIcon from '@mui/icons-material/PauseOutlined'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined'
import NotificationsOffOutlinedIcon from '@mui/icons-material/NotificationsOffOutlined'
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined'
import CallSplitOutlinedIcon from '@mui/icons-material/CallSplitOutlined'
import { brand } from '@/lib/theme'
import { Row, SurfaceCard, Eyebrow, CatGlyph } from '@/components/ui'
import { EditableMoney } from '@/components/ui'
import { EditableLabel } from '@/components/ui'
import { fmtMoney } from '@/utils/format'
import {
  grossNative, periodSuffix, fmtSubDate, nextCharge,
  SUB_CATEGORIES,
} from '@/data/subscriptionData'
import type { Subscription, SubCard } from '@/data/subscriptionData'

const COL_W = 100

export type GroupingMode = 'none' | 'cadence' | 'category'

interface LedgerHandlers {
  onSetCost: (id: string, cost: number) => void
  onRename: (id: string, name: string) => void
  onTogglePause: (id: string) => void
  onToggleCancelPending: (id: string) => void
  onToggleShared: (id: string) => void
  onRemove: (id: string) => void
}

// --- paused chip ---
function PausedChip() {
  return (
    <Chip
      size="small"
      icon={<PauseOutlinedIcon />}
      label="Paused"
      sx={{ height: 22, fontSize: 11.5, bgcolor: 'grey.100', color: 'grey.600', '& .MuiChip-icon': { fontSize: 12, ml: '6px', mr: '-2px' }, '& .MuiChip-label': { px: '8px' } }}
    />
  )
}

// --- cancel-pending chip ---
function CancelPendingChip() {
  return (
    <Chip
      size="small"
      icon={<NotificationsOffOutlinedIcon />}
      label="Cancel pending"
      sx={{
        height: 22, fontSize: 11.5,
        bgcolor: brand.red[50], color: brand.red[600],
        '& .MuiChip-icon': { fontSize: 12, ml: '6px', mr: '-2px', color: brand.red[500] },
        '& .MuiChip-label': { px: '8px' },
      }}
    />
  )
}

// --- shared (auto-split) chip ---
function SharedChip() {
  return (
    <Chip
      size="small"
      icon={<CallSplitOutlinedIcon />}
      label="Split"
      sx={{
        height: 22, fontSize: 11.5,
        bgcolor: brand.anchor[50], color: brand.anchor[700],
        '& .MuiChip-icon': { fontSize: 12, ml: '6px', mr: '-2px', color: brand.anchor[700] },
        '& .MuiChip-label': { px: '8px' },
      }}
    />
  )
}

// --- card pill ---
function CardPill({ cardId, cardMap }: { cardId: string; cardMap: Map<string, SubCard> }) {
  const card = cardMap.get(cardId)
  if (!card) return null
  return (
    <Box
      sx={{
        display: 'inline-flex', alignItems: 'center', gap: 0.75,
        height: 22, px: 1, borderRadius: 999,
        bgcolor: 'grey.100', color: 'grey.600', fontSize: 11.5, fontWeight: 500,
      }}
    >
      <CreditCardOutlinedIcon sx={{ fontSize: 13, color: 'grey.500' }} />
      {card.short}{' '}
      <Typography component="span" sx={{ fontVariantNumeric: 'tabular-nums', color: 'grey.500', fontSize: 'inherit' }}>
        ••{card.lastFour}
      </Typography>
    </Box>
  )
}

// --- overflow menu ---
function OverflowMenu({ sub, handlers }: { sub: Subscription; handlers: LedgerHandlers }) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  const paused = !!sub.paused
  const cancelPending = !!sub.cancelPending
  const shared = !!sub.shared

  return (
    <>
      <IconButton
        size="small"
        onClick={(e) => { e.stopPropagation(); setAnchor(e.currentTarget) }}
        sx={{ width: 28, height: 28, borderRadius: '8px', color: 'grey.500', '&:hover': { bgcolor: 'grey.100' } }}
      >
        <MoreHorizIcon sx={{ fontSize: 16 }} />
      </IconButton>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        slotProps={{ paper: { sx: { minWidth: 188, borderRadius: '12px', boxShadow: brand.shadow.lg, border: '1px solid', borderColor: 'divider', py: 0.75 } } }}
      >
        <MenuItem
          onClick={() => { setAnchor(null); handlers.onTogglePause(sub.id) }}
          sx={{ fontSize: 13.5, fontWeight: 500, gap: 1.25, py: 1 }}
        >
          <ListItemIcon sx={{ minWidth: 0, color: 'grey.500' }}>
            {paused ? <PlayArrowOutlinedIcon fontSize="small" /> : <PauseOutlinedIcon fontSize="small" />}
          </ListItemIcon>
          {paused ? 'Resume' : 'Pause'}
        </MenuItem>
        <MenuItem
          onClick={() => { setAnchor(null); handlers.onToggleShared(sub.id) }}
          sx={{ fontSize: 13.5, fontWeight: 500, gap: 1.25, py: 1 }}
        >
          <ListItemIcon sx={{ minWidth: 0, color: 'grey.500' }}>
            <CallSplitOutlinedIcon fontSize="small" />
          </ListItemIcon>
          {shared ? 'Stop splitting' : 'Split with partner'}
        </MenuItem>
        <MenuItem
          onClick={() => { setAnchor(null); handlers.onToggleCancelPending(sub.id) }}
          sx={{ fontSize: 13.5, fontWeight: 500, gap: 1.25, py: 1, color: cancelPending ? 'text.primary' : brand.red[600], '&:hover': { bgcolor: cancelPending ? 'grey.100' : brand.red[50] } }}
        >
          <ListItemIcon sx={{ minWidth: 0, color: cancelPending ? 'grey.500' : brand.red[500] }}>
            {cancelPending ? <NotificationsActiveOutlinedIcon fontSize="small" /> : <NotificationsOffOutlinedIcon fontSize="small" />}
          </ListItemIcon>
          {cancelPending ? 'Unmark cancellation' : 'Mark to cancel'}
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem
          onClick={() => { setAnchor(null); handlers.onRemove(sub.id) }}
          sx={{ fontSize: 13.5, fontWeight: 500, gap: 1.25, py: 1, color: brand.red[600], '&:hover': { bgcolor: brand.red[50] } }}
        >
          <ListItemIcon sx={{ minWidth: 0, color: brand.red[600] }}>
            <DeleteOutlineIcon fontSize="small" />
          </ListItemIcon>
          Delete
        </MenuItem>
      </Menu>
    </>
  )
}

// --- ledger row ---
function LedgerRow({ sub, last, handlers, cardMap }: { sub: Subscription; last: boolean; handlers: LedgerHandlers; cardMap: Map<string, SubCard> }) {
  const gross = grossNative(sub)
  const unit = periodSuffix(sub)
  const next = nextCharge(sub)
  const paused = !!sub.paused

  return (
    <Box
      sx={{
        display: 'flex', alignItems: 'center', gap: 1,
        px: 2.5, py: 1.5,
        borderBottom: last ? 'none' : '1px solid',
        borderColor: 'divider',
        opacity: paused ? 0.6 : 1,
        transition: 'opacity 0.15s ease',
      }}
    >
      {/* identity */}
      <Row gap={1.5} sx={{ flex: 1, minWidth: 0 }}>
        <CatGlyph icon={sub.icon} size={36} tone="neutral" />
        <Box sx={{ minWidth: 0 }}>
          <Row gap={1} sx={{ mb: 0.625, flexWrap: 'wrap' }}>
            <EditableLabel value={sub.name} onChange={(v) => handlers.onRename(sub.id, v)} weight={600} />
            {paused && <PausedChip />}
            {sub.cancelPending && <CancelPendingChip />}
            {sub.shared && <SharedChip />}
          </Row>
          <Row gap={1} sx={{ flexWrap: 'wrap' }}>
            <CardPill cardId={sub.cardId} cardMap={cardMap} />
            <Typography sx={{ fontSize: 11.5, color: 'grey.400' }}>
              {paused ? sub.plan : `Renews ${fmtSubDate(next)}`}
            </Typography>
            {sub.earns && (
              <Row gap={0.5} sx={{ fontSize: 11.5, color: 'grey.400' }}>
                <PercentOutlinedIcon sx={{ fontSize: 12 }} />
                {sub.earns}
              </Row>
            )}
          </Row>
        </Box>
      </Row>

      {/* cost — editable */}
      <Box sx={{ width: COL_W, display: 'flex', justifyContent: 'flex-end', alignItems: 'baseline', pr: 1 }}>
        <EditableMoney value={gross} onChange={(v) => handlers.onSetCost(sub.id, v)} color={paused ? 'grey.400' : undefined} />
        <Typography sx={{ fontSize: 11, fontWeight: 500, color: 'grey.400', ml: '1px' }}>{unit}</Typography>
      </Box>

      <OverflowMenu sub={sub} handlers={handlers} />
    </Box>
  )
}

// --- group header ---
function GroupHeader({
  label, icon, count, total, unit, collapsed, onToggle,
}: {
  label: string; icon: string; count: number; total: number; unit: string; collapsed: boolean; onToggle: () => void;
}) {
  return (
    <Box
      onClick={onToggle}
      sx={{
        display: 'flex', alignItems: 'center', gap: 1,
        px: 2.5, py: 1.25, cursor: 'pointer',
        bgcolor: 'grey.50', borderBottom: '1px solid', borderTop: '1px solid', borderColor: 'divider',
        '&:hover': { bgcolor: 'grey.100' }, transition: 'background 0.15s ease',
      }}
    >
      <ExpandMoreIcon
        sx={{
          fontSize: 16, color: 'grey.500', flexShrink: 0,
          transform: collapsed ? 'rotate(-90deg)' : 'none',
          transition: 'transform 0.15s ease',
        }}
      />
      <CatGlyph icon={icon} size={26} tone="neutral" />
      <Row sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'text.primary' }}>
          {label}
        </Typography>
        <Typography component="span" sx={{ ml: 1.125, fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', color: 'grey.400' }}>
          {count}
        </Typography>
      </Row>
      <Typography sx={{ fontSize: 13.5, fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: 'text.primary', flexShrink: 0 }}>
        {fmtMoney(total)}<Typography component="span" sx={{ fontSize: 11.5, fontWeight: 500, color: 'grey.400' }}>{unit}</Typography>
      </Typography>
    </Box>
  )
}

// --- col header ---
function ColHeader() {
  return (
    <Box
      sx={{
        display: 'flex', alignItems: 'center', gap: 1,
        px: 2.5, py: 1.375,
        borderBottom: '1px solid', borderColor: 'divider',
      }}
    >
      <Box sx={{ flex: 1 }}><Eyebrow sx={{ fontSize: '10px' }}>Subscription</Eyebrow></Box>
      <Box sx={{ width: COL_W, textAlign: 'right', pr: 1 }}><Eyebrow sx={{ fontSize: '10px' }}>Cost</Eyebrow></Box>
      <Box sx={{ width: 28 }} />
    </Box>
  )
}

// --- footer ---
function LedgerFooter({ total }: { total: number }) {
  return (
    <Box
      sx={{
        display: 'flex', alignItems: 'center', gap: 1,
        px: 2.5, py: 1.875,
        borderTop: '1px solid', borderColor: 'grey.300',
        bgcolor: 'grey.50',
      }}
    >
      <Typography sx={{ flex: 1, fontSize: 13, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'grey.600' }}>
        Total · per year
      </Typography>
      <Box sx={{ width: COL_W, textAlign: 'right', pr: 1 }}>
        <Typography sx={{ fontSize: 15, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{fmtMoney(total)}</Typography>
      </Box>
      <Box sx={{ width: 28 }} />
    </Box>
  )
}

// --- group math ---
function annualTotal(items: Subscription[]): number {
  let total = 0
  for (const s of items) {
    if (s.paused) continue
    total += s.cost * (
      s.period === 'monthly' ? 12 : s.period === 'quarterly' ? 4 : s.period === 'semiannual' ? 2 : 1
    )
  }
  return total
}

export function SubLedger({
  subs,
  grouping,
  handlers,
  cards,
}: {
  subs: Subscription[]
  grouping: GroupingMode
  handlers: LedgerHandlers
  cards: SubCard[]
}) {
  const cardMap = new Map(cards.map((c) => [c.id, c]))
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  const toggleGroup = (key: string) => setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }))

  const buildGroups = () => {
    if (grouping === 'cadence') {
      const defs = [
        { key: 'monthly', label: 'Monthly', icon: 'repeat' },
        { key: 'annual', label: 'Annual', icon: 'calendar' },
      ]
      return defs
        .map((g) => ({ ...g, items: subs.filter((s) => (s.period === 'annual' ? 'annual' : 'monthly') === g.key) }))
        .filter((g) => g.items.length > 0)
    }
    return SUB_CATEGORIES
      .map((c) => ({ key: c.key, label: c.label, icon: c.icon, items: subs.filter((s) => s.cat === c.key) }))
      .filter((g) => g.items.length > 0)
  }

  return (
    <SurfaceCard sx={{ overflow: 'hidden' }}>
      <ColHeader />
      {grouping === 'none' ? (
        subs.map((s, i) => (
          <LedgerRow key={s.id} sub={s} last={i === subs.length - 1} handlers={handlers} cardMap={cardMap} />
        ))
      ) : (
        buildGroups().map((g) => {
          const isCollapsed = collapsed[g.key] ?? false
          return (
            <Box key={g.key}>
              <GroupHeader
                label={g.label} icon={g.icon} count={g.items.length}
                total={annualTotal(g.items)} unit="/yr"
                collapsed={isCollapsed} onToggle={() => toggleGroup(g.key)}
              />
              {!isCollapsed && g.items.map((s, i) => (
                <LedgerRow key={s.id} sub={s} last={i === g.items.length - 1} handlers={handlers} cardMap={cardMap} />
              ))}
            </Box>
          )
        })
      )}
      <LedgerFooter total={annualTotal(subs)} />
    </SurfaceCard>
  )
}
