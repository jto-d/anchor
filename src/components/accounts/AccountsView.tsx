'use client'

import { useState, useMemo, useCallback, useRef } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import AddIcon from '@mui/icons-material/Add'
import VisibilityIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOffOutlined'
import LandmarkIcon from '@mui/icons-material/AccountBalanceOutlined'
import LinkIcon from '@mui/icons-material/LinkOutlined'
import EditIcon from '@mui/icons-material/EditOutlined'
import { useQuery, useMutation } from '@urql/next'
import { Topbar } from '@/components/layout/Topbar'
import { SurfaceCard, Toast, Row, Segmented } from '@/components/ui'
import { AreaChart } from './AccountPrimitives'
import { NetWorthSummary } from './NetWorthSummary'
import { AccountsPanel, type AccountGroup } from './AccountsList'
import { AddAccountDialog } from './AddAccountDialog'
import {
  ListAccountsDocument,
  RemoveAccountDocument,
} from './accounts.queries'
import {
  type Account, type Holding, type AccountType,
  ACCOUNT_TYPES, SEED_HOLDINGS,
  SERIES, MONTHS, TODAY, RANGE_COUNTS,
  makeSeries, netWorthSeries,
} from '@/data/accountData'
import { brand } from '@/lib/theme'

// Map server account shape → local Account interface
function toLocalAccount(a: {
  id: string; nick: string; inst: string; type: string; source: string
  balance: string; isEmergencyFund: boolean; balanceUpdatedAt: string; createdAt: string
}): Account {
  const balance = parseFloat(a.balance)
  if (!SERIES[a.id]) {
    const type = a.type as AccountType
    const isInv = ACCOUNT_TYPES[type]?.group === 'inv'
    SERIES[a.id] = makeSeries(a.id, balance, isInv ? 0.013 : 0.003, isInv ? 0.03 : 0.01)
  }
  return {
    id: a.id,
    nick: a.nick,
    inst: a.inst,
    type: a.type as AccountType,
    source: a.source as 'PLAID' | 'MANUAL',
    balance,
    isEmergencyFund: a.isEmergencyFund,
    refreshed: new Date(a.balanceUpdatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    drift: 0,
    vol: 0,
  }
}

function buildGroups(accounts: Account[]): AccountGroup[] {
  const cash = accounts.filter((a) => ACCOUNT_TYPES[a.type]?.group === 'cash')
  const inv = accounts.filter((a) => ACCOUNT_TYPES[a.type]?.group === 'inv')
  const sum = (arr: Account[]) => arr.reduce((s, a) => s + (a.balance ?? 0), 0)
  return [
    { key: 'cash', label: 'Cash', glyph: 'wallet', accounts: cash, total: sum(cash) },
    { key: 'inv', label: 'Investments', glyph: 'trendingUp', accounts: inv, total: sum(inv) },
  ]
}

export function AccountsView() {
  const [{ data, fetching, error }, reexecuteQuery] = useQuery({ query: ListAccountsDocument })
  const [, removeAccount] = useMutation(RemoveAccountDocument)

  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [range, setRange] = useState('1Y')
  const [privacy, setPrivacy] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [showSparklines] = useState(false)
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  const flash = useCallback((msg: string) => {
    setToast(msg)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 2600)
  }, [])

  const accounts: Account[] = useMemo(
    () => (data?.listAccounts ?? []).map(toLocalAccount),
    [data],
  )

  const holdings: Record<string, Holding[]> = SEED_HOLDINGS

  const model = useMemo(() => {
    const groups = buildGroups(accounts)
    const cashTotal = groups[0].total
    const invTotal = groups[1].total
    const netWorth = cashTotal + invTotal
    const series = netWorthSeries(accounts)
    const delta = series.length >= 2 ? series[series.length - 1] - series[series.length - 2] : 0
    return { groups, cashTotal, invTotal, netWorth, series, delta }
  }, [accounts])

  const onToggleGroup = useCallback((k: string) => setCollapsed((p) => ({ ...p, [k]: !p[k] })), [])
  const onToggleExpand = useCallback((id: string) => setExpanded((p) => ({ ...p, [id]: !p[id] })), [])

  const nudge = (a: Account): number => {
    const isInv = ACCOUNT_TYPES[a.type]?.group === 'inv'
    const pctMove = (Math.random() - 0.45) * (isInv ? 0.012 : 0.003)
    const nb = Math.max(0, Math.round(a.balance * (1 + pctMove)))
    if (SERIES[a.id]) SERIES[a.id] = [...(SERIES[a.id]?.slice(0, 11) ?? []), nb]
    return nb
  }

  // Refresh is still local (real Plaid balance refresh is a future feature)
  const [localBalances, setLocalBalances] = useState<Record<string, number>>({})

  const onRefresh = useCallback((id: string) => {
    const a = accounts.find((x) => x.id === id)
    if (!a || a.source !== 'PLAID') return
    setLocalBalances((prev) => ({ ...prev, [id]: nudge(a) }))
    flash(`${a.inst} refreshed.`)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accounts, flash])

  const onRefreshGroup = useCallback((key: string) => {
    const group = accounts.filter((a) => ACCOUNT_TYPES[a.type]?.group === key && a.source === 'PLAID')
    setLocalBalances((prev) => {
      const next = { ...prev }
      group.forEach((a) => { next[a.id] = nudge(a) })
      return next
    })
    flash(`${key === 'cash' ? 'Cash' : 'Investment'} accounts refreshed.`)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accounts, flash])

  const onManage = useCallback(async (id: string, action: string) => {
    if (action === 'unlink' || action === 'remove') {
      const a = accounts.find((x) => x.id === id)
      await removeAccount({ id })
      setExpanded((p) => { const n = { ...p }; delete n[id]; return n })
      reexecuteQuery({ requestPolicy: 'network-only' })
      flash(action === 'unlink' ? 'Account unlinked.' : 'Account removed.')
    } else {
      flash('Editing is coming soon.')
    }
  }, [accounts, removeAccount, reexecuteQuery, flash])

  // Merge local balance overrides (from nudge) onto server accounts
  const displayAccounts = useMemo(
    () => accounts.map((a) => localBalances[a.id] !== undefined ? { ...a, balance: localBalances[a.id] } : a),
    [accounts, localBalances],
  )

  const displayModel = useMemo(() => {
    const groups = buildGroups(displayAccounts)
    const cashTotal = groups[0].total
    const invTotal = groups[1].total
    const netWorth = cashTotal + invTotal
    const series = netWorthSeries(displayAccounts)
    const delta = series.length >= 2 ? series[series.length - 1] - series[series.length - 2] : 0
    return { groups, cashTotal, invTotal, netWorth, series, delta }
  }, [displayAccounts])

  const n = Math.min(displayModel.series.length, RANGE_COUNTS[range] ?? 12)
  const heroSeries = displayModel.series.slice(displayModel.series.length - n)

  const isEmpty = !fetching && accounts.length === 0

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

  if (isEmpty) {
    return (
      <Box sx={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
        <Topbar
          title="Accounts"
          subtitle="Every balance in one place — what you have, where it sits."
          rightSlot={
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setAddOpen(true)} sx={{ height: 38 }}>
              Add account
            </Button>
          }
        />
        <Box sx={{ flex: 1, display: 'grid', placeItems: 'center', p: '64px 24px' }}>
          <Box sx={{ maxWidth: 420, textAlign: 'center' }}>
            <Box sx={{ width: 60, height: 60, mx: 'auto', mb: '20px', borderRadius: '16px', bgcolor: brand.accentSoft, display: 'grid', placeItems: 'center' }}>
              <LandmarkIcon sx={{ fontSize: 28, color: brand.anchor[700] }} />
            </Box>
            <Box component="h2" sx={{ m: 0, fontSize: 22, fontWeight: 600, letterSpacing: '-0.015em' }}>Connect an account</Box>
            <Box component="p" sx={{ m: '8px 0 22px', fontSize: 14, color: 'text.secondary', lineHeight: 1.5 }}>
              See your full net worth in one place. Link a bank or brokerage with Plaid, or add a balance manually.
            </Box>
            <Row justify="center" gap={1.25}>
              <Button variant="contained" startIcon={<LinkIcon />} onClick={() => setAddOpen(true)}>Link with Plaid</Button>
              <Button variant="outlined" startIcon={<EditIcon />} onClick={() => setAddOpen(true)}>Add manually</Button>
            </Row>
          </Box>
        </Box>
        <AddAccountDialog
          open={addOpen}
          onClose={() => setAddOpen(false)}
          onSuccess={() => { reexecuteQuery({ requestPolicy: 'network-only' }); flash('Account added.') }}
        />
        <Toast message={toast} onClose={() => setToast(null)} />
      </Box>
    )
  }

  return (
    <Box sx={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      <Topbar
        title="Accounts"
        subtitle="Every balance in one place — what you have, where it sits."
        rightSlot={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <IconButton
              title={privacy ? 'Show balances' : 'Hide balances'}
              onClick={() => setPrivacy((v) => !v)}
              sx={{ border: 1, borderColor: 'grey.300', borderRadius: '8px', width: 38, height: 38, color: 'text.secondary' }}
            >
              {privacy ? <VisibilityOffIcon sx={{ fontSize: 18 }} /> : <VisibilityIcon sx={{ fontSize: 18 }} />}
            </IconButton>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setAddOpen(true)} sx={{ height: 38 }}>
              Add account
            </Button>
          </Box>
        }
      />

      <Box sx={{ px: '32px', pb: '48px', pt: '24px', display: 'flex', flexDirection: 'column', gap: '22px', minWidth: 980 }}>
        {/* Hero: net worth + trend chart side by side */}
        <SurfaceCard sx={{ display: 'grid', gridTemplateColumns: '380px minmax(0,1fr)', overflow: 'hidden' }}>
          <Box sx={{ p: '24px 26px', borderRight: '1px solid', borderColor: 'divider', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <NetWorthSummary
              netWorth={displayModel.netWorth}
              cashTotal={displayModel.cashTotal}
              invTotal={displayModel.invTotal}
              delta={displayModel.delta}
              count={displayAccounts.length}
              privacy={privacy}
            />
          </Box>

          <Box sx={{ p: '14px 18px 10px', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: '4px' }}>
              <Box sx={{ fontSize: 13, fontWeight: 600, color: 'text.secondary' }}>Trend</Box>
              <Segmented
                value={range}
                onChange={setRange}
                size="sm"
                options={Object.keys(RANGE_COUNTS).map((r) => ({ value: r, label: r }))}
              />
            </Box>
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'flex-end' }}>
              <Box sx={{ width: '100%' }}>
                <AreaChart data={heroSeries} width={740} height={150} id="hero" showGrid />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: '8px', px: '4px', fontSize: 10.5, color: 'text.disabled' }}>
                  <span>{MONTHS[(TODAY.m - n + 1 + 12) % 12]}</span>
                  <span>{MONTHS[TODAY.m]}</span>
                </Box>
              </Box>
            </Box>
          </Box>
        </SurfaceCard>

        {/* Accounts list */}
        <AccountsPanel
          groups={displayModel.groups}
          holdings={holdings}
          expanded={expanded}
          collapsed={collapsed}
          showSparklines={showSparklines}
          privacy={privacy}
          handlers={{ onToggleGroup, onToggleExpand, onRefresh, onRefreshGroup, onManage }}
          onAdd={() => setAddOpen(true)}
        />
      </Box>

      <AddAccountDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSuccess={() => { reexecuteQuery({ requestPolicy: 'network-only' }); flash('Account added.') }}
      />
      <Toast message={toast} onClose={() => setToast(null)} />
    </Box>
  )
}
