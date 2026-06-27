'use client'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import NorthEastIcon from '@mui/icons-material/NorthEastOutlined'
import SouthEastIcon from '@mui/icons-material/SouthEastOutlined'
import { SurfaceCard, Segmented } from '@/components/ui'
import { AreaChart } from './AccountPrimitives'
import { fmtSigned, MONTHS, TODAY, RANGE_COUNTS } from '@/data/accountData'
import { brand } from '@/lib/theme'

interface TrendChartProps {
  series: number[]
  range: string
  onRange: (r: string) => void
  compact?: boolean
}

export function TrendChart({ series, range, onRange, compact }: TrendChartProps) {
  const n = Math.min(series.length, RANGE_COUNTS[range] ?? 12)
  const sliced = series.slice(series.length - n)
  const delta = sliced[sliced.length - 1] - sliced[0]
  const up = delta >= 0
  const months = sliced.map((_, i) => MONTHS[(TODAY.m - (n - 1) + i + 12) % 12])
  const H = 132

  return (
    <SurfaceCard>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', p: '16px 18px 8px' }}>
        <Box>
          <Typography sx={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.01em' }}>Net worth trend</Typography>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: '6px', mt: '5px', fontSize: 12, fontVariantNumeric: 'tabular-nums', fontWeight: 600, color: up ? brand.anchor[600] : brand.red[600] }}>
            {up ? <NorthEastIcon sx={{ fontSize: 13 }} /> : <SouthEastIcon sx={{ fontSize: 13 }} />}
            {fmtSigned(delta)}
            <Box component="span" sx={{ color: 'text.disabled', fontWeight: 400 }}>
              over {range === 'All' ? '12 mo' : range}
            </Box>
          </Box>
        </Box>
        <Segmented
          value={range}
          onChange={onRange}
          size="sm"
          options={Object.keys(RANGE_COUNTS).map((r) => ({ value: r, label: r }))}
        />
      </Box>

      <Box sx={{ p: compact ? '4px 6px 14px' : '6px 8px 14px' }}>
        <AreaChart data={sliced} width={compact ? 320 : 720} height={H} id={compact ? 'tc' : 't'} showGrid />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: '8px', px: '4px', fontSize: 10.5, color: 'text.disabled', fontVariantNumeric: 'tabular-nums' }}>
          <span>{months[0]}</span>
          {!compact && <span>{months[Math.floor(months.length / 2)]}</span>}
          <span>{months[months.length - 1]}</span>
        </Box>
      </Box>
    </SurfaceCard>
  )
}
