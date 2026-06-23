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
import TrendingUpIcon from '@mui/icons-material/TrendingUpOutlined'
import BalanceIcon from '@mui/icons-material/BalanceOutlined'
import CalendarIcon from '@mui/icons-material/CalendarMonthOutlined'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenterOutlined'
// Subscription & assistant icons
import TvIcon from '@mui/icons-material/TvOutlined'
import MovieIcon from '@mui/icons-material/MovieOutlined'
import MusicNoteIcon from '@mui/icons-material/MusicNoteOutlined'
import PlayArrowIcon from '@mui/icons-material/PlayArrowOutlined'
import CodeIcon from '@mui/icons-material/CodeOutlined'
import CloudIcon from '@mui/icons-material/CloudOutlined'
import ArticleIcon from '@mui/icons-material/ArticleOutlined'
import InventoryIcon from '@mui/icons-material/Inventory2Outlined'
import RepeatIcon from '@mui/icons-material/RepeatOutlined'
import CreditCardIcon from '@mui/icons-material/CreditCardOutlined'
import CheckIcon from '@mui/icons-material/CheckOutlined'
import CheckCircleIcon from '@mui/icons-material/CheckCircleOutlined'
import AccessTimeIcon from '@mui/icons-material/AccessTimeOutlined'
import PauseIcon from '@mui/icons-material/PauseOutlined'
import AnchorIcon from '@mui/icons-material/Anchor'
import ArrowUpIcon from '@mui/icons-material/ArrowUpwardOutlined'
import NorthEastIcon from '@mui/icons-material/NorthEastOutlined'
import MoreHorizIcon from '@mui/icons-material/MoreHorizOutlined'
import ClockAlertIcon from '@mui/icons-material/ScheduleOutlined'
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
  fitness_center: FitnessCenterIcon,
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
  trendingUp: TrendingUpIcon,
  scale: BalanceIcon,
  calendar: CalendarIcon,
  // Subscription & assistant
  tv: TvIcon,
  film: MovieIcon,
  music: MusicNoteIcon,
  play: PlayArrowIcon,
  code: CodeIcon,
  cloud: CloudIcon,
  newspaper: ArticleIcon,
  package: InventoryIcon,
  dumbbell: FitnessCenterIcon,
  repeat: RepeatIcon,
  creditCard: CreditCardIcon,
  check: CheckIcon,
  checkCircle: CheckCircleIcon,
  clock: AccessTimeIcon,
  pause: PauseIcon,
  anchor: AnchorIcon,
  arrowUp: ArrowUpIcon,
  arrowUpRight: NorthEastIcon,
  more: MoreHorizIcon,
  clockAlert: ClockAlertIcon,
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
