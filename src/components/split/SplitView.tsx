'use client'

import { useState, useMemo } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import AddIcon from '@mui/icons-material/Add'
import ScaleIcon from '@mui/icons-material/Balance'
import HistoryIcon from '@mui/icons-material/History'
import EditIcon from '@mui/icons-material/EditOutlined'
import { useQuery, useMutation } from '@urql/next'
import { Topbar } from '@/components/layout/Topbar'
import { Segmented, Row, useToast } from '@/components/ui'
import { brand } from '@/lib/theme'
import {
  groupByMonth,
  monthTotals,
  balanceStatus,
  monthKey,
  monthLabel,
  currentYearMonth,
  subscriptionSplits,
  type SplitExpense,
  type SplitSettlement,
  type SplitMonth,
  type SharedSubInput,
} from '@/data/splitData'
import {
  SplitDataDocument,
  SetSplitPartnerDocument,
  AddSplitExpenseDocument,
  UpdateSplitExpenseDocument,
  RemoveSplitExpenseDocument,
  AddSplitSettlementDocument,
  RemoveSplitSettlementDocument,
  ExcludeSubscriptionSplitDocument,
  RestoreSubscriptionSplitDocument,
} from './split.queries'
import { SummaryStrip, ExpenseLedger, SettlementHistory } from './SplitLedger'
import { MonthHistory } from './SplitHistory'
import {
  AddExpenseDialog,
  SettleUpDialog,
  ConfirmRemoveDialog,
  SetPartnerDialog,
  type ExpenseDraft,
} from './SplitDialogs'
import { PersonAvatar } from './SplitPrimitives'

type SplitView = 'dashboard' | 'history'

type Confirm =
  | { kind: 'expense'; id: string; label: string }
  | { kind: 'settlement'; id: string }
  | { kind: 'subscription'; subId: string; label: string }

const DEFAULT_PARTNER = 'Your partner'

function toLocalExpense(e: {
  id: string; year: number; month: number; date?: string | null
  desc: string; amount: number; payer: string; cat: string
  splitYou: number; splitThem: number; createdAt: string
}): SplitExpense {
  return { ...e, date: e.date ?? null }
}

function toLocalSettlement(s: {
  id: string; year: number; month: number; date?: string | null
  amount: number; fromPayer: string; createdAt: string
}): SplitSettlement {
  return { ...s, date: s.date ?? null }
}

/** Key identifying one subscription's split in one month. */
function exclusionKey(subId: string, year: number, month: number): string {
  return `${subId}:${year}:${month}`
}

/** Merge read-only auto-split subscription entries into a month's expenses,
 *  skipping any the user has excluded for that month. */
function withSubscriptions(month: SplitMonth, subs: SharedSubInput[], excluded: Set<string>): SplitMonth {
  const subExpenses = subscriptionSplits(subs, month.year, month.month).filter(
    (e) => !excluded.has(exclusionKey(e.subId!, month.year, month.month)),
  )
  if (subExpenses.length === 0) return month
  return { ...month, expenses: [...month.expenses, ...subExpenses] }
}

