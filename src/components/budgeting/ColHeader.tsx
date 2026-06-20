import Box from '@mui/material/Box'
import { Eyebrow, Row } from '@/components/ui'

/** Fixed width of each numeric ledger column (Budget / Spent / Left). */
export const COL_W = 102

/** The column-label row at the top of the budget ledger. */
export function ColHeader() {
  const col = (label: string) => (
    <Box sx={{ width: COL_W, textAlign: 'right' }}>
      <Eyebrow sx={{ fontSize: '10px' }}>{label}</Eyebrow>
    </Box>
  )
  return (
    <Row gap={1} sx={{ px: 2.5, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
      <Box sx={{ flex: 1 }}><Eyebrow sx={{ fontSize: '10px' }}>Category</Eyebrow></Box>
      {col('Budget')}
      {col('Spent')}
      {col('Left')}
      <Box sx={{ width: 28 }} />
    </Row>
  )
}
