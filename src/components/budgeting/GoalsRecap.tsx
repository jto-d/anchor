import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { CatGlyph } from '@/components/ui/CatGlyph'
import { SurfaceCard } from './SurfaceCard'
import { ThinProgressBar } from './ThinProgressBar'
import { fmtMoney, monthShort, clamp01 } from './format'
import type { GoalData } from './types'

/** Read-only sidebar recap of every goal's running progress to date. */
export function GoalsRecap({ goals }: { goals: GoalData[] }) {
  return (
    <SurfaceCard>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, px: 2.25, py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <CatGlyph icon="target" tone="accent" size={30} />
        <Box>
          <Typography sx={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em' }}>Goal progress</Typography>
          <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>Running totals to date</Typography>
        </Box>
      </Box>
      {goals.map((g, i) => {
        const current = g.running + g.monthAllocated
        const ratio = clamp01(g.target ? current / g.target : 0)
        const done = !!g.target && current >= g.target
        return (
          <Box key={g.id} sx={{ px: 2.25, py: 1.625, borderBottom: i < goals.length - 1 ? '1px solid' : 'none', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 1.1 }}>
              <CatGlyph icon={g.icon} size={26} tone={done ? 'accent' : 'neutral'} />
              <Typography sx={{ flex: 1, fontSize: 13.5, fontWeight: 600, letterSpacing: '-0.005em' }}>{g.name}</Typography>
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
                {Math.round(ratio * 100)}%
              </Typography>
            </Box>
            <ThinProgressBar value={ratio} tone={done ? 'pos' : 'accent'} height={5} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: '7px' }}>
              <Typography sx={{ fontSize: 11.5, color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
                {fmtMoney(current)}
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
