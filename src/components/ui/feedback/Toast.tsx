'use client'

import Snackbar from '@mui/material/Snackbar'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { brand } from '@/lib/theme'
import { Row } from '../layout/Flex'

export function Toast({
  message,
  onClose,
}: {
  message: string | null
  onClose: () => void
}) {
  return (
    <Snackbar
      open={!!message}
      autoHideDuration={2600}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Row
        gap={1.1}
        sx={{
          bgcolor: 'grey.900',
          color: '#fff',
          px: '18px',
          py: '11px',
          borderRadius: 999,
          fontSize: 13,
          fontWeight: 500,
          boxShadow: brand.shadow.lg,
        }}
      >
        <CheckCircleIcon sx={{ fontSize: 15, color: brand.anchor[300] }} />
        {message}
      </Row>
    </Snackbar>
  )
}
