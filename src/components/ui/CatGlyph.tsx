'use client'

import Box from '@mui/material/Box'
import HomeIcon from '@mui/icons-material/HomeOutlined'
import BoltIcon from '@mui/icons-material/BoltOutlined'
import WifiIcon from '@mui/icons-material/WifiOutlined'
import RestaurantIcon from '@mui/icons-material/RestaurantOutlined'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCartOutlined'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCarOutlined'
import DirectionsTransitIcon from '@mui/icons-material/DirectionsTransitOutlined'
import LocalGasStationIcon from '@mui/icons-material/LocalGasStationOutlined'
import FavoriteIcon from '@mui/icons-material/FavoriteBorderOutlined'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBagOutlined'
import SmartphoneIcon from '@mui/icons-material/SmartphoneOutlined'
import SavingsIcon from '@mui/icons-material/SavingsOutlined'
import ShieldIcon from '@mui/icons-material/ShieldOutlined'
import AccountBalanceIcon from '@mui/icons-material/AccountBalanceOutlined'
import BeachAccessIcon from '@mui/icons-material/BeachAccessOutlined'
import WalletIcon from '@mui/icons-material/AccountBalanceWalletOutlined'
import TargetIcon from '@mui/icons-material/TrackChangesOutlined'
import SparklesIcon from '@mui/icons-material/AutoAwesomeOutlined'
import BanknoteIcon from '@mui/icons-material/PaidOutlined'
import HeartPulseIcon from '@mui/icons-material/MonitorHeartOutlined'
import type { SxProps } from '@mui/material/styles'

const ICON_MAP: Record<string, React.ElementType> = {
  home: HomeIcon,
  bolt: BoltIcon,
  wifi: WifiIcon,
  restaurant: RestaurantIcon,
  local_grocery_store: ShoppingCartIcon,
  dining: RestaurantIcon,
  directions_car: DirectionsCarIcon,
  directions_transit: DirectionsTransitIcon,
  local_gas_station: LocalGasStationIcon,
  favorite: FavoriteIcon,
  favorite_border: HeartPulseIcon,
  shopping_bag: ShoppingBagIcon,
  smartphone: SmartphoneIcon,
  savings: SavingsIcon,
  shield: ShieldIcon,
  landmark: AccountBalanceIcon,
  beach_access: BeachAccessIcon,
  wallet: WalletIcon,
  target: TargetIcon,
  sparkles: SparklesIcon,
  banknote: BanknoteIcon,
  piggyBank: SavingsIcon,
  heartPulse: HeartPulseIcon,
  car: DirectionsCarIcon,
  palmtree: BeachAccessIcon,
}

const TONE_STYLES = {
  neutral: { bgcolor: 'grey.100', color: 'text.secondary' },
  accent: { bgcolor: 'primary.50', color: 'primary.main' },
  amber: { bgcolor: '#FFF8EB', color: '#A6630A' },
  red: { bgcolor: '#FFF0F0', color: '#D03036' },
} as const

type Tone = keyof typeof TONE_STYLES

interface CatGlyphProps {
  icon: string
  size?: number
  tone?: Tone
  sx?: SxProps
}

export function CatGlyph({ icon, size = 32, tone = 'neutral', sx }: CatGlyphProps) {
  const Icon = ICON_MAP[icon] ?? BanknoteIcon
  const iconSize = Math.round(size * 0.52)
  const radius = Math.round(size * 0.3)

  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: `${radius}px`,
        flexShrink: 0,
        display: 'grid',
        placeItems: 'center',
        ...TONE_STYLES[tone],
        ...sx,
      }}
    >
      <Icon sx={{ fontSize: iconSize }} />
    </Box>
  )
}
