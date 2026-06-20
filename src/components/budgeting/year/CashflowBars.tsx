'use client'

import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { brand } from '@/lib/theme'
import { Dot, Row, Stack } from '@/components/ui'
import { tabularNums } from '@/lib/sx'
import { fmtMoney, fmtSigned } from '@/utils/format'
import type { YearMonth } from '@/hooks/useBudgetYear'
import { MONTHS_SHORT, MONTHS_LONG, PLOT_H } from './constants'

export function CashflowBars({ months }: { months: YearMonth[] }) {
  const [hovered, setHovered] = useState<number | null>(null)
  const top = Math.max(...months.map((mo) => Math.max(mo.income, mo.outflow))) * 1.08 || 1
  const h = (v: number) => Math.max(0, (v / top) * PLOT_H)

  const stripeStyle = {
    position: 'absolute' as const,
    inset: 0,
    background: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.55) 0 3px, transparent 3px 6px)',
  }

  return (
    <Box sx={{ position: 'relative', pt: '6px', pb: 0 }}>
      <Row align="end" sx={{ height: `${PLOT_H}px` }}>
        {months.map((mo) => {
          const isHover = hovered === mo.m
          const dim = mo.estimated ? 0.62 : 1
          const outH = h(mo.outflow)
          const savH = outH > 0 ? h(mo.savContrib) / outH * outH : 0

          return (
            <Stack
              key={mo.m}
              align="center"
              onMouseEnter={() => setHovered(mo.m)}
              onMouseLeave={() => setHovered((p) => p === mo.m ? null : p)}
              sx={{ flex: 1, height: '100%', cursor: 'default' }}
            >
              <Row align="end" justify="center" gap="5px" sx={{
                position: 'relative', flex: 1, width: '100%',
                borderRadius: '6px',
                bgcolor: isHover ? 'grey.50' : 'transparent',
                transition: 'background 120ms ease',
                pb: '1px',
              }}>
                <Box sx={{
                  width: 13, height: `${h(mo.income)}px`, borderRadius: '3px 3px 0 0',
                  bgcolor: brand.anchor[200], opacity: dim,
                  position: 'relative', overflow: 'hidden', flexShrink: 0,
                }}>
                  {mo.estimated && <Box sx={stripeStyle} />}
                </Box>

                <Stack sx={{
                  width: 13, height: `${outH}px`, borderRadius: '3px 3px 0 0',
                  overflow: 'hidden', opacity: dim, position: 'relative', flexShrink: 0,
                }}>
                  <Box sx={{ height: `${savH}px`, bgcolor: brand.gold[500], position: 'relative', flexShrink: 0 }}>
                    {mo.estimated && <Box sx={stripeStyle} />}
                  </Box>
                  <Box sx={{ flex: 1, bgcolor: brand.anchor[600], position: 'relative' }}>
                    {mo.estimated && <Box sx={stripeStyle} />}
                  </Box>
                </Stack>

                {mo.status === 'current' && (
                  <Box sx={{
                    position: 'absolute', top: '-2px', left: '50%',
                    transform: 'translateX(-50%)',
                    width: 6, height: 6, borderRadius: 999,
                    bgcolor: brand.gold[500],
                    boxShadow: `0 0 0 3px ${brand.gold[50]}`,
                  }} />
                )}
              </Row>

              <Typography sx={{
                mt: '8px', fontSize: 11,
                fontWeight: mo.status === 'current' ? 700 : 500,
                letterSpacing: '-0.01em',
                color: mo.status === 'current' ? 'text.primary' : 'text.secondary',
              }}>
                {MONTHS_SHORT[mo.m]}
              </Typography>
            </Stack>
          )
        })}
      </Row>

      {hovered != null && (() => {
        const mo = months[hovered]
        const statusLabels: Record<string, string> = {
          actual: 'Logged', current: 'In progress', assumed: 'On-track est.', projected: 'Projected',
        }
        const statusColors: Record<string, string> = {
          actual: brand.anchor[600], current: brand.gold[500], assumed: 'rgba(255,255,255,0.14)', projected: 'rgba(255,255,255,0.14)',
        }
        const offsetPct = ((hovered + 0.5) / 12) * 100
        const translateX = hovered < 2 ? '-20%' : hovered > 9 ? '-80%' : '-50%'
        return (
          <Box sx={{
            position: 'absolute',
            left: `${offsetPct}%`,
            bottom: `${PLOT_H - 6}px`,
            transform: `translateX(${translateX})`,
            zIndex: 5,
            minWidth: '186px',
            bgcolor: 'grey.900',
            color: '#fff',
            borderRadius: '11px',
            boxShadow: brand.shadow.lg,
            p: '12px 13px',
            pointerEvents: 'none',
          }}>
            <Row justify="between" gap="10px" sx={{ mb: '9px' }}>
              <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{MONTHS_LONG[mo.m]}</Typography>
              <Row inline sx={{
                fontSize: 10, fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase',
                px: '7px', height: 20, borderRadius: 999,
                bgcolor: statusColors[mo.status], color: '#fff',
              }}>
                {statusLabels[mo.status]}
              </Row>
            </Row>
            {([
              ['Income', fmtMoney(mo.income), brand.anchor[200]],
              ['Spent', fmtMoney(mo.catSpent), brand.anchor[300]],
              ['Saved', fmtMoney(mo.savContrib), brand.gold[500]],
              [mo.surplus < 0 ? 'Over' : 'Surplus', fmtSigned(mo.surplus), null],
            ] as [string, string, string | null][]).map(([k, v, dot], i, arr) => (
              <Row key={k} justify="between" gap="14px" sx={{
                fontSize: 12, py: '3px',
                ...(i === arr.length - 1 ? { pt: '7px', mt: '4px', borderTop: '1px solid rgba(255,255,255,0.14)' } : {}),
              }}>
                <Row inline gap="7px" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  <Dot size={8} square color={dot ?? 'transparent'} />
                  <Typography sx={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{k}</Typography>
                </Row>
                <Typography sx={{
                  fontSize: 12, fontWeight: 600, ...tabularNums,
                  color: k === 'Over' ? brand.red[300] : '#fff',
                }}>{v}</Typography>
              </Row>
            ))}
          </Box>
        )
      })()}
    </Box>
  )
}
