'use client'

import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import CheckIcon from '@mui/icons-material/Check'
import { AppDialog } from '@/components/ui/AppDialog'
import { annualValue, capturedYTD } from '@/utils/perk'
import { fmtCents, toAmount } from '@/utils/format'
import type { Perk } from '@/utils/types'

interface LogCreditDialogProps {
  perk: Perk | null
  onClose: () => void
  onSave: (perkId: string, amount: number, date: string, description: string) => void
}

export function LogCreditDialog({ perk, onClose, onSave }: LogCreditDialogProps) {
  // Retain the last perk so the dialog content stays rendered through the close
  // (exit) transition, instead of flashing empty when `perk` becomes null.
  const [shown, setShown] = useState<Perk | null>(null)
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState('')
  const [desc, setDesc] = useState('')
  const [touched, setTouched] = useState(false)

  useEffect(() => {
    if (!perk) return
    setShown(perk)
    const isOpenEnded = toAmount(perk.totalAmount) === 0
    const defaultAmt = isOpenEnded
      ? 0
      : Math.min(toAmount(perk.totalAmount), Math.max(0, annualValue(perk) - capturedYTD(perk)))
    setAmount(isOpenEnded ? '' : String(defaultAmt))
    setDate(new Date().toISOString().slice(0, 10))
    setDesc('')
    setTouched(false)
  }, [perk?.id])

  const isOpenEnded = shown ? toAmount(shown.totalAmount) === 0 : false
  const remaining = shown && !isOpenEnded ? Math.max(0, annualValue(shown) - capturedYTD(shown)) : 0

  const amtNum = parseFloat(amount)
  const amtInvalid = touched && (isNaN(amtNum) || amtNum <= 0)
  const dateInvalid = touched && !date

  return (
    <AppDialog
      open={!!perk}
      onClose={onClose}
      title={shown?.name ?? ''}
      subtitle={shown ? (isOpenEnded ? 'Log a visit' : `${fmtCents(remaining)} still available this period`) : undefined}
      width={420}
    >
      {shown && (
        <>
          <Box sx={{ p: '8px 22px 20px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              fullWidth
              size="small"
              sx={{ mt: 2 }}
              error={amtInvalid}
              helperText={amtInvalid ? 'Enter a positive amount' : undefined}
              slotProps={{
                input: { startAdornment: <InputAdornment position="start">$</InputAdornment> },
                inputLabel: { shrink: true },
              }}
            />
            <TextField
              label="Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              fullWidth
              size="small"
              error={dateInvalid}
              helperText={dateInvalid ? 'Date is required' : undefined}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              label="Description (optional)"
              value={desc}
              placeholder="e.g. Uber Eats"
              onChange={(e) => setDesc(e.target.value)}
              fullWidth
              size="small"
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Box>

          <Box sx={{ p: '0 22px 22px', display: 'flex', gap: 1.25, justifyContent: 'flex-end' }}>
            <Button variant="subtle" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={<CheckIcon />}
              onClick={() => {
                setTouched(true)
                const n = toAmount(amount)
                if (isNaN(n) || n <= 0 || !date) return
                onSave(shown.id, n, date, desc.trim())
              }}
            >
              Save credit
            </Button>
          </Box>
        </>
      )}
    </AppDialog>
  )
}
