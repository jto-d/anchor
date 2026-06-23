'use client'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import AccessTimeIcon from '@mui/icons-material/AccessTimeOutlined'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonthOutlined'
import CheckIcon from '@mui/icons-material/CheckOutlined'
import { brand } from '@/lib/theme'
import { Row, SurfaceCard, PanelHeader, CatGlyph } from '@/components/ui'
import { fmtMoney } from '@/utils/format'
import { fmtSubDate, PERIOD_LABEL } from '@/data/subscriptionData'
import type { RenewalItem } from '@/data/subscriptionData'

function dayBadge(days: number): { label: string; soon: boolean } {
  if (days <= 0) return { label: 'Today', soon: true }
  if (days === 1) return { label: 'Tomorrow', soon: true }
  if (days <= 3) return { label: `In ${days} days`, soon: true }
  return { label: `In ${days} days`, soon: false }
}

function RenewalTile({ item }: { item: RenewalItem }) {
  const { sub, date, days, net, covered, status } = item
  const badge = dayBadge(days)
  const fullyCovered = status === 'covered'
  const isSoon = badge.soon

  return (
    <Box
      sx={{
        flex: 'none',
        width: 168,
        p: '13px 14px 14px',
        borderRadius: '12px',
        border: '1px solid',
        borderColor: isSoon ? brand.amber[50] + '80' : 'divider',
        bgcolor: isSoon ? brand.amber[50] : '#fff',
        transition: 'box-shadow 0.15s ease',
        '&:hover': { boxShadow: brand.shadow.sm },
      }}
    >
      <Row gap={0.75} sx={{ mb: 1.5 }}>
        {isSoon
          ? <AccessTimeIcon sx={{ fontSize: 13, color: brand.amber[700] }} />
          : <CalendarMonthIcon sx={{ fontSize: 13, color: 'grey.400' }} />}
        <Typography
          sx={{
            fontSize: 11.5,
            fontWeight: 600,
            color: isSoon ? brand.amber[700] : 'grey.600',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {fmtSubDate(date)}
        </Typography>
        <Typography sx={{ ml: 'auto', fontSize: 10.5, fontWeight: 600, color: isSoon ? brand.amber[700] : 'grey.400' }}>
          {badge.label}
        </Typography>
      </Row>

      <Row gap={1.125} sx={{ mb: 1.375 }}>
        <CatGlyph icon={sub.icon} size={28} tone={fullyCovered ? 'accent' : 'neutral'} />
        <Box sx={{ minWidth: 0 }}>
          <Typography
            noWrap
            sx={{ fontSize: 13, fontWeight: 600, letterSpacing: '-0.005em', color: 'text.primary' }}
          >
            {sub.name}
          </Typography>
          <Typography sx={{ fontSize: 11, color: 'grey.400' }}>{PERIOD_LABEL[sub.period]}</Typography>
        </Box>
      </Row>

      <Row justify="between" align="end">
        <Typography
          sx={{
            fontSize: 15,
            fontWeight: 600,
            letterSpacing: '-0.01em',
            fontVariantNumeric: 'tabular-nums',
            color: fullyCovered ? brand.anchor[700] : 'text.primary',
          }}
        >
          {fmtMoney(net)}
        </Typography>
        {covered > 0 && (
          <Row gap={0.375} sx={{ fontSize: 11, fontWeight: 600, color: brand.anchor[600] }}>
            <CheckIcon sx={{ fontSize: 12 }} />
            {fullyCovered ? 'Covered' : `−${fmtMoney(covered)}`}
          </Row>
        )}
      </Row>
    </Box>
  )
}

export function SubRenewalStrip({ items }: { items: RenewalItem[] }) {
  const total = items.reduce((s, it) => s + it.net, 0)

  return (
    <SurfaceCard sx={{ overflow: 'hidden' }}>
      <PanelHeader
        icon="clockAlert"
        tone="amber"
        title="Renewing soon"
        subtitle="Charges landing in the next 30 days"
        action={
          items.length > 0 ? (
            <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
              <Typography sx={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.015em', fontVariantNumeric: 'tabular-nums' }}>
                {fmtMoney(total)}
              </Typography>
              <Typography sx={{ fontSize: 11.5, color: 'grey.500' }}>
                {items.length} charge{items.length === 1 ? '' : 's'} · you pay
              </Typography>
            </Box>
          ) : undefined
        }
      />
      {items.length === 0 ? (
        <Box sx={{ py: 3.5, textAlign: 'center' }}>
          <Typography sx={{ fontSize: 13, color: 'grey.400' }}>Nothing renews in the next 30 days.</Typography>
        </Box>
      ) : (
        <Row gap={1.5} sx={{ px: 2.5, py: 2, overflowX: 'auto', flexWrap: 'nowrap' }}>
          {items.map((it) => <RenewalTile key={it.sub.id} item={it} />)}
        </Row>
      )}
    </SurfaceCard>
  )
}
