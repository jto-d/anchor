import Box from '@mui/material/Box'
import { brand } from '@/lib/theme'
import { clamp01 } from './format'

export type ProgressTone = 'accent' | 'pos' | 'amber' | 'red'

const TONE_COLORS: Record<ProgressTone, string> = {
  accent: brand.anchor[600],
  pos: brand.anchor[600],
  amber: '#F59E0B',
  red: '#EF4444',
}

/** A slim track + fill bar. Values above 1 clamp to full width and flip to red. */
export function ThinProgressBar({ value, tone = 'accent', height = 5 }: { value: number; tone?: ProgressTone; height?: number }) {
  const clamped = clamp01(value)
  const over = value > 1.001
  return (
    <Box sx={{ width: '100%', height, borderRadius: 999, bgcolor: 'grey.100', overflow: 'hidden' }}>
      <Box
        sx={{
          height: '100%',
          width: `${clamped * 100}%`,
          bgcolor: over ? '#EF4444' : TONE_COLORS[tone],
          borderRadius: 999,
          transition: 'width 0.3s ease',
        }}
      />
    </Box>
  )
}
