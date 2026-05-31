import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import AnchorIcon from '@mui/icons-material/Anchor'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import CardGiftcardOutlinedIcon from '@mui/icons-material/CardGiftcardOutlined'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined'
import type { SvgIconComponent } from '@mui/icons-material'
import { brand } from '@/lib/theme'

export const SIDEBAR_WIDTH = 220

const NAV_ITEMS: { key: string; label: string; Icon: SvgIconComponent }[] = [
  { key: 'dashboard', label: 'Dashboard', Icon: SpaceDashboardOutlinedIcon },
  { key: 'cards', label: 'Cards', Icon: CreditCardIcon },
  { key: 'perks', label: 'Perks', Icon: CardGiftcardOutlinedIcon },
  { key: 'calendar', label: 'Calendar', Icon: CalendarMonthOutlinedIcon },
]

const navItemSx = (active: boolean) => ({
  borderRadius: '8px',
  py: 1,
  px: 1.25,
  color: active ? 'primary.main' : 'text.secondary',
  '&.Mui-selected, &.Mui-selected:hover': { bgcolor: brand.accentSoft },
})

interface SidebarProps {
  route: string
  userEmail: string
  onNavigate: (key: string) => void
}

export function Sidebar({ route, userEmail, onNavigate }: SidebarProps) {
  const initials = userEmail.slice(0, 2).toUpperCase()

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: SIDEBAR_WIDTH,
          position: 'relative',
          border: 0,
          borderRight: 1,
          borderColor: 'divider',
          px: 1.5,
          py: 2.25,
          boxSizing: 'border-box',
        },
      }}
    >
      {/* Logo */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.1, px: 1, pb: 2.5 }}>
        <Box
          sx={{
            width: 30,
            height: 30,
            borderRadius: '8px',
            bgcolor: 'primary.main',
            display: 'grid',
            placeItems: 'center',
            flex: 'none',
          }}
        >
          <AnchorIcon sx={{ fontSize: 16, color: '#fff' }} />
        </Box>
        <Typography sx={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.02em' }}>
          Anchor
        </Typography>
      </Box>

      {/* Nav */}
      <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
        {NAV_ITEMS.map(({ key, label, Icon }) => {
          const active = route === key
          return (
            <ListItemButton
              key={key}
              selected={active}
              onClick={() => onNavigate(key)}
              sx={navItemSx(active)}
            >
              <ListItemIcon sx={{ minWidth: 0, mr: 1.25, color: 'inherit' }}>
                <Icon sx={{ fontSize: 19 }} />
              </ListItemIcon>
              <ListItemText
                primary={label}
                slotProps={{ primary: { sx: { fontSize: 14, fontWeight: active ? 600 : 500 } } }}
              />
            </ListItemButton>
          )
        })}
      </List>

      {/* Bottom */}
      <Box sx={{ mt: 'auto' }}>
        <ListItemButton onClick={() => {}} sx={navItemSx(false)}>
          <ListItemIcon sx={{ minWidth: 0, mr: 1.25, color: 'inherit' }}>
            <SettingsOutlinedIcon sx={{ fontSize: 19 }} />
          </ListItemIcon>
          <ListItemText primary="Settings" slotProps={{ primary: { sx: { fontSize: 14, fontWeight: 500 } } }} />
        </ListItemButton>
        <Divider sx={{ mt: 0.5, mb: 0.5 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.1, px: 1.25, py: 1, minWidth: 0 }}>
          <Avatar
            sx={{ width: 28, height: 28, fontSize: 11, fontWeight: 700, bgcolor: 'grey.200', color: 'text.secondary' }}
          >
            {initials}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography noWrap sx={{ fontSize: 12, fontWeight: 600 }}>
              {userEmail.split('@')[0]}
            </Typography>
            <Typography noWrap sx={{ fontSize: 11, color: 'text.disabled' }}>
              {userEmail}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Drawer>
  )
}