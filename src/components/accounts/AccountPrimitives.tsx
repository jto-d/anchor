'use client'

import { useState, useRef, useEffect } from 'react'
import Box from '@mui/material/Box'
import MuiButton from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import Typography from '@mui/material/Typography'
import LinkIcon from '@mui/icons-material/LinkOutlined'
import EditIcon from '@mui/icons-material/EditOutlined'
import MoreHorizIcon from '@mui/icons-material/MoreHorizOutlined'
import TrendingUpIcon from '@mui/icons-material/TrendingUpOutlined'
import TrendingDownIcon from '@mui/icons-material/TrendingDownOutlined'
import { brand } from '@/lib/theme'
import { fmtMoney, fmtSigned, type AssetClass, ASSET_CLASSES } from '@/data/accountData'

// ─── Money ──────────────────────────────────────────────────────────────────

interface MoneyProps {
  value: number
  cents?: boolean
  size?: number
  weight?: number
  color?: string
  privacy?: boolean
  emphasis?: boolean
  signed?: boolean
}

export function Money({ value, cents, size = 14, weight = 500, color, privacy, emphasis, signed }: MoneyProps) {
  const str = signed ? fmtSigned(value, cents) : fmtMoney(value, cents)
  const masked = privacy ? str.replace(/[0-9]/g, '•') : str
  const c = color ?? (emphasis ? brand.anchor[700] : 'inherit')
  return (
    <Box
      component="span"
      sx={{
        fontVariantNumeric: 'tabular-nums',
        fontSize: size,
        fontWeight: weight,
        letterSpacing: '-0.01em',
        color: c,
        filter: privacy ? 'blur(5px)' : 'none',
        transition: 'filter 180ms ease',
        userSelect: privacy ? 'none' : 'auto',
      }}
    >
      {masked}
    </Box>
  )
}

// ─── Sparkline ───────────────────────────────────────────────────────────────

export function Sparkline({
  data,
  width = 72,
  height = 22,
  color = brand.anchor[500],
  strokeWidth = 1.8,
}: {
  data: number[]
  width?: number
  height?: number
  color?: string
  strokeWidth?: number
}) {
  if (!data || data.length < 2) return <Box sx={{ width, height }} />
  const min = Math.min(...data), max = Math.max(...data)
  const span = max - min || 1
  const X = (i: number) => (i / (data.length - 1)) * width
  const Y = (v: number) => height - ((v - min) / span) * (height - 4) - 2
  const line = data.map((v, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)} ${Y(v).toFixed(1)}`).join(' ')
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      style={{ display: 'block', overflow: 'visible' }}
    >
      <path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        vectorEffect="non-scaling-stroke"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}

// ─── AreaChart ────────────────────────────────────────────────────────────────

export function AreaChart({
  data,
  width = 760,
  height = 150,
  id = 'a',
  showGrid = true,
}: {
  data: number[]
  width?: number
  height?: number
  id?: string
  showGrid?: boolean
}) {
  if (!data || data.length < 2) return null
  const min = Math.min(...data) * 0.985
  const max = Math.max(...data) * 1.012
  const span = max - min || 1
  const X = (i: number) => (i / (data.length - 1)) * width
  const Y = (v: number) => height - ((v - min) / span) * height
  const line = data.map((v, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)} ${Y(v).toFixed(1)}`).join(' ')
  const area = `${line} L${width} ${height} L0 ${height} Z`
  const lastX = X(data.length - 1)
  const lastY = Y(data[data.length - 1])
  const gridLines = [0.33, 0.66, 1]
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height={height}
      preserveAspectRatio="none"
      style={{ display: 'block', overflow: 'visible' }}
    >
      <defs>
        <linearGradient id={`grad_${id}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={brand.anchor[500]} stopOpacity="0.16" />
          <stop offset="1" stopColor={brand.anchor[500]} stopOpacity="0.01" />
        </linearGradient>
      </defs>
      {showGrid && gridLines.map((g) => (
        <line
          key={g}
          x1="0" x2={width}
          y1={(height * g).toFixed(1)} y2={(height * g).toFixed(1)}
          stroke={brand.zinc[200]} strokeWidth="1" vectorEffect="non-scaling-stroke"
        />
      ))}
      <path d={area} fill={`url(#grad_${id})`} />
      <path
        d={line} fill="none"
        stroke={brand.anchor[700]} strokeWidth="2.5"
        vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round"
      />
      <circle
        cx={lastX.toFixed(1)} cy={lastY.toFixed(1)}
        r="4" fill={brand.anchor[700]} stroke="#fff" strokeWidth="2"
      />
    </svg>
  )
}

