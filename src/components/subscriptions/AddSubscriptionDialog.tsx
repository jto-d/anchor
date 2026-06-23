'use client'

import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import InputAdornment from '@mui/material/InputAdornment'
import AddIcon from '@mui/icons-material/Add'
import { AppDialog, Row, Stack } from '@/components/ui'
import {
  SUB_CARDS,
  SUB_CATEGORIES,
  PERIOD_LABEL,
  type Subscription,
  type SubscriptionPeriod,
} from '@/data/subscriptionData'

const ICON_BY_CAT: Record<string, string> = {
  streaming: 'tv',
  software: 'code',
  news: 'newspaper',
  memberships: 'package',
  fitness: 'dumbbell',
}

const PERIODS: SubscriptionPeriod[] = ['monthly', 'quarterly', 'semiannual', 'annual']
const CARD_OPTIONS = Object.values(SUB_CARDS)

const BLANK = {
  name: '',
  cat: 'streaming',
  cost: '',
  period: 'monthly' as SubscriptionPeriod,
  day: '1',
  cardId: 'csr',
  plan: '',
}

interface AddSubscriptionDialogProps {
  open: boolean
  onClose: () => void
  onAdd: (sub: Subscription) => void
}

export function AddSubscriptionDialog({ open, onClose, onAdd }: AddSubscriptionDialogProps) {
  const [form, setForm] = useState(BLANK)

  useEffect(() => {
    if (open) setForm(BLANK)
  }, [open])

  const setField =
    (k: keyof typeof BLANK) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [k]: e.target.value }))

  const valid =
    form.name.trim().length > 0 &&
    Number(form.cost) > 0 &&
    Number(form.day) >= 1 &&
    Number(form.day) <= 28

  function handleAdd() {
    if (!valid) return
    const nowM = new Date().getMonth()
    const sub: Subscription = {
      id: `sub_${Date.now()}`,
      name: form.name.trim(),
      cat: form.cat,
      icon: ICON_BY_CAT[form.cat] ?? 'repeat',
      cost: Number(form.cost),
      period: form.period,
      day: Number(form.day),
      renewM:
        form.period === 'annual' || form.period === 'semiannual' ? nowM : undefined,
      cardId: form.cardId,
      plan: form.plan.trim() || undefined,
    }
    onAdd(sub)
    onClose()
  }

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      title="Add subscription"
      subtitle="Track a new recurring charge."
      width={440}
    >
      <Stack gap="14px" sx={{ px: '22px', pt: '4px', pb: '8px', overflowY: 'auto' }}>
        <TextField
          label="Name"
          placeholder="e.g. Netflix"
          value={form.name}
          onChange={setField('name')}
          size="small"
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <Row gap="14px">
          <TextField
            select
            label="Category"
            value={form.cat}
            onChange={setField('cat')}
            size="small"
            sx={{ flex: 1 }}
            slotProps={{ inputLabel: { shrink: true } }}
          >
            {SUB_CATEGORIES.map((c) => (
              <MenuItem key={c.key} value={c.key}>{c.label}</MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Billing"
            value={form.period}
            onChange={setField('period')}
            size="small"
            sx={{ flex: 1 }}
            slotProps={{ inputLabel: { shrink: true } }}
          >
            {PERIODS.map((p) => (
              <MenuItem key={p} value={p}>{PERIOD_LABEL[p]}</MenuItem>
            ))}
          </TextField>
        </Row>
        <Row gap="14px">
          <TextField
            label="Cost"
            placeholder="0.00"
            value={form.cost}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, cost: e.target.value.replace(/[^0-9.]/g, '') }))
            }
            size="small"
            sx={{ flex: 1 }}
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              },
              htmlInput: { inputMode: 'decimal' },
            }}
          />
          <TextField
            label="Billing day"
            placeholder="1–28"
            value={form.day}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                day: e.target.value.replace(/\D/g, '').slice(0, 2),
              }))
            }
            size="small"
            sx={{ width: 110 }}
            slotProps={{
              inputLabel: { shrink: true },
              htmlInput: { inputMode: 'numeric' },
            }}
          />
        </Row>
        <TextField
          select
          label="Card"
          value={form.cardId}
          onChange={setField('cardId')}
          size="small"
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
        >
          {CARD_OPTIONS.map((c) => (
            <MenuItem key={c.id} value={c.id}>
              {c.name} — {c.issuer} ••{c.lastFour}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Plan"
          placeholder="e.g. Premium 4K (optional)"
          value={form.plan}
          onChange={setField('plan')}
          size="small"
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
        />
      </Stack>

      <Row justify="end" gap="10px" sx={{ p: '16px 22px 20px' }}>
        <Button variant="subtle" onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          disabled={!valid}
          onClick={handleAdd}
          startIcon={<AddIcon />}
        >
          Add subscription
        </Button>
      </Row>
    </AppDialog>
  )
}
