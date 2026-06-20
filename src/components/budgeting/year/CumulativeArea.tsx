import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { brand } from '@/lib/theme'
import { Eyebrow, Row } from '@/components/ui'
import { tabularNums } from '@/lib/sx'
import { fmtMoney } from '@/utils/format'
import type { YearMonth } from '@/hooks/useBudgetYear'
import { MONTHS_SHORT, PLOT_H } from './constants'

export function CumulativeArea({ months, currentIdx }: { months: YearMonth[]; currentIdx: number }) {
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
