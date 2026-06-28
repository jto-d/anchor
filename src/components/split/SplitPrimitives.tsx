'use client'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import HomeIcon from '@mui/icons-material/Home'
import BoltIcon from '@mui/icons-material/Bolt'
import WifiIcon from '@mui/icons-material/Wifi'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import MovieIcon from '@mui/icons-material/Movie'
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff'
import ReceiptIcon from '@mui/icons-material/Receipt'
import CheckIcon from '@mui/icons-material/Check'
import { brand } from '@/lib/theme'
import type { BalanceStatus } from '@/data/splitData'

const CAT_ICONS: Record<string, React.ElementType> = {
  groceries: ShoppingCartIcon,
  dining: RestaurantIcon,
  home: HomeIcon,
  utilities: BoltIcon,
  internet: WifiIcon,
  transport: DirectionsCarIcon,
  entertainment: MovieIcon,
  travel: FlightTakeoffIcon,
  other: ReceiptIcon,
}

export function CatBadge({ cat, size = 34 }: { cat: string; size?: number }) {
  const IconComp = CAT_ICONS[cat] ?? ReceiptIcon
  return (
    <Box
      sx={{
        width: size,
        height: size,
        flex: 'none',
        borderRadius: Math.round(size * 0.28) + 'px',
        bgcolor: brand.zinc[100],
        display: 'grid',
        placeItems: 'center',
        color: 'text.secondary',
      }}
    >
      <IconComp sx={{ fontSize: Math.round(size * 0.5) }} />
    </Box>
  )
}

const STATUS_COLORS = {
  neutral: { bg: brand.zinc[100], fg: brand.zinc[600], dot: brand.zinc[400] },
  amber:   { bg: brand.amber[50], fg: brand.amber[700], dot: '#F59E0B' },
  accent:  { bg: brand.anchor[50], fg: brand.anchor[700], dot: brand.anchor[500] },
} as const

export function SplitStatusChip({
  status,
  size = 'md',
  cents = true,
}: {
  status: BalanceStatus
  size?: 'md' | 'lg'
  cents?: boolean
}) {
  const c = STATUS_COLORS[status.tone]
  const settled = status.state === 'settled'
  const big = size === 'lg'
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: big ? '9px' : '7px',
        height: big ? '34px' : '26px',
        px: big ? '15px' : '11px',
        borderRadius: '999px',
        bgcolor: c.bg,
        color: c.fg,
        fontWeight: 600,
        fontSize: big ? 15 : 12.5,
        letterSpacing: '-0.01em',
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {settled ? (
        <CheckIcon sx={{ fontSize: big ? 16 : 13 }} />
      ) : (
        <Box component="span" sx={{ width: big ? 8 : 7, height: big ? 8 : 7, borderRadius: '999px', bgcolor: c.dot, flex: 'none' }} />
      )}
      {settled ? 'Settled' : (
        <span>
          {status.label}{' '}
          <strong>
            {cents
              ? '$' + status.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
              : '$' + Math.round(status.amount).toLocaleString('en-US')}
          </strong>
        </span>
      )}
    </Box>
  )
}

export function PersonAvatar({ who, partnerName, size = 26, sx }: { who: string; partnerName: string; size?: number; sx?: object }) {
  const isYou = who === 'you'
  return (
    <Box
      component="span"
      title={isYou ? 'You' : partnerName}
      sx={{
        width: size,
        height: size,
        flex: 'none',
        borderRadius: '999px',
        display: 'grid',
        placeItems: 'center',
        fontSize: Math.round(size * 0.42),
        fontWeight: 600,
        bgcolor: isYou ? 'primary.main' : brand.zinc[200],
        color: isYou ? '#fff' : 'text.primary',
        ...sx,
      }}
    >
      {isYou ? 'Y' : (partnerName[0] ?? 'T').toUpperCase()}
    </Box>
  )
}

export function PayerTag({ who, partnerName }: { who: string; partnerName: string }) {
  const isYou = who === 'you'
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        height: '24px',
        pl: '4px',
        pr: '10px',
        borderRadius: '999px',
        bgcolor: isYou ? brand.anchor[50] : brand.zinc[100],
        color: isYou ? brand.anchor[700] : 'text.secondary',
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      <PersonAvatar who={who} partnerName={partnerName} size={18} />
      {isYou ? 'You' : partnerName}
    </Box>
  )
}

export function SplitBar({ splitYou, height = 6 }: { splitYou: number; height?: number }) {
  const y = Math.max(0, Math.min(100, splitYou))
  return (
    <Box sx={{ display: 'flex', width: '100%', height, borderRadius: '999px', overflow: 'hidden', bgcolor: brand.zinc[200] }}>
      <Box sx={{ width: `${y}%`, bgcolor: 'primary.main', transition: 'width 0.2s' }} />
      <Box sx={{ width: `${100 - y}%`, bgcolor: brand.zinc[300], transition: 'width 0.2s' }} />
    </Box>
  )
}

export function SummaryStat({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      <Typography sx={{ fontSize: 11.5, fontWeight: 600, color: 'text.secondary', letterSpacing: '-0.005em' }}>{label}</Typography>
      <Typography sx={{ fontSize: 19, fontWeight: 600, letterSpacing: '-0.015em', fontVariantNumeric: 'tabular-nums', color: color ?? 'text.primary' }}>
        {value}
      </Typography>
    </Box>
  )
}
