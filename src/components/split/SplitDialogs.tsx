'use client'

import { useState } from 'react'
import { roundCents } from '@/utils/money'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import AddIcon from '@mui/icons-material/Add'
import CheckIcon from '@mui/icons-material/Check'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import { AppDialog } from '@/components/ui'
import { brand } from '@/lib/theme'
import { SPLIT_CATS, splitMoney, todayISO, guessCat, type BalanceStatus } from '@/data/splitData'
import { SplitStatusChip, SplitBar, PersonAvatar } from './SplitPrimitives'

export interface ExpenseDraft {
  desc: string
  amount: number | string
  date: string | null
  payer: string
  cat: string
  splitYou: number
  splitThem: number
}

const emptyDraft = (): ExpenseDraft => ({
  desc: '',
  amount: '',
  date: todayISO(),
  payer: 'you',
  cat: 'other',
  splitYou: 50,
  splitThem: 50,
})

function ExpenseForm({
  draft,
  partnerName,
  onChange,
}: {
  draft: ExpenseDraft
  partnerName: string
  onChange: (patch: Partial<ExpenseDraft>) => void
}) {
  const upd = (patch: Partial<ExpenseDraft>) => onChange(patch)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <Box>
        <Typography component="label" sx={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'text.secondary', mb: '6px' }}>Description</Typography>
        <TextField
          value={draft.desc}
          onChange={(e) => upd({ desc: e.target.value, cat: guessCat(e.target.value) })}
          placeholder="e.g. Groceries, dinner, utilities"
          size="small"
          fullWidth
          autoFocus
        />
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <Box>
          <Typography component="label" sx={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'text.secondary', mb: '6px' }}>Amount</Typography>
          <TextField
            value={draft.amount}
            onChange={(e) => upd({ amount: e.target.value.replace(/[^0-9.]/g, '') })}
            placeholder="0.00"
            size="small"
            fullWidth
            slotProps={{ input: { startAdornment: <Typography sx={{ mr: 0.5, color: 'text.disabled' }}>$</Typography> }, htmlInput: { inputMode: 'decimal' } }}
          />
        </Box>
        <Box>
          <Typography component="label" sx={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'text.secondary', mb: '6px' }}>Date</Typography>
          <TextField
            type="date"
            value={draft.date ?? ''}
            onChange={(e) => upd({ date: e.target.value || null })}
            size="small"
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Box>
      </Box>
      <Box>
        <Typography component="label" sx={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'text.secondary', mb: '6px' }}>Category</Typography>
        <Select size="small" value={draft.cat} onChange={(e) => upd({ cat: e.target.value })} fullWidth>
          {Object.entries(SPLIT_CATS).map(([k, v]) => (
            <MenuItem key={k} value={k}>{v.label}</MenuItem>
          ))}
        </Select>
      </Box>
      <Box>
        <Typography component="label" sx={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'text.secondary', mb: '8px' }}>Paid by</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {(['you', 'them'] as const).map((who) => {
            const on = draft.payer === who
            const isYou = who === 'you'
            return (
              <Box
                key={who}
                component="button"
                type="button"
                onClick={() => upd({ payer: who })}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '9px',
                  p: '0 12px',
                  height: '42px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  border: '1px solid',
                  borderColor: on ? (isYou ? 'primary.main' : 'text.primary') : 'divider',
                  bgcolor: on ? (isYou ? brand.anchor[50] : brand.zinc[100]) : '#fff',
                  transition: 'all 0.15s',
                }}
              >
                <PersonAvatar who={who} partnerName={partnerName} size={24} />
                <Typography sx={{ fontSize: 13.5, fontWeight: 600, flex: 1, textAlign: 'left' }}>
                  {who === 'you' ? 'You' : partnerName}
                </Typography>
                {on && <CheckIcon sx={{ fontSize: 15, color: isYou ? brand.anchor[700] : 'text.secondary' }} />}
              </Box>
            )
          })}
        </Box>
      </Box>
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: '8px' }}>
          <Typography component="label" sx={{ fontSize: 12, fontWeight: 600, color: 'text.secondary' }}>Split</Typography>
          {draft.splitYou !== 50 && (
            <Button size="small" variant="text" onClick={() => upd({ splitYou: 50, splitThem: 50 })} sx={{ fontSize: 11.5, p: '2px 6px', minWidth: 0, color: brand.anchor[700] }}>
              Reset 50/50
            </Button>
          )}
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', mb: '10px' }}>
          {(['you', 'them'] as const).map((who) => {
            const val = who === 'you' ? draft.splitYou : 100 - draft.splitYou
            return (
              <Box key={who} sx={{ display: 'flex', alignItems: 'center', gap: '8px', height: 40, px: '10px', border: '1px solid', borderColor: 'divider', borderRadius: '8px' }}>
                <PersonAvatar who={who} partnerName={partnerName} size={20} />
                <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: 'text.secondary', flex: 1 }}>{who === 'you' ? 'You' : partnerName}</Typography>
                <input
                  type="number"
                  value={val}
                  min={0}
                  max={100}
                  onChange={(e) => {
                    const n = Math.max(0, Math.min(100, parseInt(e.target.value) || 0))
                    upd({ splitYou: who === 'you' ? n : 100 - n, splitThem: who === 'you' ? 100 - n : n })
                  }}
                  style={{ width: 36, textAlign: 'right', border: 'none', background: 'transparent', fontFamily: 'inherit', fontSize: 14, fontWeight: 600 }}
                />
                <Typography sx={{ fontSize: 13, color: 'text.disabled', fontWeight: 600 }}>%</Typography>
              </Box>
            )
          })}
        </Box>
        <SplitBar splitYou={draft.splitYou} height={7} />
        <Typography sx={{ fontSize: 11.5, color: 'text.disabled', mt: '8px' }}>
          {draft.splitYou === 50 ? 'Split evenly' : `You ${draft.splitYou}% · ${partnerName} ${100 - draft.splitYou}%`}
        </Typography>
      </Box>
    </Box>
  )
}