// ─── Donut ────────────────────────────────────────────────────────────────────

export function Donut({
  segments,
  size = 132,
  thickness = 20,
  centerTop,
  centerBottom,
}: {
  segments: { label: string; color: string; value: number }[]
  size?: number
  thickness?: number
  centerTop?: string
  centerBottom?: string
}) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1
  let acc = 0
  const stops = segments
    .map((seg) => {
      const start = (acc / total) * 360
      acc += seg.value
      const end = (acc / total) * 360
      return `${seg.color} ${start.toFixed(2)}deg ${end.toFixed(2)}deg`
    })
    .join(', ')
  return (
    <Box
      sx={{
        position: 'relative',
        width: size,
        height: size,
        borderRadius: '999px',
        background: `conic-gradient(${stops})`,
        flexShrink: 0,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: thickness,
          borderRadius: '999px',
          bgcolor: '#fff',
          display: 'grid',
          placeItems: 'center',
          textAlign: 'center',
          boxShadow: `inset 0 0 0 1px ${brand.zinc[100]}`,
        }}
      >
        <Box>
          {centerTop && (
            <Typography sx={{ fontSize: 10.5, color: 'text.disabled', fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase' }}>
              {centerTop}
            </Typography>
          )}
          {centerBottom && (
            <Typography sx={{ fontSize: 16, fontWeight: 600, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em', mt: '2px' }}>
              {centerBottom}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  )
}

// ─── SourceBadge ─────────────────────────────────────────────────────────────

export function SourceBadge({ source }: { source: 'PLAID' | 'MANUAL' }) {
  const linked = source === 'PLAID'
  return (
    <Box
      component="span"
      title={linked ? 'Linked via Plaid · syncs on refresh' : 'Manually tracked'}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        height: 21,
        px: '8px',
        borderRadius: '999px',
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '-0.005em',
        bgcolor: linked ? brand.accentSoft : brand.zinc[100],
        color: linked ? brand.anchor[700] : brand.zinc[500],
        flexShrink: 0,
      }}
    >
      {linked
        ? <LinkIcon sx={{ fontSize: 11 }} />
        : <EditIcon sx={{ fontSize: 11 }} />}
      {linked ? 'Linked' : 'Manual'}
    </Box>
  )
}

// ─── DeltaChip ───────────────────────────────────────────────────────────────

export function DeltaChip({ delta, label }: { delta: number; label?: string }) {
  const up = delta >= 0
  const color = up ? brand.anchor[600] : brand.red[600]
  const bg = up ? brand.accentSoft : brand.red[50]
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: 13,
        fontWeight: 600,
        color,
        bgcolor: bg,
        px: '9px',
        py: '3px',
        borderRadius: '999px',
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {up
        ? <TrendingUpIcon sx={{ fontSize: 14 }} />
        : <TrendingDownIcon sx={{ fontSize: 14 }} />}
      {fmtMoney(Math.abs(delta))}
      {label && <Box component="span" sx={{ fontWeight: 400, color: 'text.disabled', ml: '2px' }}>{label}</Box>}
    </Box>
  )
}

// ─── OverflowMenu ─────────────────────────────────────────────────────────────

export interface OverflowMenuItem {
  key: string
  label: string
  icon?: React.ElementType
  danger?: boolean
}

export function OverflowMenu({
  items,
  onAction,
}: {
  items: OverflowMenuItem[]
  onAction: (key: string) => void
}) {
  const [anchor, setAnchor] = useState<null | HTMLElement>(null)
  return (
    <Box component="span" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
      <Box
        component="button"
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => setAnchor(e.currentTarget)}
        title="Manage"
        sx={{
          width: 30, height: 30, display: 'grid', placeItems: 'center',
          cursor: 'pointer', borderRadius: '8px', border: '1px solid transparent',
          bgcolor: 'transparent', color: 'text.disabled',
          transition: 'background 120ms ease',
          '&:hover': { bgcolor: brand.zinc[100], color: 'text.secondary' },
        }}
      >
        <MoreHorizIcon sx={{ fontSize: 16 }} />
      </Box>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        slotProps={{ paper: { sx: { borderRadius: '12px', minWidth: 176, boxShadow: brand.shadow.lg } } }}
      >
        {items.map((it) => {
          const Icon = it.icon
          return (
            <MenuItem
              key={it.key}
              onClick={() => { setAnchor(null); onAction(it.key) }}
              sx={{
                fontSize: 13.5,
                fontWeight: 500,
                gap: 1.25,
                borderRadius: '8px',
                mx: '4px',
                color: it.danger ? 'error.main' : 'text.primary',
                '&:hover': { bgcolor: it.danger ? brand.red[50] : brand.zinc[50] },
              }}
            >
              {Icon && <Icon sx={{ fontSize: 15, color: it.danger ? 'error.main' : 'text.disabled' }} />}
              {it.label}
            </MenuItem>
          )
        })}
      </Menu>
    </Box>
  )
}

// ─── HoldingsDetail ──────────────────────────────────────────────────────────

export function HoldingsDetail({
  account,
  holdings,
  privacy,
}: {
  account: { inst: string; source: 'PLAID' | 'MANUAL' }
  holdings: import('@/data/accountData').Holding[] | undefined
  privacy: boolean
}) {
  if (!holdings || holdings.length === 0) {
    return (
      <Box sx={{ p: '18px 22px 22px', bgcolor: 'background.default', borderTop: '1px solid', borderColor: 'divider' }}>
        <Typography sx={{ fontSize: 12.5, color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1 }}>
          Manual accounts track balance only. Link {account.inst} with Plaid to see holdings.
        </Typography>
      </Box>
    )
  }
  const total = holdings.reduce((s, h) => s + h.value, 0)
  const byClass: Record<string, number> = {}
  holdings.forEach((h) => { byClass[h.cls] = (byClass[h.cls] ?? 0) + h.value })
  const segments = (Object.keys(ASSET_CLASSES) as AssetClass[])
    .filter((k) => byClass[k])
    .map((k) => ({ key: k, label: ASSET_CLASSES[k].label, color: ASSET_CLASSES[k].color, value: byClass[k] }))
  const sorted = [...holdings].sort((a, b) => b.value - a.value)

  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        borderTop: '1px solid',
        borderColor: 'divider',
        display: 'grid',
        gridTemplateColumns: '232px minmax(0,1fr)',
      }}
    >
      {/* allocation */}
      <Box sx={{ p: '22px 20px', borderRight: '1px solid', borderColor: 'divider', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '18px' }}>
        <Donut
          segments={segments}
          size={132}
          thickness={21}
          centerTop="Holdings"
          centerBottom={privacy ? '••••' : `$${Math.round(total / 1000)}k`}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '9px', width: '100%' }}>
          {segments.map((s) => (
            <Box key={s.key} sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: 12 }}>
              <Box sx={{ width: 9, height: 9, borderRadius: '3px', bgcolor: s.color, flexShrink: 0 }} />
              <Box sx={{ flex: 1, color: 'text.secondary', whiteSpace: 'nowrap', fontSize: 12 }}>{s.label}</Box>
              <Box sx={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums', fontSize: 12 }}>
                {Math.round((s.value / total) * 100)}%
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* holdings list */}
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', px: '22px', py: '10px', borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography sx={{ flex: 1, fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'text.disabled' }}>Holding</Typography>
          <Typography sx={{ width: 92, textAlign: 'right', fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'text.disabled' }}>Shares</Typography>
          <Typography sx={{ width: 110, textAlign: 'right', fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'text.disabled' }}>Value</Typography>
        </Box>
        {sorted.map((h, i) => (
          <Box
            key={h.ticker}
            sx={{
              display: 'flex', alignItems: 'center', px: '22px', py: '11px',
              borderBottom: i < sorted.length - 1 ? '1px solid' : 'none',
              borderColor: 'divider',
            }}
          >
            <Box sx={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: '11px' }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '2px', bgcolor: ASSET_CLASSES[h.cls].color, flexShrink: 0 }} />
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontSize: 13, fontWeight: 600, letterSpacing: '-0.005em' }}>{h.ticker}</Typography>
                <Typography noWrap sx={{ fontSize: 11, color: 'text.disabled' }}>{h.name}</Typography>
              </Box>
            </Box>
            <Box sx={{ width: 92, textAlign: 'right', fontSize: 12.5, color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
              {h.shares != null ? h.shares.toLocaleString('en-US') : '—'}
            </Box>
            <Box sx={{ width: 110, textAlign: 'right' }}>
              <Money value={h.value} size={13} weight={600} privacy={privacy} />
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
