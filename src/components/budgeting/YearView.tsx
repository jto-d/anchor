'use client'

import { useState, useMemo } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import { brand } from '@/lib/theme'
import { CatGlyph } from '@/components/ui/CatGlyph'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { SurfaceCard } from './SurfaceCard'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { fmtMoney, fmtSigned, clamp01, monthShort } from '@/utils/format'
import { useBudgetYear } from '@/hooks/useBudgetYear'
import type { YearMonth, CatYearData, SavingsYearData, GoalYearData, YearAnnual } from '@/hooks/useBudgetYear'

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const PLOT_H = 200

// ---- Year summary strip ---------------------------------------------------

function YearSummary({ annual, completed, projected, currentLabel }: {
  annual: YearAnnual
  completed: number
  projected: number
  currentLabel: number | null
}) {
  const deficit = annual.surplus < 0
  const rate = annual.income > 0 ? (annual.saved + Math.max(0, annual.surplus)) / annual.income : 0

  const divider = <Box sx={{ width: '1px', alignSelf: 'stretch', bgcolor: 'divider', my: 0.75 }} />

  const cell = (label: string, value: string, sub: string, hero?: boolean, color?: string) => (
    <Box sx={{ flex: hero ? 1.15 : 1, minWidth: 0, px: { xs: 2, sm: 2.75 } }}>
      <Eyebrow sx={{ fontSize: '10.5px', mb: '7px', color: color ? color : 'text.secondary' }}>{label}</Eyebrow>
      <Typography sx={{
        fontSize: hero ? 28 : 23,
        fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1,
        fontVariantNumeric: 'tabular-nums', color: color || 'text.primary',
      }}>{value}</Typography>
      <Typography sx={{ mt: '6px', fontSize: 12, color: 'text.secondary', lineHeight: 1.3 }}>{sub}</Typography>
    </Box>
  )

  return (
    <SurfaceCard>
      <Box sx={{ display: 'flex', alignItems: 'stretch', py: 2.5, px: 1 }}>
        {cell('Income', fmtMoney(annual.income), `${fmtMoney(annual.monthlyIncome)}/mo · full year`)}
        {divider}
        {cell('Spent', fmtMoney(annual.spent), `${Math.round(annual.income > 0 ? annual.spent / annual.income * 100 : 0)}% of income`)}
        {divider}
        {cell('Saved', fmtMoney(annual.saved), `${Math.round(annual.income > 0 ? annual.saved / annual.income * 100 : 0)}% to accounts`)}
        {divider}
        {cell(
          deficit ? 'Net shortfall' : 'Surplus',
          fmtSigned(annual.surplus),
          `${Math.round(rate * 100)}% kept or saved`,
          true,
          deficit ? brand.red[600] : brand.anchor[700],
        )}
      </Box>
      <Box sx={{ px: 3.25, pb: 2, display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
        <Chip tone="accent" icon="check">{completed} logged</Chip>
        {currentLabel != null && <Chip tone="amber" icon="clock">{MONTHS_LONG[currentLabel]} in progress</Chip>}
        {projected > 0 && <Chip tone="neutral">{projected} projected</Chip>}
        <Typography sx={{ fontSize: 12, color: 'text.secondary', ml: '2px' }}>
          Estimated months assume your budget is met on-track.
        </Typography>
      </Box>
    </SurfaceCard>
  )
}

function Chip({ tone, icon, children }: { tone: 'accent' | 'amber' | 'neutral'; icon?: string; children: React.ReactNode }) {
  const styles = {
    accent: { bgcolor: brand.accentSoft, color: brand.anchor[700] },
    neutral: { bgcolor: 'grey.100', color: 'text.secondary' },
    amber: { bgcolor: brand.gold[50], color: brand.amber[700] },
  }
  return (
    <Box sx={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      height: 24, px: '10px', borderRadius: 999,
      fontSize: 12, fontWeight: 600,
      ...styles[tone],
    }}>
      {icon === 'check' && '✓ '}
      {icon === 'clock' && '◷ '}
      {children}
    </Box>
  )
}

// ---- Cashflow bar chart ---------------------------------------------------

function CashflowBars({ months }: { months: YearMonth[] }) {
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
      <Box sx={{ display: 'flex', alignItems: 'flex-end', height: `${PLOT_H}px`, gap: 0 }}>
        {months.map((mo) => {
          const isHover = hovered === mo.m
          const dim = mo.estimated ? 0.62 : 1
          const outH = h(mo.outflow)
          const savH = outH > 0 ? h(mo.savContrib) / outH * outH : 0

          return (
            <Box
              key={mo.m}
              onMouseEnter={() => setHovered(mo.m)}
              onMouseLeave={() => setHovered((p) => p === mo.m ? null : p)}
              sx={{
                flex: 1, display: 'flex', flexDirection: 'column',
                alignItems: 'center', height: '100%', cursor: 'default',
              }}
            >
              <Box sx={{
                position: 'relative', flex: 1, width: '100%',
                display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '5px',
                borderRadius: '6px',
                bgcolor: isHover ? 'grey.50' : 'transparent',
                transition: 'background 120ms ease',
                pb: '1px',
              }}>
                {/* income bar */}
                <Box sx={{
                  width: 13, height: `${h(mo.income)}px`, borderRadius: '3px 3px 0 0',
                  bgcolor: brand.anchor[200], opacity: dim,
                  position: 'relative', overflow: 'hidden', flexShrink: 0,
                }}>
                  {mo.estimated && <Box sx={stripeStyle} />}
                </Box>

                {/* outflow bar: saved (top) + spent (bottom) */}
                <Box sx={{
                  width: 13, height: `${outH}px`, borderRadius: '3px 3px 0 0',
                  display: 'flex', flexDirection: 'column', overflow: 'hidden',
                  opacity: dim, position: 'relative', flexShrink: 0,
                }}>
                  <Box sx={{ height: `${savH}px`, bgcolor: brand.gold[500], position: 'relative', flexShrink: 0 }}>
                    {mo.estimated && <Box sx={stripeStyle} />}
                  </Box>
                  <Box sx={{ flex: 1, bgcolor: brand.anchor[600], position: 'relative' }}>
                    {mo.estimated && <Box sx={stripeStyle} />}
                  </Box>
                </Box>

                {mo.status === 'current' && (
                  <Box sx={{
                    position: 'absolute', top: '-2px', left: '50%',
                    transform: 'translateX(-50%)',
                    width: 6, height: 6, borderRadius: 999,
                    bgcolor: brand.gold[500],
                    boxShadow: `0 0 0 3px ${brand.gold[50]}`,
                  }} />
                )}
              </Box>

              <Typography sx={{
                mt: '8px', fontSize: 11,
                fontWeight: mo.status === 'current' ? 700 : 500,
                letterSpacing: '-0.01em',
                color: mo.status === 'current' ? 'text.primary' : 'text.secondary',
              }}>
                {MONTHS_SHORT[mo.m]}
              </Typography>
            </Box>
          )
        })}
      </Box>

      {/* hover tooltip */}
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
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', mb: '9px' }}>
              <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{MONTHS_LONG[mo.m]}</Typography>
              <Box sx={{
                fontSize: 10, fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase',
                px: '7px', height: 20, display: 'inline-flex', alignItems: 'center', borderRadius: 999,
                bgcolor: statusColors[mo.status], color: '#fff',
              }}>
                {statusLabels[mo.status]}
              </Box>
            </Box>
            {([
              ['Income', fmtMoney(mo.income), brand.anchor[200]],
              ['Spent', fmtMoney(mo.catSpent), brand.anchor[300]],
              ['Saved', fmtMoney(mo.savContrib), brand.gold[500]],
              [mo.surplus < 0 ? 'Over' : 'Surplus', fmtSigned(mo.surplus), null],
            ] as [string, string, string | null][]).map(([k, v, dot], i, arr) => (
              <Box key={k} sx={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px',
                fontSize: 12, py: '3px',
                ...(i === arr.length - 1 ? { pt: '7px', mt: '4px', borderTop: '1px solid rgba(255,255,255,0.14)' } : {}),
              }}>
                <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: '7px', color: 'rgba(255,255,255,0.7)' }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '2px', bgcolor: dot ?? 'transparent', flexShrink: 0 }} />
                  <Typography sx={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{k}</Typography>
                </Box>
                <Typography sx={{
                  fontSize: 12, fontWeight: 600, fontVariantNumeric: 'tabular-nums',
                  color: k === 'Over' ? brand.red[300] : '#fff',
                }}>{v}</Typography>
              </Box>
            ))}
          </Box>
        )
      })()}
    </Box>
  )
}

