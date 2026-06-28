'use client'

import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close'
import SaveIcon from '@mui/icons-material/CheckOutlined'
import { useMutation } from '@urql/next'
import {
  ACCOUNT_TYPES, CASH_TYPE_KEYS, INV_TYPE_KEYS, CREDIT_TYPE_KEYS,
  type Account, type AccountType,
} from '@/data/accountData'
import { UpdateAccountDocument } from './accounts.queries'

// ─── Inner form (keyed by account.id so state resets per account) ────────────

function EditForm({ account, onClose, onSuccess }: { account: Account; onClose: () => void; onSuccess: () => void }) {
  const [nick, setNick] = useState(account.nick)
  const [type, setType] = useState<AccountType>(account.type)
  const [saving, setSaving] = useState(false)
  const [, updateAccount] = useMutation(UpdateAccountDocument)

  const valid = nick.trim().length > 0
  const changed = nick.trim() !== account.nick || type !== account.type

  const submit = async () => {
    if (!valid || saving) return
    setSaving(true)
    await updateAccount({ id: account.id, nick: nick.trim(), type })
    setSaving(false)
    onSuccess()
    onClose()
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '12px', px: '22px', pt: '20px', pb: '16px', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.01em' }}>Edit account</Typography>
          <Typography sx={{ fontSize: 13, color: 'text.secondary', mt: '3px' }}>{account.inst}</Typography>
        </Box>
        <IconButton size="small" onClick={onClose} sx={{ borderRadius: '8px', width: 30, height: 30, color: 'text.secondary' }}>
          <CloseIcon sx={{ fontSize: 17 }} />
        </IconButton>
      </Box>

      {/* Fields */}
      <Box sx={{ p: '18px 22px' }}>
        {/* Nickname */}
        <Box sx={{ mb: '14px' }}>
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: 'text.secondary', mb: '6px' }}>Nickname</Typography>
          <Box sx={{ height: 40, px: '12px', borderRadius: '8px', border: '1px solid', borderColor: 'grey.300', display: 'flex', alignItems: 'center' }}>
            <InputBase
              fullWidth
              value={nick}
              onChange={(e) => setNick(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') submit() }}
              sx={{ fontSize: 14 }}
              autoFocus
            />
          </Box>
        </Box>

        {/* Account type */}
        <Box>
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: 'text.secondary', mb: '6px' }}>Account type</Typography>
          <FormControl fullWidth size="small">
            <Select value={type} onChange={(e) => setType(e.target.value as AccountType)} sx={{ borderRadius: '8px', fontSize: 14 }}>
              <MenuItem disabled sx={{ fontSize: 11, fontWeight: 700, opacity: 1, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Cash</MenuItem>
              {CASH_TYPE_KEYS.map((k) => <MenuItem key={k} value={k}>{ACCOUNT_TYPES[k].label}</MenuItem>)}
              <Divider />
              <MenuItem disabled sx={{ fontSize: 11, fontWeight: 700, opacity: 1, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Investments</MenuItem>
              {INV_TYPE_KEYS.map((k) => <MenuItem key={k} value={k}>{ACCOUNT_TYPES[k].label}</MenuItem>)}
              <Divider />
              <MenuItem disabled sx={{ fontSize: 11, fontWeight: 700, opacity: 1, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Credit Cards</MenuItem>
              {CREDIT_TYPE_KEYS.map((k) => <MenuItem key={k} value={k}>{ACCOUNT_TYPES[k].label}</MenuItem>)}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Footer */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', p: '14px 22px 20px', borderTop: '1px solid', borderColor: 'divider' }}>
        <Button variant="text" onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          disabled={!valid || !changed || saving}
          onClick={submit}
        >
          {saving ? 'Saving…' : 'Save'}
        </Button>
      </Box>
    </Box>
  )
}

// ─── Dialog shell ─────────────────────────────────────────────────────────────

interface EditAccountDialogProps {
  open: boolean
  account: Account | null
  onClose: () => void
  onSuccess: () => void
}

export function EditAccountDialog({ open, account, onClose, onSuccess }: EditAccountDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{ paper: { sx: { width: 400, maxWidth: 'calc(100vw - 48px)', borderRadius: '18px', overflow: 'hidden' } } }}
    >
      <DialogContent sx={{ p: 0 }}>
        {account && <EditForm key={account.id} account={account} onClose={onClose} onSuccess={onSuccess} />}
      </DialogContent>
    </Dialog>
  )
}
