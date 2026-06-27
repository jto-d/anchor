'use client'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { brand } from '@/lib/theme'
import { Eyebrow } from '@/components/ui'
import { Money, DeltaChip } from './AccountPrimitives'
import { fmtMoney } from '@/data/accountData'

const CREDIT_RED = '#EF4444'

interface NetWorthSummaryProps {
  netWorth: number
  cashTotal: number
  invTotal: number
  creditTotal?: number
  delta: number
  count: number
  privacy: boolean
  big?: boolean
}

export function NetWorthSummary({ netWorth, cashTotal, invTotal, creditTotal = 0, delta, count, privacy, big }: NetWorthSummaryProps) {
  const gross = cashTotal + invTotal + creditTotal
  const cashPct   = gross > 0 ? Math.round((cashTotal  / gross) * 100) : 0
  const invPct    = gross > 0 ? Math.round((invTotal   / gross) * 100) : 0
  const creditPct = 100 - cashPct - invPct

  const segments: Array<[string, number, number, string]> = [
    ['Cash',        cashTotal, cashPct,   brand.anchor[300]],
    ['Investments', invTotal,  invPct,    brand.anchor[700]],
  ]
  if (creditTotal > 0) segments.push(['Liabilities', creditTotal, creditPct, CREDIT_RED])

  return (
    <Box>
      <Eyebrow sx={{ mb: '9px' }}>Net worth</Eyebrow>

      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: '14px', flexWrap: 'wrap' }}>
        <Box
          sx={{
            fontSize: big ? 46 : 40,
            fontWeight: 600,
            letterSpacing: '-0.027em',
            lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
            filter: privacy ? 'blur(5px)' : 'none',
            transition: 'filter 180ms ease',
            userSelect: privacy ? 'none' : 'auto',
          }}
        >
          {fmtMoney(netWorth)}
        </Box>
        <DeltaChip delta={delta} label="· this month" />
      </Box>

      {/* allocation split bar */}
      <Box sx={{ mt: '20px' }}>
        <Box sx={{ display: 'flex', height: 10, borderRadius: '999px', overflow: 'hidden', bgcolor: brand.zinc[100] }}>
          <Box sx={{ width: `${cashPct}%`, bgcolor: brand.anchor[300], transition: 'width 0.3s ease' }} />
          <Box sx={{ width: `${invPct}%`, bgcolor: 'primary.main', transition: 'width 0.3s ease' }} />
          {creditTotal > 0 && (
            <Box sx={{ width: `${creditPct}%`, bgcolor: CREDIT_RED, transition: 'width 0.3s ease' }} />
          )}
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: '12px', gap: '10px 16px' }}>
          {segments.map(([label, val, p, c]) => (
            <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
              <Box sx={{ width: 9, height: 9, borderRadius: '3px', bgcolor: c, flexShrink: 0 }} />
              <Typography sx={{ fontSize: 12.5, color: 'text.secondary' }}>{label}</Typography>
              <Money value={val} size={13} weight={600} privacy={privacy} color={label === 'Liabilities' ? CREDIT_RED : undefined} />
              <Typography sx={{ fontSize: 11.5, color: 'text.disabled', fontVariantNumeric: 'tabular-nums' }}>{p}%</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <Typography sx={{ mt: '16px', fontSize: 12, color: 'text.disabled' }}>
        {count} accounts · updated 2h ago
      </Typography>
    </Box>
  )
}
