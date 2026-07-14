'use client'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import { brand } from '@/lib/theme'
import { tabularNums } from '@/lib/sx'
import { clamp01 } from '@/utils/format'
import { Stack } from '../layout/Flex'
import { Eyebrow } from './Eyebrow'

interface DialProps {
  /** 0–1 fraction (clamped). */
  value: number
  /** Outer diameter, px. */
  size?: number
  /** Ring thickness, px. */
  thickness?: number
  /**
   * Ring colors. These paint an SVG `stroke`, so pass a plain CSS color —
   * theme paths like `primary.main` don't resolve there. Defaults to the teal accent.
   */
  color?: string
  track?: string
  /** Small uppercase caption under the percentage. */
  label?: React.ReactNode
}

/** A circular progress ring with the percentage — and an optional caption — centered inside it. */
export function Dial({ value, size = 148, thickness = 13, color, track = brand.anchor[50], label }: DialProps) {
  const theme = useTheme()
  const pct = clamp01(value)
  const center = size / 2
  const radius = (size - thickness) / 2
  const circumference = 2 * Math.PI * radius

  return (
    <Box sx={{ position: 'relative', width: size, height: size, flex: 'none' }}>
      <Box
        component="svg"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        sx={{ transform: 'rotate(-90deg)', display: 'block' }}
      >
        <circle cx={center} cy={center} r={radius} fill="none" stroke={track} strokeWidth={thickness} />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color ?? theme.palette.primary.main}
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - pct)}
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </Box>
      <Stack align="center" justify="center" sx={{ position: 'absolute', inset: 0 }}>
        <Typography
          sx={{ ...tabularNums, fontSize: 30, fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1, color: brand.anchor[800] }}
        >
          {Math.round(pct * 100)}%
        </Typography>
        {label && <Eyebrow sx={{ mt: '4px' }}>{label}</Eyebrow>}
      </Stack>
    </Box>
  )
}
