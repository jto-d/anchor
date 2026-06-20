'use client'

import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import { Row, Stack } from '@/components/ui'
import { useBudgetYear } from '@/hooks/useBudgetYear'
import { YearSummary } from './YearSummary'
import { HeroChart } from './HeroChart'
import { CategoryTotals } from './CategoryTotals'
import { SavingsYear } from './SavingsYear'
import { GoalsYear } from './GoalsYear'

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
      <Box sx={{ position: 'sticky', top: 0, zIndex: 20, px: 4, pt: 2.75, pb: 1.75, bgcolor: 'background.default' }}>
        <YearSummary annual={annual} completed={completed} projected={projected} currentLabel={currentLabel} />
      </Box>

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
