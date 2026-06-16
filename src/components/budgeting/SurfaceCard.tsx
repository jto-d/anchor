import Box from '@mui/material/Box'
import { brand } from '@/lib/theme'

/** White, softly-shadowed rounded panel — the base surface every budgeting card sits on. */
export function SurfaceCard({ children, sx }: { children: React.ReactNode; sx?: object }) {
  return (
    <Box
      sx={{
        bgcolor: '#fff',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: '14px',
        boxShadow: brand.shadow.sm,
        overflow: 'hidden',
        ...sx,
      }}
    >
      {children}
    </Box>
  )
}
