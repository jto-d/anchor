'use client'

import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import CloseIcon from '@mui/icons-material/Close'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import AddIcon from '@mui/icons-material/Add'
import LinkIcon from '@mui/icons-material/LinkOutlined'
import EditIcon from '@mui/icons-material/EditOutlined'
import SearchIcon from '@mui/icons-material/SearchOutlined'
import LockIcon from '@mui/icons-material/LockOutlined'
import ShieldIcon from '@mui/icons-material/ShieldOutlined'
import CheckIcon from '@mui/icons-material/Check'
import { CatGlyph } from '@/components/ui'
import { fmtMoney } from '@/data/accountData'
import {
  ACCOUNT_TYPES, CASH_TYPE_KEYS, INV_TYPE_KEYS, PLAID_INSTITUTIONS,
  type Account, type AccountType,
} from '@/data/accountData'
import { brand } from '@/lib/theme'

// ─── Modal shell ─────────────────────────────────────────────────────────────

function ModalHeader({
  title, sub, onClose, onBack,
}: { title: string; sub?: string; onClose: () => void; onBack?: () => void }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '12px', px: '22px', pt: '20px', pb: '16px', borderBottom: '1px solid', borderColor: 'divider' }}>
      {onBack && (
        <IconButton size="small" onClick={onBack} sx={{ mt: '1px', border: '1px solid', borderColor: 'divider', borderRadius: '8px', width: 30, height: 30 }}>
          <ChevronLeftIcon sx={{ fontSize: 16 }} />
        </IconButton>
      )}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.01em' }}>{title}</Typography>
        {sub && <Typography sx={{ fontSize: 13, color: 'text.secondary', mt: '3px' }}>{sub}</Typography>}
      </Box>
      <IconButton size="small" onClick={onClose} sx={{ borderRadius: '8px', width: 30, height: 30, color: 'text.secondary' }}>
        <CloseIcon sx={{ fontSize: 17 }} />
      </IconButton>
    </Box>
  )
}

// ─── Path picker ─────────────────────────────────────────────────────────────

function PathChoice({
  icon, title, sub, onClick, recommended,
}: { icon: string; title: string; sub: string; onClick: () => void; recommended?: boolean }) {
  const [hover, setHover] = useState(false)
  return (
    <Box
      component="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      sx={{
        display: 'flex', alignItems: 'center', gap: '14px', width: '100%', textAlign: 'left',
        p: '16px', borderRadius: '12px', cursor: 'pointer',
        border: `1px solid ${hover ? brand.zinc[300] : brand.zinc[200]}`,
        bgcolor: hover ? brand.zinc[50] : '#fff',
        fontFamily: 'inherit', transition: 'background 150ms ease, border-color 150ms ease',
      }}
    >
      <CatGlyph icon={icon} size={42} tone="accent" />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ fontSize: 14.5, fontWeight: 600 }}>{title}</Typography>
          {recommended && (
            <Box component="span" sx={{ fontSize: 11, fontWeight: 600, px: '8px', py: '2px', borderRadius: '999px', bgcolor: brand.accentSoft, color: brand.anchor[700] }}>
              Recommended
            </Box>
          )}
        </Box>
        <Typography sx={{ fontSize: 12.5, color: 'text.secondary', mt: '3px', lineHeight: 1.4 }}>{sub}</Typography>
      </Box>
      <ChevronRightIcon sx={{ fontSize: 18, color: 'text.disabled', flexShrink: 0 }} />
    </Box>
  )
}

// ─── Plaid flow ──────────────────────────────────────────────────────────────

interface PlaidFlowProps {
  onClose: () => void
  onBack: () => void
  onLink: (inst: { name: string }, accounts: { id: string; type: AccountType; nick: string; balance: number }[]) => void
}

