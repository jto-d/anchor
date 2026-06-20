import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { brand } from '@/lib/theme'
import { CatGlyph, ListRow, PanelHeader, ProgressBar, Row, SurfaceCard } from '@/components/ui'
import { tabularNums } from '@/lib/sx'
import { fmtMoney, clamp01, monthShort } from '@/utils/format'
import type { GoalYearData } from '@/hooks/useBudgetYear'

export function GoalsYear({ goals }: { goals: GoalYearData[] }) {
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
