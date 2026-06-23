'use client'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import { AppDialog, Row } from '@/components/ui'

interface RemoveSubscriptionDialogProps {
  subName: string | null
  onClose: () => void
  onConfirm: () => void
}

export function RemoveSubscriptionDialog({
  subName,
  onClose,
  onConfirm,
}: RemoveSubscriptionDialogProps) {
  return (
    <AppDialog open={!!subName} onClose={onClose} title="Cancel subscription" width={400}>
      <Box sx={{ px: '22px', pb: '4px' }}>
        <Typography variant="body" sx={{ color: 'grey.500', lineHeight: 1.5 }}>
          Remove{' '}
          <Box component="span" sx={{ fontWeight: 600, color: 'text.primary' }}>
            {subName}
          </Box>{' '}
          from your list?
        </Typography>
      </Box>
      <Row justify="end" gap="10px" sx={{ p: '16px 22px 20px' }}>
        <Button variant="subtle" onClick={onClose}>Keep it</Button>
        <Button
          variant="contained"
          color="error"
          onClick={onConfirm}
          startIcon={<DeleteForeverIcon />}
        >
          Cancel subscription
        </Button>
      </Row>
    </AppDialog>
  )
}
