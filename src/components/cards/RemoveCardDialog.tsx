'use client'

import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import CloseIcon from '@mui/icons-material/Close'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import { brand } from '@/lib/theme'

interface RemoveCardDialogProps {
  cardName: string | null
  onClose: () => void
  onConfirm: () => Promise<void>
}

export function RemoveCardDialog({ cardName, onClose, onConfirm }: RemoveCardDialogProps) {
  const [submitting, setSubmitting] = useState(false)

  async function handleConfirm() {
    setSubmitting(true)
    try {
      await onConfirm()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog
      open={!!cardName}
      onClose={submitting ? undefined : onClose}
      maxWidth={false}
      slotProps={{
        paper: { sx: { width: 400, maxWidth: '100%', borderRadius: '20px', boxShadow: brand.shadow.lg } },
        backdrop: { sx: { backgroundColor: 'rgba(16,24,32,0.42)' } },
      }}
    >
      <Box sx={{ p: '20px 22px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography component="h2" sx={{ m: 0, fontSize: '18px', fontWeight: 600, letterSpacing: '-0.015em', color: 'text.primary' }}>
            Remove card
          </Typography>
          <Typography sx={{ mt: '5px', fontSize: '13.5px', color: 'grey.500', maxWidth: '30ch', lineHeight: 1.5 }}>
            Remove <Box component="span" sx={{ fontWeight: 600, color: 'text.primary' }}>{cardName}</Box> from your wallet? This also deletes all its perks and credit history.
          </Typography>
        </Box>
        <IconButton onClick={onClose} disabled={submitting} aria-label="Close" sx={{ color: 'text.disabled', mt: '-2px', mr: '-6px', '&:hover': { bgcolor: 'grey.100', color: 'text.secondary' } }}>
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>

      <Box sx={{ p: '8px 22px 20px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        <Button onClick={onClose} disabled={submitting} sx={{ color: 'text.secondary', '&:hover': { bgcolor: 'grey.100' } }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          disabled={submitting}
          onClick={handleConfirm}
          startIcon={submitting ? <CircularProgress size={15} color="inherit" /> : <DeleteForeverIcon />}
        >
          Remove
        </Button>
      </Box>
    </Dialog>
  )
}