function draftValid(draft: ExpenseDraft): boolean {
  const amt = parseFloat(String(draft.amount))
  return draft.desc.trim() !== '' && !isNaN(amt) && amt > 0
}

function normalizeDraft(draft: ExpenseDraft) {
  const splitYou = Math.max(0, Math.min(100, Math.round(draft.splitYou)))
  return {
    desc: draft.desc.trim(),
    amount: roundCents(parseFloat(String(draft.amount))),
    date: draft.date || null,
    payer: draft.payer,
    cat: draft.cat,
    splitYou,
    splitThem: 100 - splitYou,
  }
}

export function AddExpenseDialog({
  monthLabel,
  partnerName,
  open,
  onClose,
  onAdd,
}: {
  monthLabel: string
  partnerName: string
  open: boolean
  onClose: () => void
  onAdd: (payload: ReturnType<typeof normalizeDraft>) => void
}) {
  const [draft, setDraft] = useState<ExpenseDraft>(emptyDraft)

  function handleClose() {
    setDraft(emptyDraft())
    onClose()
  }

  function handleAdd() {
    if (!draftValid(draft)) return
    onAdd(normalizeDraft(draft))
    setDraft(emptyDraft())
  }

  return (
    <AppDialog open={open} onClose={handleClose} title="Add expense" subtitle={`Shared expense for ${monthLabel}.`} width={480}>
      <Box sx={{ px: '22px', pb: '4px', overflow: 'auto', flex: 1 }}>
        <ExpenseForm draft={draft} partnerName={partnerName} onChange={(patch) => setDraft((d) => ({ ...d, ...patch }))} />
      </Box>
      <Divider />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', p: '16px 22px' }}>
        <Button variant="text" onClick={handleClose} sx={{ color: 'text.secondary' }}>Cancel</Button>
        <Button variant="contained" startIcon={<AddIcon />} disabled={!draftValid(draft)} onClick={handleAdd}>
          Add expense
        </Button>
      </Box>
    </AppDialog>
  )
}