function PlaidFlow({ onClose, onBack, onLink }: PlaidFlowProps) {
  const [stage, setStage] = useState<'search' | 'connecting' | 'select'>('search')
  const [inst, setInst] = useState<{ name: string; glyph: string; color: string } | null>(null)
  const [q, setQ] = useState('')
  const [picked, setPicked] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (stage === 'connecting') {
      const t = setTimeout(() => setStage('select'), 1500)
      return () => clearTimeout(t)
    }
  }, [stage])

  const discovered = inst
    ? [
        { id: 'd1', type: 'CHECKING' as AccountType, nick: `${inst.name} checking`, balance: 3120 },
        { id: 'd2', type: 'SAVINGS' as AccountType, nick: `${inst.name} savings`, balance: 12480 },
        { id: 'd3', type: 'BROKERAGE' as AccountType, nick: `${inst.name} brokerage`, balance: 28750 },
      ]
    : []

  if (stage === 'connecting') {
    return (
      <Box>
        <ModalHeader title="Connecting" sub={`Securely signing in to ${inst?.name}…`} onClose={onClose} />
        <Box sx={{ p: '48px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '18px' }}>
          <Box sx={{ width: 52, height: 52, borderRadius: '999px', border: `3px solid ${brand.zinc[100]}`, borderTopColor: 'primary.main', animation: 'spin 0.8s linear infinite', '@keyframes spin': { to: { transform: 'rotate(360deg)' } } }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: 12.5, color: 'text.secondary' }}>
            <LockIcon sx={{ fontSize: 14, color: brand.anchor[600] }} />
            Bank-grade encryption · read-only access
          </Box>
        </Box>
      </Box>
    )
  }

  if (stage === 'select') {
    const anyPicked = Object.values(picked).some(Boolean)
    const pickedCount = Object.values(picked).filter(Boolean).length
    return (
      <Box>
        <ModalHeader title={`${inst?.name} accounts`} sub="Choose which accounts to track in Anchor." onClose={onClose} onBack={() => setStage('search')} />
        <Box sx={{ p: '14px 22px' }}>
          {discovered.map((d) => {
            const on = !!picked[d.id]
            const meta = ACCOUNT_TYPES[d.type]
            return (
              <Box
                key={d.id}
                component="button"
                onClick={() => setPicked((p) => ({ ...p, [d.id]: !p[d.id] }))}
                sx={{
                  display: 'flex', alignItems: 'center', gap: '12px', width: '100%',
                  textAlign: 'left', p: '12px', mb: 1, borderRadius: '12px', cursor: 'pointer',
                  border: `1px solid ${on ? brand.anchor[700] : brand.zinc[200]}`,
                  bgcolor: on ? brand.accentSoft : '#fff',
                  fontFamily: 'inherit', transition: 'all 150ms ease',
                }}
              >
                <CatGlyph icon={meta.glyph} size={34} tone={on ? 'accent' : 'neutral'} />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontSize: 13.5, fontWeight: 600 }}>{d.nick}</Typography>
                  <Typography sx={{ fontSize: 11.5, color: 'text.disabled' }}>{meta.label}</Typography>
                </Box>
                <Typography sx={{ fontSize: 13.5, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{fmtMoney(d.balance)}</Typography>
                <Box sx={{ width: 20, height: 20, flexShrink: 0, borderRadius: '6px', display: 'grid', placeItems: 'center', bgcolor: on ? 'primary.main' : '#fff', border: `1px solid ${on ? brand.anchor[700] : brand.zinc[300]}`, color: '#fff' }}>
                  {on && <CheckIcon sx={{ fontSize: 13 }} />}
                </Box>
              </Box>
            )
          })}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', p: '14px 22px 20px', borderTop: '1px solid', borderColor: 'divider' }}>
          <Button variant="text" onClick={onClose}>Cancel</Button>
          <Button
            variant="contained"
            startIcon={<LinkIcon />}
            disabled={!anyPicked}
            onClick={() => inst && onLink(inst, discovered.filter((d) => picked[d.id]))}
          >
            Link {pickedCount || ''} account{pickedCount === 1 ? '' : 's'}
          </Button>
        </Box>
      </Box>
    )
  }

  // search stage
  const filtered = PLAID_INSTITUTIONS.filter((i) => i.name.toLowerCase().includes(q.toLowerCase()))
  return (
    <Box>
      <ModalHeader title="Link with Plaid" sub="Search for your bank or brokerage." onClose={onClose} onBack={onBack} />
      <Box sx={{ p: '16px 22px 20px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '9px', height: 40, px: '12px', borderRadius: '8px', border: '1px solid', borderColor: 'grey.300', mb: '14px' }}>
          <SearchIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
          <InputBase
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search institutions"
            sx={{ flex: 1, fontSize: 14 }}
          />
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {filtered.map((i) => (
            <Box
              key={i.name}
              component="button"
              onClick={() => { setInst(i); setStage('connecting') }}
              sx={{
                display: 'flex', alignItems: 'center', gap: '10px',
                p: '11px 12px', borderRadius: '12px', border: '1px solid', borderColor: 'divider',
                bgcolor: '#fff', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
                transition: 'background 120ms ease', '&:hover': { bgcolor: brand.zinc[50] },
              }}
            >
              <Box sx={{ width: 30, height: 30, flexShrink: 0, borderRadius: '8px', bgcolor: i.color, display: 'grid', placeItems: 'center' }}>
                <CatGlyph icon={i.glyph} size={30} sx={{ bgcolor: 'transparent', color: '#fff' }} />
              </Box>
              <Typography noWrap sx={{ fontSize: 13, fontWeight: 600 }}>{i.name}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}

// ─── Manual form ─────────────────────────────────────────────────────────────

interface ManualFormProps {
  onClose: () => void
  onBack: () => void
  onAdd: (payload: Partial<Account>) => void
}

function ManualForm({ onClose, onBack, onAdd }: ManualFormProps) {
  const [type, setType] = useState<AccountType>('CHECKING')
  const [nick, setNick] = useState('')
  const [inst, setInst] = useState('')
  const [balance, setBalance] = useState('')
  const [ef, setEf] = useState(false)
  const meta = ACCOUNT_TYPES[type]
  const isSavings = type === 'SAVINGS'
  const valid = nick.trim() && balance !== '' && !Number.isNaN(parseFloat(balance))

  const submit = () => {
    if (!valid) return
    onAdd({
      type,
      nick: nick.trim(),
      inst: inst.trim() || meta.label,
      balance: Math.max(0, Math.round(parseFloat(balance) * 100) / 100),
      isEmergencyFund: isSavings && ef,
    })
  }

  return (
    <Box>
      <ModalHeader title="Add manually" sub="Track an account Anchor can't link to." onClose={onClose} onBack={onBack} />
      <Box sx={{ p: '18px 22px' }}>
        {/* Account type */}
        <Box sx={{ mb: '14px' }}>
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: 'text.secondary', mb: '6px' }}>Account type</Typography>
          <FormControl fullWidth size="small">
            <Select value={type} onChange={(e) => setType(e.target.value as AccountType)} sx={{ borderRadius: '8px', fontSize: 14 }}>
              <MenuItem disabled sx={{ fontSize: 11, fontWeight: 700, opacity: 1, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Cash</MenuItem>
              {CASH_TYPE_KEYS.map((k) => <MenuItem key={k} value={k}>{ACCOUNT_TYPES[k].label}</MenuItem>)}
              <Divider />
              <MenuItem disabled sx={{ fontSize: 11, fontWeight: 700, opacity: 1, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Investments</MenuItem>
              {INV_TYPE_KEYS.map((k) => <MenuItem key={k} value={k}>{ACCOUNT_TYPES[k].label}</MenuItem>)}
            </Select>
          </FormControl>
        </Box>

        {/* Nickname */}
        <Box sx={{ mb: '14px' }}>
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: 'text.secondary', mb: '6px' }}>Nickname</Typography>
          <Box sx={{ height: 40, px: '12px', borderRadius: '8px', border: '1px solid', borderColor: 'grey.300', display: 'flex', alignItems: 'center' }}>
            <InputBase fullWidth value={nick} onChange={(e) => setNick(e.target.value)} placeholder="e.g. Everyday checking" sx={{ fontSize: 14 }} />
          </Box>
        </Box>

        {/* Institution */}
        <Box sx={{ mb: '14px' }}>
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: 'text.secondary', mb: '6px' }}>Institution <Box component="span" sx={{ fontWeight: 400, color: 'text.disabled' }}>— optional</Box></Typography>
          <Box sx={{ height: 40, px: '12px', borderRadius: '8px', border: '1px solid', borderColor: 'grey.300', display: 'flex', alignItems: 'center' }}>
            <InputBase fullWidth value={inst} onChange={(e) => setInst(e.target.value)} placeholder="e.g. Chase" sx={{ fontSize: 14 }} />
          </Box>
        </Box>

        {/* Balance */}
        <Box sx={{ mb: '14px' }}>
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: 'text.secondary', mb: '6px' }}>Current balance</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', height: 40, borderRadius: '8px', border: '1px solid', borderColor: 'grey.300', overflow: 'hidden' }}>
            <Typography sx={{ px: '12px', color: 'text.secondary', fontSize: 15 }}>$</Typography>
            <InputBase
              value={balance}
              onChange={(e) => setBalance(e.target.value.replace(/[^0-9.]/g, ''))}
              inputProps={{ inputMode: 'decimal' }}
              placeholder="0.00"
              sx={{ flex: 1, fontSize: 14, fontVariantNumeric: 'tabular-nums' }}
            />
          </Box>
        </Box>

        {/* Emergency fund toggle */}
        {isSavings && (
          <Box
            component="button"
            onClick={() => setEf((v) => !v)}
            sx={{
              display: 'flex', alignItems: 'center', gap: '11px', width: '100%', textAlign: 'left',
              p: '12px 14px', borderRadius: '12px', cursor: 'pointer', fontFamily: 'inherit',
              border: `1px solid ${ef ? brand.gold[500] : brand.zinc[200]}`,
              bgcolor: ef ? brand.gold[50] : '#fff', transition: 'all 150ms ease',
            }}
          >
            <CatGlyph icon="shield" size={32} tone="amber" />
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: 13, fontWeight: 600 }}>Emergency fund</Typography>
              <Typography sx={{ fontSize: 11.5, color: 'text.secondary' }}>Flag this savings account so it stands out.</Typography>
            </Box>
            <Switch checked={ef} size="small" color="warning" readOnly />
          </Box>
        )}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', p: '14px 22px 20px', borderTop: '1px solid', borderColor: 'divider' }}>
        <Button variant="text" onClick={onClose}>Cancel</Button>
        <Button variant="contained" startIcon={<AddIcon />} disabled={!valid} onClick={submit}>
          Add account
        </Button>
      </Box>
    </Box>
  )
}

