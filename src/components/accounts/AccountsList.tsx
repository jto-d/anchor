'use client'

import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import AddIcon from '@mui/icons-material/Add'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ChevronDownIcon from '@mui/icons-material/ExpandMore'
import RefreshIcon from '@mui/icons-material/RefreshOutlined'
import ShieldIcon from '@mui/icons-material/ShieldOutlined'
import WalletIcon from '@mui/icons-material/AccountBalanceWalletOutlined'
import TrendingUpIcon from '@mui/icons-material/TrendingUpOutlined'
import EditIcon from '@mui/icons-material/EditOutlined'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import LinkOffIcon from '@mui/icons-material/LinkOffOutlined'
import ShieldAddIcon from '@mui/icons-material/AddModeratorOutlined'
import ShieldRemoveIcon from '@mui/icons-material/GppBadOutlined'
import { SurfaceCard, CatGlyph } from '@/components/ui'
import { Money, SourceBadge, Sparkline, HoldingsDetail, OverflowMenu } from './AccountPrimitives'
import {
  type Account, type Holding, ACCOUNT_TYPES, SERIES,
} from '@/data/accountData'
import { brand } from '@/lib/theme'

interface AccountRowProps {
  account: Account
  holdings?: Holding[]
  expanded: boolean
  onToggleExpand: () => void
  onRefresh: (id: string) => void
  onManage: (id: string, action: string) => void
  showSparklines: boolean
  privacy: boolean
  last: boolean
}