export function SettleUpDialog({
  monthLabel,
  status,
  partnerName,
  open,
  onClose,
  onSettle,
}: {
  monthLabel: string
  status: BalanceStatus
  partnerName: string
  open: boolean
  onClose: () => void
  onSettle: (payload: { amount: number; date: string | null; fromPayer: string }) => void
}) {
  const defaultFrom = status.state === 'owed' ? 'them' : 'you'
  const [amount, setAmount] = useState(status.amount > 0 ? status.amount.toFixed(2) : '')
  const [date, setDate] = useState(todayISO())
  const settled = status.state === 'settled'
  const amt = parseFloat(amount)
  const valid = !isNaN(amt) && amt > 0
  const dirText = defaultFrom === 'you' ? `You pay ${partnerName}` : `${partnerName} pays you`

  return (
    <AppDialog open={open} onClose={onClose} title="Settle up" subtitle={`Record a payment for ${monthLabel}.`} width={440}>
      <Box sx={{ px: '22px', pb: '4px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: '13px 15px', mb: '16px', borderRadius: '10px', bgcolor: 'background.default', border: '1px solid', borderColor: 'divider' }}>
          <Typography sx={{ fontSize: 12.5, color: 'text.secondary', fontWeight: 500 }}>Current balance</Typography>
          <SplitStatusChip status={status} cents />
        </Box>

        {settled ? (
          <Box sx={{ display: 'flex', gap: '10px', alignItems: 'flex-start', pb: '14px', fontSize: 13, color: 'text.secondary', lineHeight: 1.5 }}>
            <CheckCircleOutlineIcon sx={{ fontSize: 16, color: 'primary.main', flex: 'none', mt: '1px' }} />
            <span>You and {partnerName} are already square for {monthLabel}. You can still record a payment below if you need to.</span>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '9px', p: '11px 14px', mb: '16px', borderRadius: '8px', bgcolor: brand.anchor[50] }}>
            <SwapHorizIcon sx={{ fontSize: 15, color: brand.anchor[700] }} />
            <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: brand.anchor[700] }}>{dirText}</Typography>
          </Box>
        )}

        <Box sx={{ mb: '14px' }}>
          <Typography component="label" sx={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'text.secondary', mb: '6px' }}>Amount</Typography>
          <TextField
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
            placeholder="0.00"
            size="small"
            fullWidth
            autoFocus
            slotProps={{ input: { startAdornment: <Typography sx={{ mr: 0.5, color: 'text.disabled' }}>$</Typography> }, htmlInput: { inputMode: 'decimal' } }}
          />
        </Box>
        <Box sx={{ mb: '4px' }}>
          <Typography component="label" sx={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'text.secondary', mb: '6px' }}>Date</Typography>
          <TextField
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            size="small"
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Box>
      </Box>
      <Divider sx={{ mt: '12px' }} />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', p: '16px 22px' }}>
        <Button variant="text" onClick={onClose} sx={{ color: 'text.secondary' }}>Cancel</Button>
        <Button
          variant="contained"
          startIcon={<CheckIcon />}
          disabled={!valid}
          onClick={() => onSettle({ amount: Math.round(amt * 100) / 100, date: date || null, fromPayer: defaultFrom })}
        >
          Record settlement
        </Button>
      </Box>
    </AppDialog>
  )
}

export function ConfirmRemoveDialog({
  open,
  title,
  body,
  onClose,
  onConfirm,
}: {
  open: boolean
  title: string
  body: React.ReactNode
  onClose: () => void
  onConfirm: () => void
}) {
  return (
    <AppDialog open={open} onClose={onClose} title={title} width={400}>
      <Box sx={{ px: '22px', pb: '4px' }}>
        <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: 'error.light', display: 'grid', placeItems: 'center', mb: '14px' }}>
          <DeleteIcon sx={{ fontSize: 19, color: 'error.main' }} />
        </Box>
        <Typography sx={{ fontSize: 13.5, color: 'text.secondary', lineHeight: 1.5 }}>{body}</Typography>
      </Box>
      <Divider sx={{ mt: '20px' }} />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', p: '16px 22px' }}>
        <Button variant="text" onClick={onClose} sx={{ color: 'text.secondary' }}>Cancel</Button>
        <Button variant="contained" color="error" startIcon={<DeleteIcon />} onClick={onConfirm}>Remove</Button>
      </Box>
    </AppDialog>
  )
}

export function SetPartnerDialog({
  open,
  currentName,
  onClose,
  onSave,
}: {
  open: boolean
  currentName: string
  onClose: () => void
  onSave: (name: string) => void
}) {
  const [name, setName] = useState(currentName)
  return (
    <AppDialog open={open} onClose={onClose} title="Who are you splitting with?" width={400}>
      <Box sx={{ px: '22px', pb: '4px' }}>
        <Typography sx={{ fontSize: 13, color: 'text.secondary', mb: '16px' }}>
          Enter your split partner's first name. You can change this later.
        </Typography>
        <TextField label="Partner's name" value={name} onChange={(e) => setName(e.target.value)} size="small" fullWidth autoFocus />
      </Box>
      <Divider sx={{ mt: '20px' }} />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', p: '16px 22px' }}>
        <Button variant="text" onClick={onClose} sx={{ color: 'text.secondary' }}>Cancel</Button>
        <Button variant="contained" disabled={!name.trim()} onClick={() => onSave(name.trim())}>Save</Button>
      </Box>
    </AppDialog>
  )
}
