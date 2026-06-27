'use client'

import { useState, useMemo, useCallback, useRef } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import AddIcon from '@mui/icons-material/Add'
import VisibilityIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOffOutlined'
import LandmarkIcon from '@mui/icons-material/AccountBalanceOutlined'
import LinkIcon from '@mui/icons-material/LinkOutlined'
import EditIcon from '@mui/icons-material/EditOutlined'
import { Topbar } from '@/components/layout/Topbar'
import { SurfaceCard, Toast } from '@/components/ui'
import { AreaChart } from './AccountPrimitives'
import { NetWorthSummary } from './NetWorthSummary'
import { TrendChart } from './TrendChart'
import { AccountsPanel, type AccountGroup } from './AccountsList'
import { AddAccountDialog } from './AddAccountDialog'
import {
  type Account, type Holding, type AccountType,
  ACCOUNT_TYPES, SEED_ACCOUNTS, SEED_HOLDINGS,
  SERIES, MONTHS, TODAY, RANGE_COUNTS,
  makeSeries, netWorthSeries, fmtMoney,
} from '@/data/accountData'
import { brand } from '@/lib/theme'
import { Segmented } from '@/components/ui'

let _uid = 1
function uid(prefix: string) { return `${prefix}_${Date.now().toString(36)}${_uid++}` }

function buildGroups(accounts: Account[]): AccountGroup[] {
  const cash = accounts.filter((a) => ACCOUNT_TYPES[a.type].group === 'cash')
  const inv = accounts.filter((a) => ACCOUNT_TYPES[a.type].group === 'inv')
  const sum = (arr: Account[]) => arr.reduce((s, a) => s + (a.balance ?? 0), 0)
  return [
    { key: 'cash', label: 'Cash', glyph: 'wallet', accounts: cash, total: sum(cash) },
    { key: 'inv', label: 'Investments', glyph: 'trendingUp', accounts: inv, total: sum(inv) },
  ]
}

export function AccountsView() {
  const [accounts, setAccounts] = useState<Account[]>(() => SEED_ACCOUNTS.map((a) => ({ ...a })))
  const [holdings] = useState<Record<string, Holding[]>>(() => ({ ...SEED_HOLDINGS }))
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ a_brk: true })
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

  const model = useMemo(() => {
    const groups = buildGroups(accounts)
    const cashTotal = groups[0].total
    const invTotal = groups[1].total
    const netWorth = cashTotal + invTotal
    const series = netWorthSeries(accounts)
    const delta = series[series.length - 1] - series[series.length - 2]
    return { groups, cashTotal, invTotal, netWorth, series, delta }
  }, [accounts])

  const onToggleGroup = useCallback((k: string) => setCollapsed((p) => ({ ...p, [k]: !p[k] })), [])
  const onToggleExpand = useCallback((id: string) => setExpanded((p) => ({ ...p, [id]: !p[id] })), [])

  const nudge = (a: Account): number => {
    const isInv = ACCOUNT_TYPES[a.type].group === 'inv'
    const pctMove = (Math.random() - 0.45) * (isInv ? 0.012 : 0.003)
    const nb = Math.max(0, Math.round(a.balance * (1 + pctMove)))
    if (SERIES[a.id]) SERIES[a.id] = [...(SERIES[a.id]?.slice(0, 11) ?? []), nb]
    return nb
  }

  const onRefresh = useCallback((id: string) => {
    setAccounts((prev) => prev.map((a) => {
      if (a.id !== id || a.source !== 'PLAID') return a
      return { ...a, balance: nudge(a), refreshed: 'Just now' }
    }))
    const a = accounts.find((x) => x.id === id)
    flash(`${a?.inst ?? 'Account'} refreshed.`)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accounts, flash])

  const onRefreshGroup = useCallback((key: string) => {
    setAccounts((prev) => prev.map((a) => {
      if (ACCOUNT_TYPES[a.type].group !== key || a.source !== 'PLAID') return a
      return { ...a, balance: nudge(a), refreshed: 'Just now' }
    }))
    flash(`${key === 'cash' ? 'Cash' : 'Investment'} accounts refreshed.`)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flash])

  const onManage = useCallback((id: string, action: string) => {
    if (action === 'unlink' || action === 'remove') {
      setAccounts((prev) => prev.filter((a) => a.id !== id))
      setExpanded((p) => { const n = { ...p }; delete n[id]; return n })
      flash(action === 'unlink' ? 'Account unlinked.' : 'Account removed.')
    } else {
      flash('Editing is coming soon.')
    }
  }, [flash])

  const onAddManual = useCallback((payload: Partial<Account>) => {
    const id = uid('a')
    const acc: Account = {
      id,
      source: 'MANUAL',
      refreshed: 'Just now',
      drift: 0.004,
      vol: 0.01,
      type: 'CHECKING',
      inst: '',
      nick: '',
      balance: 0,
      ...payload,
    }
    SERIES[id] = makeSeries(id, acc.balance, acc.drift, acc.vol)
    setAccounts((prev) => [...prev, acc])
    flash(`${acc.nick} added.`)
  }, [flash])

  const onLinkPlaid = useCallback((
    inst: { name: string },
    picked: { id: string; type: AccountType; nick: string; balance: number }[],
  ) => {
    const added: Account[] = picked.map((d) => {
      const id = uid('a')
      const drift = ACCOUNT_TYPES[d.type].group === 'inv' ? 0.013 : 0.003
      const vol = ACCOUNT_TYPES[d.type].group === 'inv' ? 0.03 : 0.02
      SERIES[id] = makeSeries(id, d.balance, drift, vol)
      return { id, type: d.type, source: 'PLAID', inst: inst.name, nick: d.nick, balance: d.balance, refreshed: 'Just now', drift, vol }
    })
    setAccounts((prev) => [...prev, ...added])
    flash(`Linked ${added.length} account${added.length === 1 ? '' : 's'} from ${inst.name}.`)
  }, [flash])

  // range-sliced series for hero chart
  const n = Math.min(model.series.length, RANGE_COUNTS[range] ?? 12)
  const heroSeries = model.series.slice(model.series.length - n)

  const isEmpty = accounts.length === 0

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
            <Box sx={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <Button variant="contained" startIcon={<LinkIcon />} onClick={() => setAddOpen(true)}>Link with Plaid</Button>
              <Button variant="outlined" startIcon={<EditIcon />} onClick={() => setAddOpen(true)}>Add manually</Button>
            </Box>
          </Box>
        </Box>
        <AddAccountDialog open={addOpen} onClose={() => setAddOpen(false)} onAddManual={onAddManual} onLinkPlaid={onLinkPlaid} />
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
          {/* Net worth summary */}
          <Box sx={{ p: '24px 26px', borderRight: '1px solid', borderColor: 'divider', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <NetWorthSummary
              netWorth={model.netWorth}
              cashTotal={model.cashTotal}
              invTotal={model.invTotal}
              delta={model.delta}
              count={accounts.length}
              privacy={privacy}
            />
          </Box>

          {/* Trend chart panel */}
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
          groups={model.groups}
          holdings={holdings}
          expanded={expanded}
          collapsed={collapsed}
          showSparklines={showSparklines}
          privacy={privacy}
          handlers={{ onToggleGroup, onToggleExpand, onRefresh, onRefreshGroup, onManage }}
          onAdd={() => setAddOpen(true)}
        />
      </Box>

      <AddAccountDialog open={addOpen} onClose={() => setAddOpen(false)} onAddManual={onAddManual} onLinkPlaid={onLinkPlaid} />
      <Toast message={toast} onClose={() => setToast(null)} />
    </Box>
  )
}
