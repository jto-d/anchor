'use client'

import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import { brand } from '@/lib/theme'
import {
  CatGlyph, Dot, Eyebrow, ListRow, PanelHeader, ProgressBar,
  Row, Segmented, Stack, Stat, SurfaceCard, Tag, VDivider,
} from '@/components/ui'
import { tabularNums } from '@/lib/sx'
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

  const cellSx = (hero?: boolean) => ({ flex: hero ? 1.15 : 1, px: { xs: 2, sm: 2.75 } })

  return (
    <SurfaceCard>
      <Row align="stretch" sx={{ py: 2.5, px: 1 }}>
        <Stat label="Income" value={fmtMoney(annual.income)} sub={`${fmtMoney(annual.monthlyIncome)}/mo · full year`} sx={cellSx()} />
        <VDivider sx={{ my: 0.75 }} />
        <Stat label="Spent" value={fmtMoney(annual.spent)} sub={`${Math.round(annual.income > 0 ? annual.spent / annual.income * 100 : 0)}% of income`} sx={cellSx()} />
        <VDivider sx={{ my: 0.75 }} />
        <Stat label="Saved" value={fmtMoney(annual.saved)} sub={`${Math.round(annual.income > 0 ? annual.saved / annual.income * 100 : 0)}% to accounts`} sx={cellSx()} />
        <VDivider sx={{ my: 0.75 }} />
        <Stat
          hero
          label={deficit ? 'Net shortfall' : 'Surplus'}
          value={fmtSigned(annual.surplus)}
          sub={`${Math.round(rate * 100)}% kept or saved`}
          color={deficit ? brand.red[600] : brand.anchor[700]}
          sx={cellSx(true)}
        />
      </Row>
      <Row gap={1.5} wrap sx={{ px: 3.25, pb: 2 }}>
        <Tag tone="accent">✓ {completed} logged</Tag>
        {currentLabel != null && <Tag tone="amber">◷ {MONTHS_LONG[currentLabel]} in progress</Tag>}
        {projected > 0 && <Tag tone="neutral">{projected} projected</Tag>}
        <Typography variant="label" color="text.secondary" sx={{ ml: '2px' }}>
          Estimated months assume your budget is met on-track.
        </Typography>
      </Row>
    </SurfaceCard>
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
                {/* income bar */}
                <Box sx={{
                  width: 13, height: `${h(mo.income)}px`, borderRadius: '3px 3px 0 0',
                  bgcolor: brand.anchor[200], opacity: dim,
                  position: 'relative', overflow: 'hidden', flexShrink: 0,
                }}>
                  {mo.estimated && <Box sx={stripeStyle} />}
                </Box>

                {/* outflow bar: saved (top) + spent (bottom) */}
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

      <Row sx={{ mt: '8px' }}>
        {months.map((mo) => (
          <Typography key={mo.m} sx={{
            flex: 1, textAlign: 'center', fontSize: 11,
            fontWeight: mo.status === 'current' ? 700 : 500,
            color: mo.status === 'current' ? 'text.primary' : 'text.secondary',
          }}>
            {MONTHS_SHORT[mo.m]}
          </Typography>
        ))}
      </Row>

      <Box sx={{ position: 'absolute', top: '2px', right: '12px', textAlign: 'right' }}>
        <Eyebrow sx={{ fontSize: '10px' }}>By year end</Eyebrow>
        <Typography variant="statLg" sx={{ color: brand.anchor[700], mt: '3px' }}>
          {fmtMoney(endTotal)}
        </Typography>
        <Typography variant="note" sx={{ color: 'text.secondary', mt: '2px', ...tabularNums }}>
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
      <Row align="start" justify="between" gap={2} sx={{ px: 2.75, pt: 2.25, pb: '6px' }}>
        <Row gap={1.5}>
          <CatGlyph icon={bars ? 'trendingUp' : 'piggyBank'} tone="accent" size={34} />
          <Box>
            <Typography variant="cardTitle">
              {bars ? 'Income vs. spending' : 'Money kept, building up'}
            </Typography>
            <Typography variant="label" color="text.secondary" sx={{ mt: '2px' }}>
              {bars ? 'Each month, side by side — striped months are estimates' : 'Cumulative savings + surplus across the year'}
            </Typography>
          </Box>
        </Row>

        <Row gap={2} wrap justify="end" sx={{ flexShrink: 0 }}>
          {legend.map(([c, l]) => (
            <Row key={l} inline gap="7px">
              <Dot size={10} square color={c} />
              <Typography variant="label" color="text.secondary">{l}</Typography>
            </Row>
          ))}
          <Box sx={{ ml: 1 }}>
            <Segmented
              size="sm"
              value={mode}
              onChange={(v) => setMode(v as 'bars' | 'cumulative')}
              options={[{ value: 'bars', label: 'Bars' }, { value: 'cumulative', label: 'Cumulative' }]}
            />
          </Box>
        </Row>
      </Row>

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
      <PanelHeader
        icon="scale"
        title="Where your money goes"
        subtitle="Category totals · actuals + on-track estimate"
        sx={{ px: 2.5 }}
        action={
          <Box sx={{ textAlign: 'right' }}>
            <Eyebrow sx={{ fontSize: '10px', mb: '3px' }}>Total spend</Eyebrow>
            <Typography sx={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em', ...tabularNums }}>{fmtMoney(total)}</Typography>
          </Box>
        }
      />

      {catYear.map((c, i) => {
        const share = total > 0 ? c.total / total : 0
        return (
          <ListRow key={c.id} last={i === catYear.length - 1} gap={1.5} sx={{ py: 1.375 }}>
            <CatGlyph icon={c.icon} size={32} tone="neutral" />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Row align="baseline" gap={1}>
                <Typography variant="bodyStrong">{c.label}</Typography>
                <Typography variant="note" color="text.disabled">{c.group}</Typography>
              </Row>
              <Box sx={{ mt: '7px', maxWidth: 360 }}>
                <ProgressBar value={c.total / max} color={brand.anchor[600]} thin />
              </Box>
            </Box>
            <Box sx={{ textAlign: 'right', flexShrink: 0, minWidth: 92 }}>
              <Typography variant="bodyStrong" sx={{ ...tabularNums }}>{fmtMoney(c.total)}</Typography>
              <Typography variant="note" sx={{ color: 'text.secondary', mt: '2px', ...tabularNums }}>
                {(share * 100).toFixed(share < 0.1 ? 1 : 0)}% of spend
              </Typography>
            </Box>
          </ListRow>
        )
      })}
    </SurfaceCard>
  )
}

