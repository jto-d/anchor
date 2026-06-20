'use client'

import Typography from '@mui/material/Typography'
import type { SxProps, Theme } from '@mui/material/styles'

/** Small uppercase section label (the old "Eyebrow"), now a themed Typography. */
export function Eyebrow({
  children,
  sx,
}: {
  children: React.ReactNode
  sx?: SxProps<Theme>
}) {
  return (
    <Typography
      variant="overline"
      component="div"
      sx={[
        { color: 'grey.500', display: 'block', lineHeight: 1.4 },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      {children}
    </Typography>
  )
}