import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { CatGlyph, ListRow, PanelHeader, ProgressBar, Row, SurfaceCard } from '@/components/ui'
import { brand } from '@/lib/theme'
import { tabularNums } from '@/lib/sx'
import { fmtMoney, monthShort, clamp01 } from '@/utils/format'
import type { GoalData } from '@/utils/budget'

export function GoalsRecap({ goals }: { goals: GoalData[] }) {
  return (
    <SurfaceCard>
      <PanelHeader icon="target" title="Goal progress" subtitle="Running totals to date" />
      {goals.map((g, i) => {
        const current = g.running + g.monthAllocated
        const ratio = clamp01(g.target ? current / g.target : 0)
        const done = !!g.target && current >= g.target
        return (
          <ListRow key={g.id} direction="column" last={i === goals.length - 1} sx={{ px: 2.25, py: 1.625 }}>
            <Row gap={1.25} sx={{ mb: 1.1 }}>
              <CatGlyph icon={g.icon} size={26} tone={done ? 'accent' : 'neutral'} />
              <Typography variant="bodyStrong" sx={{ flex: 1 }}>{g.name}</Typography>
              <Typography variant="label" sx={{ fontWeight: 600, color: 'text.secondary', ...tabularNums }}>
                {Math.round(ratio * 100)}%
              </Typography>
            </Row>
            <ProgressBar value={ratio} color={brand.anchor[600]} thin />
            <Row justify="between" sx={{ mt: '7px' }}>
              <Typography variant="note" sx={{ color: 'text.secondary', ...tabularNums }}>
                {fmtMoney(current)}
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
