'use client'

import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import AnchorIcon from '@mui/icons-material/Anchor'
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined'
import CallSplitIcon from '@mui/icons-material/CallSplit'
import CardGiftcardOutlinedIcon from '@mui/icons-material/CardGiftcardOutlined'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutlined'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import LogoutIcon from '@mui/icons-material/Logout'
import PieChartOutlineIcon from '@mui/icons-material/PieChartOutlined'
import RepeatIcon from '@mui/icons-material/Repeat'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import type { SvgIconComponent } from '@mui/icons-material'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { brand } from '@/lib/theme'
import { ComingSoon, Row } from '@/components/ui'

export const SIDEBAR_WIDTH = 220

const NAV_ITEMS: { key: string; label: string; href: string; Icon: SvgIconComponent }[] = [
  { key: 'perks', label: 'Perks', href: '/', Icon: CardGiftcardOutlinedIcon },
  { key: 'cards', label: 'Cards', href: '/cards', Icon: CreditCardIcon },
  { key: 'budgeting', label: 'Budgeting', href: '/budgeting', Icon: PieChartOutlineIcon },
  { key: 'subscriptions', label: 'Subscriptions', href: '/subscriptions', Icon: RepeatIcon },
  { key: 'accounts', label: 'Accounts', href: '/accounts', Icon: AccountBalanceOutlinedIcon },
  { key: 'split', label: 'Split', href: '/split', Icon: CallSplitIcon },
]

/** Which nav item the current URL belongs to. Card detail (`/card/:id`) lives under Cards. */
function isNavActive(pathname: string, item: { key: string; href: string }): boolean {
  if (item.href === '/') return pathname === '/'
  if (item.key === 'cards') return pathname === '/cards' || pathname.startsWith('/card/')
  return pathname === item.href || pathname.startsWith(item.href + '/')
}

const COMING_SOON_ITEMS: { key: string; label: string; Icon: SvgIconComponent }[] = [
  { key: 'chatbot', label: 'Chatbot', Icon: ChatBubbleOutlineIcon },
]

const navItemSx = (active: boolean) => ({
  borderRadius: '8px',
  py: 1,
  px: 1.25,
  color: active ? 'primary.main' : 'text.secondary',
  '&.Mui-selected, &.Mui-selected:hover': { bgcolor: brand.accentSoft },
})

interface SidebarProps {
  userEmail: string
}

export function Sidebar({ userEmail }: SidebarProps) {
  const pathname = usePathname()
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
      <Row gap={1.1} sx={{ px: 1, pb: 2.5 }}>
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
      </Row>

      {/* Nav */}
      <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
        {NAV_ITEMS.map(({ key, label, href, Icon }) => {
          const active = isNavActive(pathname, { key, href })
          return (
            <ListItemButton
              key={key}
              component={Link}
              href={href}
              selected={active}
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
        {COMING_SOON_ITEMS.map(({ key, label, Icon }) => (
          <ComingSoon key={key} placement="right">
            <ListItemButton sx={navItemSx(false)}>
              <ListItemIcon sx={{ minWidth: 0, mr: 1.25, color: 'inherit' }}>
                <Icon sx={{ fontSize: 19 }} />
              </ListItemIcon>
              <ListItemText
                primary={label}
                slotProps={{ primary: { sx: { fontSize: 14, fontWeight: 500 } } }}
              />
            </ListItemButton>
          </ComingSoon>
        ))}
      </List>

      {/* Bottom */}
      <Box sx={{ mt: 'auto' }}>
        <ComingSoon placement="right">
          <ListItemButton sx={navItemSx(false)}>
            <ListItemIcon sx={{ minWidth: 0, mr: 1.25, color: 'inherit' }}>
              <SettingsOutlinedIcon sx={{ fontSize: 19 }} />
            </ListItemIcon>
            <ListItemText primary="Settings" slotProps={{ primary: { sx: { fontSize: 14, fontWeight: 500 } } }} />
          </ListItemButton>
        </ComingSoon>
        <Divider sx={{ mt: 0.5, mb: 0.5 }} />
        <Row gap={1.1} min0 sx={{ px: 1.25, py: 1 }}>
          <Avatar
            sx={{ width: 28, height: 28, fontSize: 11, fontWeight: 700, bgcolor: 'grey.200', color: 'text.secondary' }}
          >
            {initials}
          </Avatar>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography noWrap sx={{ fontSize: 12, fontWeight: 600 }}>
              {userEmail.split('@')[0]}
            </Typography>
            <Typography noWrap sx={{ fontSize: 11, color: 'text.disabled' }}>
              {userEmail}
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={() => signOut({ callbackUrl: '/login' })}
            sx={{ color: 'text.disabled', flex: 'none', '&:hover': { color: 'text.secondary' } }}
            title="Sign out"
          >
            <LogoutIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Row>
      </Box>
    </Drawer>
  )
}