'use client'

import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import { AppDialog, Row } from '@/components/ui'

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
    <AppDialog
      open={!!cardName}
      onClose={onClose}
      title="Remove card"
      width={400}
      disableClose={submitting}
    >
      <Box sx={{ px: '22px', pb: '4px' }}>
        <Typography variant="body" sx={{ color: 'grey.500', maxWidth: '30ch', lineHeight: 1.5 }}>
          Remove <Box component="span" sx={{ fontWeight: 600, color: 'text.primary' }}>{cardName}</Box> from your wallet? This also deletes all its perks and credit history.
        </Typography>
      </Box>

      <Row justify="end" gap="10px" sx={{ p: '16px 22px 20px' }}>
        <Button variant="subtle" onClick={onClose} disabled={submitting}>
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
      </Row>
    </AppDialog>
  )
}
