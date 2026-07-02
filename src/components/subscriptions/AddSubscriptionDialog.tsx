'use client'

import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import InputAdornment from '@mui/material/InputAdornment'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'
import AddIcon from '@mui/icons-material/Add'
import CallSplitOutlinedIcon from '@mui/icons-material/CallSplitOutlined'
import { AppDialog, DatePicker, Row, Stack } from '@/components/ui'
import { brand } from '@/lib/theme'
import {
  SUB_CATEGORIES,
  PERIOD_LABEL,
  type Subscription,
  type SubscriptionPeriod,
  type SubCard,
} from '@/data/subscriptionData'

const ICON_BY_CAT: Record<string, string> = {
  streaming: 'tv',
  software: 'code',
  news: 'newspaper',
  memberships: 'package',
  fitness: 'dumbbell',
}

const PERIODS: SubscriptionPeriod[] = ['monthly', 'quarterly', 'semiannual', 'annual']

function blankForm(defaultCardId: string) {
  return {
    name: '',
    cat: 'streaming',
    cost: '',
    period: 'monthly' as SubscriptionPeriod,
    day: '1',
    renewDate: '',
    cardId: defaultCardId,
    plan: '',
    shared: false,
  }
}

interface AddSubscriptionDialogProps {
  open: boolean
  onClose: () => void
  onAdd: (sub: Subscription) => void
  cards: SubCard[]
}

export function AddSubscriptionDialog({ open, onClose, onAdd, cards }: AddSubscriptionDialogProps) {
  const [form, setForm] = useState(() => blankForm(cards[0]?.id ?? ''))

  useEffect(() => {
    if (open) setForm(blankForm(cards[0]?.id ?? ''))
  }, [open, cards])

  const setField =
    (k: keyof ReturnType<typeof blankForm>) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [k]: e.target.value }))

  const isFixedPeriod = form.period === 'annual' || form.period === 'semiannual'

  const valid =
    form.name.trim().length > 0 &&
    Number(form.cost) > 0 &&
    (isFixedPeriod
      ? form.renewDate.length > 0
      : Number(form.day) >= 1 && Number(form.day) <= 28)

  function handleAdd() {
    if (!valid) return
    let day = Number(form.day)
    let renewM: number | undefined
    if (isFixedPeriod && form.renewDate) {
      const d = new Date(form.renewDate + 'T00:00:00')
      renewM = d.getMonth()
      day = d.getDate()
    }
    const sub: Subscription = {
      id: `sub_${Date.now()}`,
      name: form.name.trim(),
      cat: form.cat,
      icon: ICON_BY_CAT[form.cat] ?? 'repeat',
      cost: Number(form.cost),
      period: form.period,
      day,
      renewM,
      cardId: form.cardId,
      plan: form.plan.trim() || undefined,
      shared: form.shared,
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
          {isFixedPeriod ? (
            <DatePicker
              label="Renewal date"
              value={form.renewDate}
              onChange={(v) => setForm((prev) => ({ ...prev, renewDate: v }))}
              sx={{ flex: 1 }}
            />
          ) : (
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
          )}
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
          {cards.map((c) => (
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
        <Row
          justify="between"
          gap="12px"
          sx={{ px: '12px', py: '10px', border: '1px solid', borderColor: 'divider', borderRadius: '10px' }}
        >
          <Row gap="10px" sx={{ minWidth: 0 }}>
            <CallSplitOutlinedIcon sx={{ fontSize: 18, color: brand.anchor[700], flex: 'none' }} />
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontSize: 13, fontWeight: 600 }}>Split with partner</Typography>
              <Typography sx={{ fontSize: 11.5, color: 'text.secondary' }}>
                Auto-add this charge 50/50 to your Split ledger.
              </Typography>
            </Box>
          </Row>
          <Switch
            checked={form.shared}
            onChange={(e) => setForm((prev) => ({ ...prev, shared: e.target.checked }))}
            size="small"
          />
        </Row>
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
