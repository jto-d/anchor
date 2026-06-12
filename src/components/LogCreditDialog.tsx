'use client'

import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import { Eyebrow } from './ui/Eyebrow'
import { brand } from '@/lib/theme'
import { annualValue, capturedYTD } from '@/utils/perk'
import { fmt2 } from '@/utils/format'
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
    const defaultAmt = Math.min(parseFloat(perk.totalAmount), Math.max(0, annualValue(perk) - capturedYTD(perk)))
    setAmount(String(defaultAmt))
    setDate(new Date().toISOString().slice(0, 10))
    setDesc('')
    setTouched(false)
  }, [perk?.id])

  const remaining = shown ? Math.max(0, annualValue(shown) - capturedYTD(shown)) : 0

  const amtNum = parseFloat(amount)
  const amtInvalid = touched && (isNaN(amtNum) || amtNum <= 0)
  const dateInvalid = touched && !date

  return (
    <Dialog
      open={!!perk}
      onClose={onClose}
      slotProps={{ paper: { sx: { width: 420, maxWidth: '100%', borderRadius: '20px', boxShadow: brand.shadow.lg } } }}
    >
      {shown && (
        <>
          <DialogTitle
            component="div"
            sx={{ p: '20px 22px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
          >
            <Box>
              <Eyebrow>Log a credit</Eyebrow>
              <Typography variant="h6" sx={{ fontSize: 20, mt: 1 }}>
                {shown.name}
              </Typography>
              <Typography sx={{ fontSize: 13, color: 'grey.500', mt: '3px' }}>
                {fmt2(remaining)} still available this period
              </Typography>
            </Box>
            <IconButton onClick={onClose} sx={{ color: 'text.disabled', mt: '-4px', mr: '-8px' }}>
              <CloseIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ p: '20px 22px', display: 'flex', flexDirection: 'column', gap: 2 }}>
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
          </DialogContent>

          <DialogActions sx={{ p: '0 22px 22px', gap: 1.25 }}>
            <Button onClick={onClose} sx={{ color: 'text.secondary', '&:hover': { bgcolor: 'grey.100' } }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={<CheckIcon />}
              onClick={() => {
                setTouched(true)
                const n = parseFloat(amount)
                if (isNaN(n) || n <= 0 || !date) return
                onSave(shown.id, n, date, desc.trim())
              }}
            >
              Save credit
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  )
}
