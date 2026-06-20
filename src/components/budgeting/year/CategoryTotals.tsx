import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { brand } from '@/lib/theme'
import { CatGlyph, Eyebrow, ListRow, PanelHeader, ProgressBar, Row, SurfaceCard } from '@/components/ui'
import { tabularNums } from '@/lib/sx'
import { fmtMoney } from '@/utils/format'
import type { CatYearData } from '@/hooks/useBudgetYear'

export function CategoryTotals({ catYear, total }: { catYear: CatYearData[]; total: number }) {
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