// ─── AddAccountDialog ─────────────────────────────────────────────────────────

interface AddAccountDialogProps {
  open: boolean
  onClose: () => void
  onAddManual: (payload: Partial<Account>) => void
  onLinkPlaid: (inst: { name: string }, accounts: { id: string; type: AccountType; nick: string; balance: number }[]) => void
}

export function AddAccountDialog({ open, onClose, onAddManual, onLinkPlaid }: AddAccountDialogProps) {
  const [path, setPath] = useState<null | 'plaid' | 'manual'>(null)

  const handleClose = () => { setPath(null); onClose() }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: '18px', overflow: 'hidden' } } }}
    >
      <DialogContent sx={{ p: 0 }}>
        {path === 'plaid' ? (
          <PlaidFlow onClose={handleClose} onBack={() => setPath(null)} onLink={(inst, accs) => { onLinkPlaid(inst, accs); handleClose() }} />
        ) : path === 'manual' ? (
          <ManualForm onClose={handleClose} onBack={() => setPath(null)} onAdd={(payload) => { onAddManual(payload); handleClose() }} />
        ) : (
          <Box>
            <ModalHeader title="Add an account" sub="Link automatically, or enter the balance yourself." onClose={handleClose} />
            <Box sx={{ p: '18px 22px 22px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <PathChoice
                icon="link2"
                title="Link with Plaid"
                recommended
                sub="Connect a bank or brokerage. Balances and holdings sync on refresh."
                onClick={() => setPath('plaid')}
              />
              <PathChoice
                icon="pencil"
                title="Add manually"
                sub="Enter an account and its balance yourself. Update it anytime."
                onClick={() => setPath('manual')}
              />
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  )
}
