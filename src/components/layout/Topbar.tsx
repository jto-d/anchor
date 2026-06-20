'use client'

import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import AddIcon from '@mui/icons-material/Add'
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined'
import { ComingSoon, Row } from '@/components/ui'

interface TopbarProps {
  title: string
  subtitle?: string
  onAddCard?: () => void
  rightSlot?: React.ReactNode
}

export function Topbar({ title, subtitle, onAddCard, rightSlot }: TopbarProps) {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="inherit"
      sx={{
        bgcolor: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(8px)',
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Toolbar
        disableGutters
        sx={{ justifyContent: 'space-between', gap: 1.25, px: 3.75, py: 1.75, minHeight: 'unset' }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h5" noWrap sx={{ fontSize: 21 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography noWrap sx={{ fontSize: 13, color: 'grey.500', mt: '2px' }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        <Row gap={1.25} sx={{ flex: 'none' }}>
          {/* <Paper
            variant="outlined"
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              gap: 1,
              height: 36,
              px: 1.5,
              width: 190,
              borderColor: 'divider',
              borderRadius: '8px',
            }}
          >
            <SearchIcon sx={{ fontSize: 15, color: 'text.disabled' }} />
            <InputBase placeholder="Search perks…" sx={{ fontSize: 13, color: 'text.secondary', flex: 1 }} />
          </Paper> */}
          <ComingSoon>
            <IconButton
              sx={{
                border: 1,
                borderColor: 'grey.300',
                borderRadius: '8px',
                width: 38,
                height: 38,
                color: 'text.secondary',
              }}
            >
              <NotificationsNoneOutlinedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </ComingSoon>
          {onAddCard && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={onAddCard} sx={{ height: 38, flex: 'none' }}>
              Add a card
            </Button>
          )}
          {rightSlot}
        </Row>
      </Toolbar>
    </AppBar>
  )
}