export function AccountRow({
  account, holdings, expanded, onToggleExpand, onRefresh, onManage,
  showSparklines, privacy, last,
}: AccountRowProps) {
  const [hover, setHover] = useState(false)
  const typeMeta = ACCOUNT_TYPES[account.type]
  const isInv = typeMeta.group === 'inv'
  const canDrill = isInv && account.source === 'PLAID'
  const series = SERIES[account.id]
  const refreshable = account.source === 'PLAID'

  const menuItems = [
    { key: 'edit', label: 'Edit account', icon: EditIcon },
    account.isEmergencyFund
      ? { key: 'emergency', label: 'Remove emergency fund', icon: ShieldRemoveIcon }
      : { key: 'emergency', label: 'Set as emergency fund', icon: ShieldAddIcon },
    account.source === 'PLAID'
      ? { key: 'unlink', label: 'Unlink account', icon: LinkOffIcon, danger: true }
      : { key: 'remove', label: 'Remove account', icon: DeleteIcon, danger: true },
  ]

  return (
    <Box sx={{ borderBottom: last && !expanded ? 'none' : '1px solid', borderColor: 'divider' }}>
      <Box
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={canDrill ? onToggleExpand : undefined}
        sx={{
          display: 'flex', alignItems: 'center', gap: '13px', px: '20px', py: '13px',
          cursor: canDrill ? 'pointer' : 'default',
          bgcolor: hover && canDrill ? brand.zinc[50] : 'transparent',
          transition: 'background 120ms ease',
        }}
      >
        {/* disclosure chevron */}
        {canDrill ? (
          <ChevronRightIcon
            sx={{
              fontSize: 16,
              color: 'text.disabled',
              flexShrink: 0,
              transform: expanded ? 'rotate(90deg)' : 'none',
              transition: 'transform 180ms ease',
            }}
          />
        ) : (
          <Box sx={{ width: 16, flexShrink: 0 }} />
        )}

        <CatGlyph
          icon={typeMeta.glyph}
          size={38}
          tone={account.isEmergencyFund ? 'amber' : isInv ? 'accent' : 'neutral'}
        />

        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography noWrap sx={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.005em' }}>
              {account.nick}
            </Typography>
            {account.isEmergencyFund && (
              <Box
                component="span"
                sx={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px', flexShrink: 0,
                  fontSize: 10.5, fontWeight: 700, letterSpacing: '0.03em', textTransform: 'uppercase',
                  color: brand.amber[700], bgcolor: brand.amber[50], px: '7px', py: '2px', borderRadius: '999px',
                }}
              >
                <ShieldIcon sx={{ fontSize: 11 }} />Emergency
              </Box>
            )}
          </Box>
          <Typography noWrap sx={{ fontSize: 11.5, color: 'text.disabled', mt: '2px' }}>
            {account.inst} · {typeMeta.label}
          </Typography>
        </Box>

        {showSparklines && series && (
          <Box sx={{ flexShrink: 0, opacity: 0.9 }}>
            <Sparkline data={series} width={74} height={22} color={isInv ? brand.anchor[700] : brand.anchor[300]} />
          </Box>
        )}

        <SourceBadge source={account.source} />

        <Box sx={{ textAlign: 'right', minWidth: 104, flexShrink: 0 }}>
          <Money value={account.balance} size={15} weight={600} privacy={privacy} />
          <Typography sx={{ fontSize: 10.5, color: 'text.disabled', mt: '2px', whiteSpace: 'nowrap' }}>
            {account.refreshed}
          </Typography>
        </Box>

        {/* row actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
          {refreshable && (
            <IconButton
              size="small"
              title="Refresh balance"
              onClick={() => onRefresh(account.id)}
              sx={{
                width: 30, height: 30, borderRadius: '8px', color: 'text.disabled',
                '&:hover': { bgcolor: brand.zinc[100], color: brand.anchor[700] },
              }}
            >
              <RefreshIcon sx={{ fontSize: 15 }} />
            </IconButton>
          )}
          <OverflowMenu items={menuItems} onAction={(k) => onManage(account.id, k)} />
        </Box>
      </Box>

      {expanded && canDrill && (
        <HoldingsDetail account={account} holdings={holdings} privacy={privacy} />
      )}
    </Box>
  )
}

// ─── GroupHeader ─────────────────────────────────────────────────────────────

function GroupHeader({
  label, glyph, count, total, collapsed, onToggle, onRefreshGroup, plaidCount, privacy,
}: {
  label: string; glyph: string; count: number; total: number; collapsed: boolean
  onToggle: () => void; onRefreshGroup: () => void; plaidCount: number; privacy: boolean
}) {
  const [hover, setHover] = useState(false)
  return (
    <Box
      onClick={onToggle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      sx={{
        display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer',
        px: '20px', py: '12px',
        bgcolor: hover ? brand.zinc[50] : 'background.default',
        borderBottom: '1px solid', borderTop: '1px solid', borderColor: 'divider',
        transition: 'background 120ms ease',
      }}
    >
      <ChevronDownIcon
        sx={{
          fontSize: 16, color: 'text.disabled', flexShrink: 0,
          transform: collapsed ? 'rotate(-90deg)' : 'none',
          transition: 'transform 180ms ease',
        }}
      />
      <CatGlyph icon={glyph} size={26} tone="accent" />
      <Box sx={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', flex: 1 }}>
        {label}
        <Box component="span" sx={{ ml: '9px', fontSize: 11, fontWeight: 600, color: 'text.disabled' }}>{count}</Box>
      </Box>
      <Money value={total} size={14} weight={600} color={brand.zinc[600]} privacy={privacy} />
      {plaidCount > 0 && (
        <IconButton
          size="small"
          title={`Refresh all ${label.toLowerCase()}`}
          onClick={(e) => { e.stopPropagation(); onRefreshGroup() }}
          sx={{
            width: 30, height: 30, borderRadius: '8px', color: 'text.disabled',
            '&:hover': { bgcolor: '#fff', color: brand.anchor[700], boxShadow: brand.shadow.sm },
          }}
        >
          <RefreshIcon sx={{ fontSize: 15 }} />
        </IconButton>
      )}
    </Box>
  )
}

// ─── AccountsPanel ───────────────────────────────────────────────────────────

export interface AccountGroup {
  key: string
  label: string
  glyph: string
  accounts: Account[]
  total: number
}

interface AccountsPanelProps {
  groups: AccountGroup[]
  holdings: Record<string, Holding[]>
  expanded: Record<string, boolean>
  collapsed: Record<string, boolean>
  showSparklines: boolean
  privacy: boolean
  handlers: {
    onToggleGroup: (k: string) => void
    onToggleExpand: (id: string) => void
    onRefresh: (id: string) => void
    onRefreshGroup: (key: string) => void
    onManage: (id: string, action: string) => void
  }
  onAdd: () => void
}

export function AccountsPanel({
  groups, holdings, expanded, collapsed, showSparklines, privacy, handlers, onAdd,
}: AccountsPanelProps) {
  return (
    <SurfaceCard>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: '20px', py: '15px', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box>
          <Typography sx={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em' }}>Accounts</Typography>
          <Typography sx={{ fontSize: 12, color: 'text.secondary', mt: '2px' }}>Grouped by type · linked + manual</Typography>
        </Box>
        <Button variant="outlined" size="small" startIcon={<AddIcon />} onClick={onAdd} sx={{ height: 34 }}>
          Add account
        </Button>
      </Box>

      {groups.map((g) => {
        const isCollapsed = !!collapsed[g.key]
        const plaidCount = g.accounts.filter((a) => a.source === 'PLAID').length
        return (
          <Box key={g.key}>
            <GroupHeader
              label={g.label} glyph={g.glyph} count={g.accounts.length} total={g.total}
              collapsed={isCollapsed} onToggle={() => handlers.onToggleGroup(g.key)}
              onRefreshGroup={() => handlers.onRefreshGroup(g.key)}
              plaidCount={plaidCount} privacy={privacy}
            />
            {!isCollapsed && g.accounts.map((a, i) => (
              <AccountRow
                key={a.id} account={a} holdings={holdings[a.id]}
                expanded={!!expanded[a.id]} onToggleExpand={() => handlers.onToggleExpand(a.id)}
                onRefresh={handlers.onRefresh} onManage={handlers.onManage}
                showSparklines={showSparklines} privacy={privacy}
                last={i === g.accounts.length - 1}
              />
            ))}
            {!isCollapsed && g.accounts.length === 0 && (
              <Box sx={{ p: '20px', textAlign: 'center', fontSize: 13, color: 'text.disabled' }}>
                No {g.label.toLowerCase()} accounts yet.
              </Box>
            )}
          </Box>
        )
      })}
    </SurfaceCard>
  )
}
