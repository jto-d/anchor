'use client'

import { useState, useEffect, useCallback } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
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
import { usePlaidLink } from 'react-plaid-link'
import { useMutation } from '@urql/next'
import { CatGlyph } from '@/components/ui'
import {
  ACCOUNT_TYPES, CASH_TYPE_KEYS, INV_TYPE_KEYS,
  type AccountType,
} from '@/data/accountData'
import {
  CreatePlaidLinkTokenDocument,
  ExchangePlaidTokenDocument,
  AddManualAccountDocument,
} from './accounts.queries'
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
  onSuccess: () => void
}

function PlaidFlow({ onClose, onBack, onSuccess }: PlaidFlowProps) {
  const [linkToken, setLinkToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [, createLinkToken] = useMutation(CreatePlaidLinkTokenDocument)
  const [, exchangeToken] = useMutation(ExchangePlaidTokenDocument)

  useEffect(() => {
    createLinkToken({}).then((res) => {
      if (res.error) {
        setError(res.error.message.replace(/^\[.*?\]\s*/, '') || 'Failed to initialize Plaid.')
      } else {
        setLinkToken(res.data?.createPlaidLinkToken ?? null)
      }
    })
  // only run once on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSuccess = useCallback(async (publicToken: string, metadata: { institution: { institution_id: string; name: string } | null }) => {
    const inst = metadata.institution
    if (!inst) return
    await exchangeToken({
      publicToken,
      institutionId: inst.institution_id,
      institutionName: inst.name,
    })
    onSuccess()
  }, [exchangeToken, onSuccess])

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: handleSuccess,
    onExit: () => onBack(),
  })

  if (error) {
    return (
      <Box>
        <ModalHeader title="Link with Plaid" onClose={onClose} onBack={onBack} />
        <Box sx={{ p: '40px 24px', textAlign: 'center', color: 'error.main', fontSize: 13 }}>{error}</Box>
      </Box>
    )
  }

  return (
    <Box>
      <ModalHeader title="Link with Plaid" sub="Connect a bank or brokerage securely." onClose={onClose} onBack={onBack} />
      <Box sx={{ p: '48px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
        {!ready || !linkToken ? (
          <>
            <CircularProgress size={36} />
            <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>Initializing secure connection…</Typography>
          </>
        ) : (
          <>
            <CatGlyph icon="building" size={52} tone="accent" />
            <Box sx={{ textAlign: 'center' }}>
              <Typography sx={{ fontSize: 15, fontWeight: 600, mb: '6px' }}>Ready to connect</Typography>
              <Typography sx={{ fontSize: 13, color: 'text.secondary', lineHeight: 1.5 }}>
                Plaid will open a secure window to link your account. Your credentials are never stored.
              </Typography>
            </Box>
            <Button variant="contained" startIcon={<LinkIcon />} onClick={() => open()} sx={{ height: 40, px: '24px' }}>
              Open Plaid Link
            </Button>
          </>
        )}
      </Box>
    </Box>
  )
}

// ─── Manual form ─────────────────────────────────────────────────────────────

interface ManualFormProps {
  onClose: () => void
  onBack: () => void
  onSuccess: () => void
}

function ManualForm({ onClose, onBack, onSuccess }: ManualFormProps) {
  const [type, setType] = useState<AccountType>('CHECKING')
  const [nick, setNick] = useState('')
  const [inst, setInst] = useState('')
  const [balance, setBalance] = useState('')
  const [ef, setEf] = useState(false)
  const [saving, setSaving] = useState(false)
  const [, addManualAccount] = useMutation(AddManualAccountDocument)

  const meta = ACCOUNT_TYPES[type]
  const isSavings = type === 'SAVINGS'
  const valid = nick.trim() && balance !== '' && !Number.isNaN(parseFloat(balance))

  const submit = async () => {
    if (!valid || saving) return
    setSaving(true)
    await addManualAccount({
      type,
      nick: nick.trim(),
      inst: inst.trim() || meta.label,
      balance: String(Math.max(0, Math.round(parseFloat(balance) * 100) / 100)),
      isEmergencyFund: isSavings && ef,
    })
    setSaving(false)
    onSuccess()
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
        <Button variant="contained" startIcon={<AddIcon />} disabled={!valid || saving} onClick={submit}>
          {saving ? 'Adding…' : 'Add account'}
        </Button>
      </Box>
    </Box>
  )
}

// ─── AddAccountDialog ─────────────────────────────────────────────────────────

interface AddAccountDialogProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export function AddAccountDialog({ open, onClose, onSuccess }: AddAccountDialogProps) {
  const [path, setPath] = useState<null | 'plaid' | 'manual'>(null)

  const handleClose = () => { setPath(null); onClose() }
  const handleSuccess = () => { setPath(null); onSuccess(); onClose() }

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
          <PlaidFlow onClose={handleClose} onBack={() => setPath(null)} onSuccess={handleSuccess} />
        ) : path === 'manual' ? (
          <ManualForm onClose={handleClose} onBack={() => setPath(null)} onSuccess={handleSuccess} />
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
