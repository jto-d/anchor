'use client'

import { useState } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { brand } from '@/lib/theme'
import { Row, Stack } from '@/components/ui'
import { Topbar } from '@/components/layout/Topbar'
import { useBudgetYear } from '@/hooks/useBudgetYear'
import { YearSummary } from './YearSummary'
import { HeroChart } from './HeroChart'
import { CategoryTotals } from './CategoryTotals'
import { SavingsYear } from './SavingsYear'
import { GoalsYear } from './GoalsYear'

export function YearView() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const atMax = year >= now.getFullYear()

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

  const yearStepper = (
    <Row inline gap="2px" sx={{ p: '3px', bgcolor: 'grey.100', border: '1px solid', borderColor: 'divider', borderRadius: '9px' }}>
      <IconButton size="small" onClick={() => setYear((y) => y - 1)}
        sx={{ width: 32, height: 32, borderRadius: '7px', color: 'text.secondary', '&:hover': { bgcolor: '#fff', boxShadow: brand.shadow.sm } }}>
        <ChevronLeftIcon sx={{ fontSize: 17 }} />
      </IconButton>
      <Typography variant="bodyStrong" sx={{ minWidth: 52, textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>
        {year}
      </Typography>
      <IconButton size="small" onClick={() => setYear((y) => y + 1)} disabled={atMax}
        sx={{ width: 32, height: 32, borderRadius: '7px', color: atMax ? 'text.disabled' : 'text.secondary', '&:hover': { bgcolor: atMax ? 'transparent' : '#fff', boxShadow: atMax ? 'none' : brand.shadow.sm } }}>
        <ChevronRightIcon sx={{ fontSize: 17 }} />
      </IconButton>
    </Row>
  )

  return (
    <Box sx={{ flex: 1, overflow: 'auto' }}>
      <Topbar title="Year" rightSlot={yearStepper} />
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
