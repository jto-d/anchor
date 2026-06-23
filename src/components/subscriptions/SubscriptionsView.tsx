'use client'

import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'
import { Row, Stack } from '@/components/ui'
import { SubSummaryStrip } from './SubSummaryStrip'
import { SubRenewalStrip } from './SubRenewalStrip'
import { SubLedger } from './SubLedger'
import { CardBreakdown } from './CardBreakdown'
import { AddSubscriptionDialog } from './AddSubscriptionDialog'
import { RemoveSubscriptionDialog } from './RemoveSubscriptionDialog'
import { Topbar } from '@/components/layout/Topbar'
import {
  computeSummary,
  computeRenewals,
  computeByCard,
} from '@/data/subscriptionData'
import type { Subscription, SubCard } from '@/data/subscriptionData'
import type { GroupingMode } from './SubLedger'

interface SubscriptionsViewProps {
  cards: SubCard[]
}

export function SubscriptionsView({ cards }: SubscriptionsViewProps) {
  const [subs, setSubs] = useState<Subscription[]>([])
  const [addOpen, setAddOpen] = useState(false)
  const [removeConfirmId, setRemoveConfirmId] = useState<string | null>(null)
  const grouping: GroupingMode = 'cadence'

  const summary = computeSummary(subs)
  const renewals = computeRenewals(subs)
  const byCard = computeByCard(subs, cards)

  const subToRemove = subs.find((s) => s.id === removeConfirmId) ?? null

  const handlers = {
    onSetCost: (id: string, cost: number) =>
      setSubs((prev) => prev.map((s) => s.id === id ? { ...s, cost } : s)),
    onRename: (id: string, name: string) =>
      setSubs((prev) => prev.map((s) => s.id === id ? { ...s, name } : s)),
    onTogglePause: (id: string) =>
      setSubs((prev) => prev.map((s) => s.id === id ? { ...s, paused: !s.paused } : s)),
    onRemove: (id: string) => setRemoveConfirmId(id),
  }

  return (
    <Box sx={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      <Topbar
        title="Subscriptions"
        subtitle="Every recurring charge — and which card credit quietly covers it."
        rightSlot={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ height: 38, flex: 'none' }}
            onClick={() => setAddOpen(true)}
          >
            Add subscription
          </Button>
        }
      />

      <Box sx={{ position: 'sticky', top: 0, zIndex: 20, px: 4, pt: 2.75, pb: 1.75, bgcolor: 'background.default' }}>
        <SubSummaryStrip totals={summary} />
      </Box>

      <Stack gap={3} sx={{ px: 4, pb: 2 }}>
        <SubRenewalStrip items={renewals} />
      </Stack>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 320px',
          gap: 3,
          alignItems: 'start',
          px: 4,
          pb: 5.5,
        }}
      >
        <SubLedger subs={subs} grouping={grouping} handlers={handlers} cards={cards} />
        <CardBreakdown byCard={byCard} />
      </Box>

      <AddSubscriptionDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={(sub) => setSubs((prev) => [...prev, sub])}
        cards={cards}
      />

      <RemoveSubscriptionDialog
        subName={subToRemove?.name ?? null}
        onClose={() => setRemoveConfirmId(null)}
        onConfirm={() => {
          if (removeConfirmId) setSubs((prev) => prev.filter((s) => s.id !== removeConfirmId))
          setRemoveConfirmId(null)
        }}
      />
    </Box>
  )
}
