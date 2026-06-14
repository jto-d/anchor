'use client'

import Box from '@mui/material/Box'
import { Tooltip, type TooltipPlacement } from './Tooltip'

interface ComingSoonProps {
  children: React.ReactNode
  placement?: TooltipPlacement
}

export function ComingSoon({ children, placement = 'auto' }: ComingSoonProps) {
  return (
    <Tooltip title="Coming soon" placement={placement}>
      <span>
        <Box sx={{ opacity: 0.45, pointerEvents: 'none' }}>{children}</Box>
      </span>
    </Tooltip>
  )
}
