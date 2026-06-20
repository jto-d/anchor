import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { brand } from '@/lib/theme'
import { CatGlyph, ListRow, PanelHeader, ProgressBar, Row, SurfaceCard } from '@/components/ui'
import { tabularNums } from '@/lib/sx'
import { fmtMoney } from '@/utils/format'
import type { SavingsYearData } from '@/hooks/useBudgetYear'

export function SavingsYear({ savYear, total }: { savYear: SavingsYearData[]; total: number }) {
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