// ---- Cumulative area chart ------------------------------------------------

function CumulativeArea({ months, currentIdx }: { months: YearMonth[]; currentIdx: number }) {
  const W = 1000
  const n = months.length
  let cumSaved = 0, cumTotal = 0
  const pts = months.map((mo, i) => {
    cumSaved += mo.savContrib
    cumTotal += mo.savContrib + Math.max(0, mo.surplus)
    return { x: (i / (n - 1)) * W, saved: cumSaved, total: cumTotal }
  })
  const top = Math.max(...pts.map((p) => p.total)) * 1.1 || 1
  const yv = (v: number) => PLOT_H - (v / top) * PLOT_H
  const line = (key: 'saved' | 'total') =>
    pts.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${yv(p[key]).toFixed(1)}`).join(' ')
  const area = (key: 'saved' | 'total') => `${line(key)} L${W} ${PLOT_H} L0 ${PLOT_H} Z`
  const splitX = currentIdx >= 0 ? (currentIdx / (n - 1)) * W : W
  const endTotal = pts[n - 1].total, endSaved = pts[n - 1].saved

  return (
    <Box sx={{ position: 'relative', pt: '6px' }}>
      <svg viewBox={`0 0 ${W} ${PLOT_H}`} preserveAspectRatio="none" width="100%" height={PLOT_H} style={{ display: 'block', overflow: 'visible' }}>
        {[0.25, 0.5, 0.75, 1].map((g) => (
          <line key={g} x1="0" x2={W} y1={yv(top * g / 1.1)} y2={yv(top * g / 1.1)} stroke={`var(--mui-palette-divider,${brand.zinc[200]})`} strokeWidth="1" vectorEffect="non-scaling-stroke" />
        ))}
        <path d={area('total')} fill={brand.anchor[50]} />
        <path d={area('saved')} fill={brand.anchor[100]} opacity="0.9" />
        <rect x={splitX} y="0" width={W - splitX} height={PLOT_H} fill="#fff" opacity="0.45" />
        <path d={line('saved')} fill="none" stroke={brand.gold[500]} strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
        <path d={line('total')} fill="none" stroke={brand.anchor[600]} strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
        {currentIdx >= 0 && currentIdx < n - 1 && (
          <line x1={splitX} x2={splitX} y1="0" y2={PLOT_H} stroke={brand.gold[500]} strokeWidth="1.5" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
        )}
      </svg>

      <Box sx={{ display: 'flex', mt: '8px' }}>
        {months.map((mo) => (
          <Typography key={mo.m} sx={{
            flex: 1, textAlign: 'center', fontSize: 11,
            fontWeight: mo.status === 'current' ? 700 : 500,
            color: mo.status === 'current' ? 'text.primary' : 'text.secondary',
          }}>
            {MONTHS_SHORT[mo.m]}
          </Typography>
        ))}
      </Box>

      <Box sx={{ position: 'absolute', top: '2px', right: '12px', textAlign: 'right' }}>
        <Eyebrow sx={{ fontSize: '10px' }}>By year end</Eyebrow>
        <Typography sx={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', color: brand.anchor[700], fontVariantNumeric: 'tabular-nums', mt: '3px' }}>
          {fmtMoney(endTotal)}
        </Typography>
        <Typography sx={{ fontSize: 11.5, color: 'text.secondary', mt: '2px', fontVariantNumeric: 'tabular-nums' }}>
          {fmtMoney(endSaved)} into accounts
        </Typography>
      </Box>
    </Box>
  )
}

// ---- Hero chart (bars or cumulative) -------------------------------------

function HeroChart({ months, currentIdx }: { months: YearMonth[]; currentIdx: number }) {
  const [mode, setMode] = useState<'bars' | 'cumulative'>('bars')
  const bars = mode === 'bars'

  const legend = bars
    ? [
        [brand.anchor[200], 'Income'],
        [brand.anchor[600], 'Spent'],
        [brand.gold[500], 'Saved'],
      ]
    : [
        [brand.anchor[600], 'Saved + surplus'],
        [brand.gold[500], 'Into accounts'],
      ]

  return (
    <SurfaceCard sx={{ overflow: 'visible' }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, px: 2.75, pt: 2.25, pb: '6px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <CatGlyph icon={bars ? 'trendingUp' : 'piggyBank'} tone="accent" size={34} />
          <Box>
            <Typography sx={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.01em' }}>
              {bars ? 'Income vs. spending' : 'Money kept, building up'}
            </Typography>
            <Typography sx={{ fontSize: 12.5, color: 'text.secondary', mt: '2px' }}>
              {bars ? 'Each month, side by side — striped months are estimates' : 'Cumulative savings + surplus across the year'}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {legend.map(([c, l]) => (
            <Box key={l} sx={{ display: 'inline-flex', alignItems: 'center', gap: '7px' }}>
              <Box sx={{ width: 10, height: 10, borderRadius: '3px', bgcolor: c, flexShrink: 0 }} />
              <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{l}</Typography>
            </Box>
          ))}
          <Box sx={{ display: 'inline-flex', p: '3px', gap: '2px', bgcolor: 'grey.100', border: '1px solid', borderColor: 'divider', borderRadius: '9px', ml: 1 }}>
            {(['bars', 'cumulative'] as const).map((v) => (
              <Box
                key={v}
                component="button"
                onClick={() => setMode(v)}
                sx={{
                  display: 'inline-flex', alignItems: 'center', height: 28, px: '12px',
                  border: 'none', cursor: 'pointer', borderRadius: '7px',
                  fontFamily: 'var(--font-switzer, inherit)', fontSize: 13, fontWeight: 600,
                  letterSpacing: '-0.005em',
                  bgcolor: mode === v ? '#fff' : 'transparent',
                  color: mode === v ? 'text.primary' : 'text.secondary',
                  boxShadow: mode === v ? brand.shadow.sm : 'none',
                  transition: 'background 150ms ease, color 150ms ease',
                }}
              >
                {v === 'bars' ? 'Bars' : 'Cumulative'}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      <Box sx={{ px: 2.25, pb: 2.25 }}>
        {bars
          ? <CashflowBars months={months} />
          : <CumulativeArea months={months} currentIdx={currentIdx} />}
      </Box>
    </SurfaceCard>
  )
}

// ---- Category totals -------------------------------------------------------

function CategoryTotals({ catYear, total }: { catYear: CatYearData[]; total: number }) {
  const max = catYear.length ? catYear[0].total : 1

  return (
    <SurfaceCard sx={{ overflow: 'hidden' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2.5, py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <CatGlyph icon="scale" tone="accent" size={30} />
          <Box>
            <Typography sx={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em' }}>Where your money goes</Typography>
            <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>Category totals · actuals + on-track estimate</Typography>
          </Box>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Eyebrow sx={{ fontSize: '10px', mb: '3px' }}>Total spend</Eyebrow>
          <Typography sx={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>{fmtMoney(total)}</Typography>
        </Box>
      </Box>

      {catYear.map((c, i) => {
        const share = total > 0 ? c.total / total : 0
        return (
          <Box key={c.id} sx={{
            display: 'flex', alignItems: 'center', gap: 1.5, px: 2.5, py: 1.375,
            borderBottom: i < catYear.length - 1 ? '1px solid' : 'none', borderColor: 'divider',
          }}>
            <CatGlyph icon={c.icon} size={32} tone="neutral" />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                <Typography sx={{ fontSize: 13.5, fontWeight: 600, letterSpacing: '-0.005em' }}>{c.label}</Typography>
                <Typography sx={{ fontSize: 11, color: 'text.disabled' }}>{c.group}</Typography>
              </Box>
              <Box sx={{ mt: '7px', maxWidth: 360 }}>
                <ProgressBar value={c.total / max} color={brand.anchor[600]} thin />
              </Box>
            </Box>
            <Box sx={{ textAlign: 'right', flexShrink: 0, minWidth: 92 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em' }}>{fmtMoney(c.total)}</Typography>
              <Typography sx={{ fontSize: 11.5, color: 'text.secondary', fontVariantNumeric: 'tabular-nums', mt: '2px' }}>
                {(share * 100).toFixed(share < 0.1 ? 1 : 0)}% of spend
              </Typography>
            </Box>
          </Box>
        )
      })}
    </SurfaceCard>
  )
}

// ---- Savings year ----------------------------------------------------------

function SavingsYear({ savYear, total }: { savYear: SavingsYearData[]; total: number }) {
  return (
    <SurfaceCard sx={{ overflow: 'hidden' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, px: 2.25, py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <CatGlyph icon="piggyBank" tone="accent" size={30} />
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em' }}>Savings this year</Typography>
          <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>Projected annual contributions</Typography>
        </Box>
        <Typography sx={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em', color: brand.anchor[700], fontVariantNumeric: 'tabular-nums' }}>
          {fmtMoney(total)}
        </Typography>
      </Box>

      {savYear.map((sv, i) => {
        const lr = sv.annualLimit ? sv.ytd / sv.annualLimit : 0
        const limitBarColor = lr >= 1 ? brand.red[500] : lr >= 0.85 ? brand.gold[500] : brand.anchor[600]
        const limitColor = lr >= 1 ? brand.red[600] : lr >= 0.85 ? brand.amber[700] : 'text.secondary'

        return (
          <Box key={sv.id} sx={{ px: 2.25, py: '13px', borderBottom: i < savYear.length - 1 ? '1px solid' : 'none', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
              <CatGlyph icon={sv.icon} size={28} tone="accent" />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontSize: 13.5, fontWeight: 600, letterSpacing: '-0.005em' }}>{sv.label}</Typography>
                <Typography sx={{ fontSize: 11.5, color: 'text.disabled', mt: '1px' }}>{sv.accountType}</Typography>
              </Box>
              <Typography sx={{ fontSize: 14, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{fmtMoney(sv.total)}</Typography>
            </Box>

            {sv.annualLimit != null && (
              <Box sx={{ mt: '9px' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, mb: '4px' }}>
                  <Typography sx={{ fontSize: 11, color: 'text.disabled' }}>IRS limit · YTD</Typography>
                  <Typography sx={{ fontSize: 11, fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: limitColor }}>
                    {fmtMoney(sv.ytd)} of {fmtMoney(sv.annualLimit)}
                  </Typography>
                </Box>
                <ProgressBar value={lr} color={limitBarColor} thin sx={{ height: 4 }} />
              </Box>
            )}
          </Box>
        )
      })}
    </SurfaceCard>
  )
}

// ---- Goals year -----------------------------------------------------------

function GoalsYear({ goals }: { goals: GoalYearData[] }) {
  return (
    <SurfaceCard sx={{ overflow: 'hidden' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, px: 2.25, py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <CatGlyph icon="target" tone="accent" size={30} />
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em' }}>Goal progress</Typography>
          <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>Where each goal stands</Typography>
        </Box>
      </Box>

      {goals.map((g, i) => {
        const ratio = clamp01(g.target ? g.current / g.target : 0)
        const done = !!g.target && g.current >= g.target
        return (
          <Box key={g.id} sx={{ px: 2.25, py: '13px', borderBottom: i < goals.length - 1 ? '1px solid' : 'none', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: '9px' }}>
              <CatGlyph icon={g.icon} size={26} tone={done ? 'accent' : 'neutral'} />
              <Typography sx={{ flex: 1, fontSize: 13.5, fontWeight: 600, letterSpacing: '-0.005em' }}>{g.name}</Typography>
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
                {Math.round(ratio * 100)}%
              </Typography>
            </Box>
            <ProgressBar value={ratio} color={brand.anchor[600]} thin />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: '7px' }}>
              <Typography sx={{ fontSize: 11.5, color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
                {fmtMoney(g.current)}
                {g.target && <Box component="span" sx={{ color: 'text.disabled' }}> of {fmtMoney(g.target)}</Box>}
              </Typography>
              {g.targetYear != null && g.targetMonth != null && (
                <Typography sx={{ fontSize: 11.5, color: 'text.disabled' }}>
                  by {monthShort(g.targetYear, g.targetMonth)}
                </Typography>
              )}
            </Box>
          </Box>
        )
      })}
    </SurfaceCard>
  )
}

// ---- Composition ----------------------------------------------------------

export function YearView({ year }: { year: number }) {
  const { fetching, hasData, months, catYear, savYear, goalYear, annual, completed, projected, currentLabel, currentIdx } = useBudgetYear(year)

  if (fetching && !hasData) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, minHeight: 400 }}>
        <CircularProgress />
      </Box>
    )
  }

  const totalCatSpend = catYear.reduce((s, c) => s + c.total, 0)
  const totalSaved = savYear.reduce((s, sv) => s + sv.total, 0)

  return (
    <Box sx={{ flex: 1, overflow: 'auto' }}>
      {/* Sticky summary */}
      <Box sx={{ position: 'sticky', top: 0, zIndex: 20, px: 4, pt: 2.75, pb: 1.75, bgcolor: 'background.default' }}>
        <YearSummary annual={annual} completed={completed} projected={projected} currentLabel={currentLabel} />
      </Box>

      {/* Body */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, px: 4, pb: 5.5 }}>
        <HeroChart months={months} currentIdx={currentIdx} />

        <Box sx={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 344px', gap: 3, alignItems: 'start' }}>
          <CategoryTotals catYear={catYear} total={totalCatSpend} />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <SavingsYear savYear={savYear} total={totalSaved} />
            <GoalsYear goals={goalYear} />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