// ---- Savings year ----------------------------------------------------------

function SavingsYear({ savYear, total }: { savYear: SavingsYearData[]; total: number }) {
  return (
    <SurfaceCard sx={{ overflow: 'hidden' }}>
      <PanelHeader
        icon="piggyBank"
        title="Savings this year"
        subtitle="Projected annual contributions"
        action={
          <Typography sx={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em', color: brand.anchor[700], ...tabularNums }}>
            {fmtMoney(total)}
          </Typography>
        }
      />

      {savYear.map((sv, i) => {
        const lr = sv.annualLimit ? sv.ytd / sv.annualLimit : 0
        const limitBarColor = lr >= 1 ? brand.red[500] : lr >= 0.85 ? brand.gold[500] : brand.anchor[600]
        const limitColor = lr >= 1 ? brand.red[600] : lr >= 0.85 ? brand.amber[700] : 'text.secondary'

        return (
          <ListRow key={sv.id} direction="column" last={i === savYear.length - 1} sx={{ px: 2.25, py: '13px' }}>
            <Row gap={1.25}>
              <CatGlyph icon={sv.icon} size={28} tone="accent" />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="bodyStrong">{sv.label}</Typography>
                <Typography variant="note" color="text.disabled" sx={{ mt: '1px' }}>{sv.accountType}</Typography>
              </Box>
              <Typography variant="bodyStrong" sx={{ ...tabularNums }}>{fmtMoney(sv.total)}</Typography>
            </Row>

            {sv.annualLimit != null && (
              <Box sx={{ mt: '9px' }}>
                <Row justify="between" sx={{ mb: '4px' }}>
                  <Typography variant="note" color="text.disabled">IRS limit · YTD</Typography>
                  <Typography variant="note" sx={{ fontWeight: 600, color: limitColor, ...tabularNums }}>
                    {fmtMoney(sv.ytd)} of {fmtMoney(sv.annualLimit)}
                  </Typography>
                </Row>
                <ProgressBar value={lr} color={limitBarColor} thin sx={{ height: 4 }} />
              </Box>
            )}
          </ListRow>
        )
      })}
    </SurfaceCard>
  )
}

// ---- Goals year -----------------------------------------------------------

function GoalsYear({ goals }: { goals: GoalYearData[] }) {
  return (
    <SurfaceCard sx={{ overflow: 'hidden' }}>
      <PanelHeader icon="target" title="Goal progress" subtitle="Where each goal stands" />

      {goals.map((g, i) => {
        const ratio = clamp01(g.target ? g.current / g.target : 0)
        const done = !!g.target && g.current >= g.target
        return (
          <ListRow key={g.id} direction="column" last={i === goals.length - 1} sx={{ px: 2.25, py: '13px' }}>
            <Row gap={1.25} sx={{ mb: '9px' }}>
              <CatGlyph icon={g.icon} size={26} tone={done ? 'accent' : 'neutral'} />
              <Typography variant="bodyStrong" sx={{ flex: 1 }}>{g.name}</Typography>
              <Typography variant="label" sx={{ fontWeight: 600, color: 'text.secondary', ...tabularNums }}>
                {Math.round(ratio * 100)}%
              </Typography>
            </Row>
            <ProgressBar value={ratio} color={brand.anchor[600]} thin />
            <Row justify="between" sx={{ mt: '7px' }}>
              <Typography variant="note" sx={{ color: 'text.secondary', ...tabularNums }}>
                {fmtMoney(g.current)}
                {g.target && <Box component="span" sx={{ color: 'text.disabled' }}> of {fmtMoney(g.target)}</Box>}
              </Typography>
              {g.targetYear != null && g.targetMonth != null && (
                <Typography variant="note" color="text.disabled">
                  by {monthShort(g.targetYear, g.targetMonth)}
                </Typography>
              )}
            </Row>
          </ListRow>
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
      <Row justify="center" sx={{ flex: 1, minHeight: 400 }}>
        <CircularProgress />
      </Row>
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
      <Stack gap={3} sx={{ px: 4, pb: 5.5 }}>
        <HeroChart months={months} currentIdx={currentIdx} />

        <Box sx={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 344px', gap: 3, alignItems: 'start' }}>
          <CategoryTotals catYear={catYear} total={totalCatSpend} />
          <Stack gap={3}>
            <SavingsYear savYear={savYear} total={totalSaved} />
            <GoalsYear goals={goalYear} />
          </Stack>
        </Box>
      </Stack>
    </Box>
  )
}
