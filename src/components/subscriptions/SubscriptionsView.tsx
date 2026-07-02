'use client'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import AddIcon from '@mui/icons-material/Add'
import { useQuery, useMutation } from '@urql/next'
import { useState } from 'react'
import { Row, Stack } from '@/components/ui'
import { SubSummaryStrip } from './SubSummaryStrip'
import { SubRenewalStrip } from './SubRenewalStrip'
import { SubLedger } from './SubLedger'
import { AddSubscriptionDialog } from './AddSubscriptionDialog'
import { RemoveSubscriptionDialog } from './RemoveSubscriptionDialog'
import { Topbar } from '@/components/layout/Topbar'
import {
  SubscriptionsDocument,
  AddSubscriptionDocument,
  RemoveSubscriptionDocument,
  UpdateSubscriptionDocument,
} from './subscriptions.queries'
import {
  computeSummary,
  computeRenewals,
} from '@/data/subscriptionData'
import type { Subscription, SubCard } from '@/data/subscriptionData'
import type { GroupingMode } from './SubLedger'

interface SubscriptionsViewProps {
  cards: SubCard[]
}

function toSub(row: {
  id: string
  name: string
  cat: string
  icon: string
  cost: number
  period: string
  day: number
  renewM?: number | null
  cardId: string
  plan?: string | null
  paused: boolean
  cancelPending: boolean
  shared: boolean
}): Subscription {
  return {
    id: row.id,
    name: row.name,
    cat: row.cat,
    icon: row.icon,
    cost: row.cost,
    period: row.period as Subscription['period'],
    day: row.day,
    renewM: row.renewM ?? undefined,
    cardId: row.cardId,
    plan: row.plan ?? undefined,
    paused: row.paused,
    cancelPending: row.cancelPending,
    shared: row.shared,
  }
}

export function SubscriptionsView({ cards }: SubscriptionsViewProps) {
  const [addOpen, setAddOpen] = useState(false)
  const [removeConfirmId, setRemoveConfirmId] = useState<string | null>(null)
  const grouping: GroupingMode = 'cadence'

  const [{ data, fetching }, reexecuteQuery] = useQuery({ query: SubscriptionsDocument })
  const [, addSubscription] = useMutation(AddSubscriptionDocument)
  const [, removeSubscription] = useMutation(RemoveSubscriptionDocument)
  const [, updateSubscription] = useMutation(UpdateSubscriptionDocument)

  const subs: Subscription[] = (data?.subscriptions ?? []).map(toSub)
  const subToRemove = subs.find((s) => s.id === removeConfirmId) ?? null

  const summary = computeSummary(subs)
  const renewals = computeRenewals(subs)

  const handlers = {
    onSetCost: (id: string, cost: number) => {
      updateSubscription({ id, cost })
    },
    onRename: (id: string, name: string) => {
      updateSubscription({ id, name })
    },
    onTogglePause: (id: string) => {
      const sub = subs.find((s) => s.id === id)
      if (sub) updateSubscription({ id, paused: !sub.paused })
    },
    onToggleCancelPending: (id: string) => {
      const sub = subs.find((s) => s.id === id)
      if (sub) updateSubscription({ id, cancelPending: !sub.cancelPending })
    },
    onToggleShared: (id: string) => {
      const sub = subs.find((s) => s.id === id)
      if (sub) updateSubscription({ id, shared: !sub.shared })
    },
    onRemove: (id: string) => setRemoveConfirmId(id),
  }

  return (
    <Box sx={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      <Topbar
        title="Subscriptions"
        subtitle="Every recurring charge — and the card it's billed to."
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

      {fetching && subs.length === 0 ? (
        <Row justify="center" sx={{ pt: 6 }}>
          <CircularProgress size={28} />
        </Row>
      ) : (
        <>
          <Box sx={{ position: 'sticky', top: 0, zIndex: 20, px: 4, pt: 2.75, pb: 1.75, bgcolor: 'background.default' }}>
            <SubSummaryStrip totals={summary} />
          </Box>

          <Stack gap={3} sx={{ px: 4, pb: 2 }}>
            <SubRenewalStrip items={renewals} />
          </Stack>

          <Box sx={{ px: 4, pb: 5.5 }}>
            <SubLedger subs={subs} grouping={grouping} handlers={handlers} cards={cards} />
          </Box>
        </>
      )}

      <AddSubscriptionDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={(sub) => {
          addSubscription({
            name: sub.name,
            cat: sub.cat,
            icon: sub.icon,
            cost: sub.cost,
            period: sub.period,
            day: sub.day,
            renewM: sub.renewM ?? null,
            cardId: sub.cardId,
            plan: sub.plan ?? null,
            shared: sub.shared ?? false,
          })
        }}
        cards={cards}
      />

      <RemoveSubscriptionDialog
        subName={subToRemove?.name ?? null}
        onClose={() => setRemoveConfirmId(null)}
        onConfirm={async () => {
          if (removeConfirmId) {
            await removeSubscription({ id: removeConfirmId })
            reexecuteQuery({ requestPolicy: 'network-only' })
          }
          setRemoveConfirmId(null)
        }}
      />
    </Box>
  )
}