export function SplitView() {
  const [{ data, fetching, error }, reexecute] = useQuery({ query: SplitDataDocument })
  const [, setSplitPartner] = useMutation(SetSplitPartnerDocument)
  const [, addExpense] = useMutation(AddSplitExpenseDocument)
  const [, updateExpense] = useMutation(UpdateSplitExpenseDocument)
  const [, removeExpense] = useMutation(RemoveSplitExpenseDocument)
  const [, addSettlement] = useMutation(AddSplitSettlementDocument)
  const [, removeSettlement] = useMutation(RemoveSplitSettlementDocument)
  const [, excludeSubSplit] = useMutation(ExcludeSubscriptionSplitDocument)
  const [, restoreSubSplit] = useMutation(RestoreSubscriptionSplitDocument)

  const [view, setView] = useState<SplitView>('dashboard')
  const [selectedKey, setSelectedKey] = useState<string>(() => {
    const { year, month } = currentYearMonth()
    return monthKey(year, month)
  })
  const [addOpen, setAddOpen] = useState(false)
  const [settleOpen, setSettleOpen] = useState(false)
  const [confirm, setConfirm] = useState<Confirm | null>(null)
  const [partnerOpen, setPartnerOpen] = useState(false)
  const notify = useToast()

  const partnerName = data?.splitPartner?.name ?? DEFAULT_PARTNER
  const expenses = useMemo(() => (data?.splitExpenses ?? []).map(toLocalExpense), [data])
  const settlements = useMemo(() => (data?.splitSettlements ?? []).map(toLocalSettlement), [data])
  const months = useMemo(() => groupByMonth(expenses, settlements), [expenses, settlements])
  const sharedSubs = useMemo<SharedSubInput[]>(
    () =>
      (data?.subscriptions ?? [])
        .filter((s) => s.shared)
        .map((s) => ({
          id: s.id,
          name: s.name,
          cat: s.cat,
          cost: s.cost,
          period: s.period as SharedSubInput['period'],
          day: s.day,
          renewM: s.renewM ?? undefined,
          shared: s.shared,
          paused: s.paused,
          cancelPending: s.cancelPending,
        })),
    [data],
  )
  const excludedKeys = useMemo(
    () =>
      new Set(
        (data?.subscriptionSplitExclusions ?? []).map((x) =>
          exclusionKey(x.subscriptionId, x.year, x.month),
        ),
      ),
    [data],
  )

  const currentMonthKey = useMemo(() => {
    const { year, month } = currentYearMonth()
    return monthKey(year, month)
  }, [])

  const selectedMonth = months.find((m) => m.key === selectedKey) ?? {
    key: selectedKey,
    year: parseInt(selectedKey.split('-')[0]),
    month: parseInt(selectedKey.split('-')[1]) - 1,
    label: monthLabel(parseInt(selectedKey.split('-')[0]), parseInt(selectedKey.split('-')[1]) - 1),
    expenses: [],
    settlements: [],
  }

  const selectedMonthWithSubs = useMemo(
    () => withSubscriptions(selectedMonth, sharedSubs, excludedKeys),
    [selectedMonth, sharedSubs, excludedKeys],
  )
  const monthsWithSubs = useMemo(
    () => months.map((m) => withSubscriptions(m, sharedSubs, excludedKeys)),
    [months, sharedSubs, excludedKeys],
  )
  // Subscriptions that would charge in the selected month but have been excluded — offered for restore.
  const hiddenSubs = useMemo(
    () =>
      subscriptionSplits(sharedSubs, selectedMonth.year, selectedMonth.month)
        .filter((e) => excludedKeys.has(exclusionKey(e.subId!, selectedMonth.year, selectedMonth.month)))
        .map((e) => ({ subId: e.subId!, name: e.desc })),
    [sharedSubs, selectedMonth.year, selectedMonth.month, excludedKeys],
  )

  const idx = months.findIndex((m) => m.key === selectedKey)
  // idx === -1 means selectedKey is the current (empty) month, not yet in the list.
  // canPrev: there is an older month to go to (higher index in newest-first array),
  //          OR we're on the empty current month and there are actual months below it.
  const canPrev = idx === -1 ? months.length > 0 : idx < months.length - 1
  const canNext = idx > 0
  const totals = useMemo(() => monthTotals(selectedMonthWithSubs), [selectedMonthWithSubs])
  const status = useMemo(() => balanceStatus(totals.net), [totals.net])

  async function handleAddExpense(payload: { desc: string; amount: number; date: string | null; payer: string; cat: string; splitYou: number; splitThem: number }) {
    const { year, month } = selectedMonth
    await addExpense({
      year,
      month,
      date: payload.date,
      desc: payload.desc,
      amount: payload.amount,
      payer: payload.payer,
      cat: payload.cat,
      splitYou: payload.splitYou,
      splitThem: payload.splitThem,
    })
    reexecute({ requestPolicy: 'network-only' })
    setAddOpen(false)
    notify('Expense added.')
  }

  async function handleSaveExpense(id: string, patch: Partial<ExpenseDraft>) {
    await updateExpense({
      id,
      ...(patch.desc != null && { desc: patch.desc }),
      ...(patch.date !== undefined && { date: patch.date }),
      ...(patch.amount != null && { amount: Number(patch.amount) }),
      ...(patch.payer != null && { payer: patch.payer }),
      ...(patch.cat != null && { cat: patch.cat }),
      ...(patch.splitYou != null && { splitYou: patch.splitYou }),
      ...(patch.splitThem != null && { splitThem: patch.splitThem }),
    })
    reexecute({ requestPolicy: 'network-only' })
    notify('Expense updated.')
  }

  async function handleRemoveExpense() {
    if (confirm?.kind !== 'expense') return
    await removeExpense({ id: confirm.id })
    reexecute({ requestPolicy: 'network-only' })
    setConfirm(null)
    notify('Expense removed.')
  }

  async function handleSettle(payload: { amount: number; date: string | null; fromPayer: string }) {
    const { year, month } = selectedMonth
    await addSettlement({
      year,
      month,
      date: payload.date,
      amount: payload.amount,
      fromPayer: payload.fromPayer,
    })
    reexecute({ requestPolicy: 'network-only' })
    setSettleOpen(false)
    notify('Settlement recorded.')
  }

  async function handleRemoveSettlement() {
    if (confirm?.kind !== 'settlement') return
    await removeSettlement({ id: confirm.id })
    reexecute({ requestPolicy: 'network-only' })
    setConfirm(null)
    notify('Settlement removed.')
  }

  async function handleExcludeSubscription() {
    if (confirm?.kind !== 'subscription') return
    await excludeSubSplit({ subscriptionId: confirm.subId, year: selectedMonth.year, month: selectedMonth.month })
    reexecute({ requestPolicy: 'network-only' })
    setConfirm(null)
    notify(`Removed from ${selectedMonth.label}.`)
  }

  async function handleRestoreSubscription(subId: string) {
    await restoreSubSplit({ subscriptionId: subId, year: selectedMonth.year, month: selectedMonth.month })
    reexecute({ requestPolicy: 'network-only' })
    notify('Subscription split restored.')
  }

  async function handleSetPartner(name: string) {
    await setSplitPartner({ name })
    reexecute({ requestPolicy: 'network-only' })
    setPartnerOpen(false)
    notify(`Split partner set to "${name}".`)
  }

  function handleGoPrev() {
    if (idx === -1 && months.length > 0) { setSelectedKey(months[0].key); return }
    if (canPrev) setSelectedKey(months[idx + 1].key)
  }
  function handleGoNext() {
    if (canNext) setSelectedKey(months[idx - 1].key)
  }

  if (fetching) {
    return (
      <Box sx={{ flex: 1, display: 'grid', placeItems: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ flex: 1, display: 'grid', placeItems: 'center', p: 3 }}>
        <Typography color="error">{error.message}</Typography>
      </Box>
    )
  }

  const isNewUser = !data?.splitPartner

  return (
    <Box sx={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      <Topbar
        title="Split"
        subtitle={`Shared expenses with ${partnerName} — who paid, and who owes whom.`}
        rightSlot={
          <Row gap={1.25} sx={{ flex: 'none' }}>
            <Row gap={0.75} sx={{ color: 'text.secondary', fontSize: 12.5, fontWeight: 500 }}>
              <PersonAvatar who="you" partnerName={partnerName} size={28} sx={{ boxShadow: '0 0 0 2px #fff' }} />
              <PersonAvatar who="them" partnerName={partnerName} size={28} sx={{ boxShadow: '0 0 0 2px #fff', ml: '-10px' }} />
              <Box sx={{ ml: '2px' }}>You &amp; {partnerName}</Box>
              <Box
                component="button"
                onClick={() => setPartnerOpen(true)}
                sx={{ display: 'inline-flex', alignItems: 'center', width: 26, height: 26, border: '1px solid', borderColor: 'divider', borderRadius: '7px', bgcolor: '#fff', cursor: 'pointer', placeItems: 'center', justifyContent: 'center', color: 'text.disabled', '&:hover': { bgcolor: brand.zinc[50], color: 'text.secondary' } }}
              >
                <EditIcon sx={{ fontSize: 14 }} />
              </Box>
            </Row>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setAddOpen(true)} sx={{ height: 38 }}>
              Add expense
            </Button>
          </Row>
        }
      />

      {isNewUser ? (
        <Box sx={{ flex: 1, display: 'grid', placeItems: 'center', p: '64px 24px' }}>
          <Box sx={{ maxWidth: 400, textAlign: 'center' }}>
            <Box sx={{ width: 60, height: 60, mx: 'auto', mb: '20px', borderRadius: '16px', bgcolor: brand.anchor[50], display: 'grid', placeItems: 'center' }}>
              <ScaleIcon sx={{ fontSize: 28, color: brand.anchor[700] }} />
            </Box>
            <Typography component="h2" sx={{ m: 0, fontSize: 22, fontWeight: 600, letterSpacing: '-0.015em' }}>
              Set up shared expenses
            </Typography>
            <Typography sx={{ m: '8px 0 22px', fontSize: 14, color: 'text.secondary', lineHeight: 1.5 }}>
              Track who paid and who owes whom with a partner. Start by telling us who you're splitting with.
            </Typography>
            <Button variant="contained" startIcon={<EditIcon />} onClick={() => setPartnerOpen(true)}>
              Set partner name
            </Button>
          </Box>
        </Box>
      ) : (
        <Box sx={{ px: '32px', pb: '56px', pt: '22px', minWidth: 960, maxWidth: 1080, mx: 'auto', width: '100%' }}>
          <Box sx={{ mb: '18px' }}>
            <Segmented
              value={view}
              onChange={(v) => setView(v as SplitView)}
              options={[
                { value: 'dashboard', label: 'Dashboard' },
                { value: 'history', label: 'History' },
              ]}
            />
          </Box>

          {view === 'dashboard' ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <SummaryStrip
                month={selectedMonthWithSubs}
                totals={totals}
                status={status}
                partnerName={partnerName}
                cents
                canPrev={canPrev}
                canNext={canNext}
                onPrev={handleGoPrev}
                onNext={handleGoNext}
                onSettle={() => setSettleOpen(true)}
              />
              <ExpenseLedger
                expenses={selectedMonthWithSubs.expenses}
                partnerName={partnerName}
                cents
                compact={false}
                onAdd={() => setAddOpen(true)}
                onSave={handleSaveExpense}
                onRemoveRequest={(e) => setConfirm({ kind: 'expense', id: e.id, label: e.desc })}
                onExcludeRequest={(e) => setConfirm({ kind: 'subscription', subId: e.subId!, label: e.desc })}
                hiddenSubs={hiddenSubs}
                onRestore={handleRestoreSubscription}
              />
              <SettlementHistory
                settlements={selectedMonth.settlements}
                partnerName={partnerName}
                cents
                onRemoveRequest={(s) => setConfirm({ kind: 'settlement', id: s.id })}
              />
            </Box>
          ) : (
            <MonthHistory
              months={monthsWithSubs}
              cents
              currentKey={currentMonthKey}
              onOpen={(key) => { setSelectedKey(key); setView('dashboard') }}
            />
          )}
        </Box>
      )}

      <AddExpenseDialog
        open={addOpen}
        monthLabel={selectedMonth.label}
        partnerName={partnerName}
        onClose={() => setAddOpen(false)}
        onAdd={handleAddExpense}
      />

      <SettleUpDialog
        open={settleOpen}
        monthLabel={selectedMonth.label}
        status={status}
        partnerName={partnerName}
        onClose={() => setSettleOpen(false)}
        onSettle={handleSettle}
      />

      <ConfirmRemoveDialog
        open={confirm !== null}
        title={
          confirm?.kind === 'expense'
            ? 'Remove expense?'
            : confirm?.kind === 'subscription'
            ? 'Remove from this month?'
            : 'Remove settlement?'
        }
        body={
          confirm?.kind === 'expense'
            ? <>"{confirm.label}" will be removed from {selectedMonth.label}. This can't be undone.</>
            : confirm?.kind === 'subscription'
            ? <>"{confirm.label}" won't be auto-split for {selectedMonth.label}. Other months and the subscription itself are unaffected — you can restore it below.</>
            : <>This settlement will be removed and the balance for {selectedMonth.label} will be recalculated.</>
        }
        onClose={() => setConfirm(null)}
        onConfirm={
          confirm?.kind === 'expense'
            ? handleRemoveExpense
            : confirm?.kind === 'subscription'
            ? handleExcludeSubscription
            : handleRemoveSettlement
        }
      />

      <SetPartnerDialog
        open={partnerOpen}
        currentName={data?.splitPartner?.name ?? ''}
        onClose={() => setPartnerOpen(false)}
        onSave={handleSetPartner}
      />
    </Box>
  )
}
