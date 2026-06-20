'use client'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { AppDialog, Row } from '@/components/ui'
import type { GroupData } from '@/utils/budget'

export function DeleteGroupDialog({
  group,
  onConfirm,
  onClose,
}: {
  group: GroupData | null
  onConfirm: () => void
  onClose: () => void
}) {
  if (!group) return null

  const catCount = group.categories.length

  return (
    <AppDialog
      open
      onClose={onClose}
      title="Delete group?"
      width={400}
    >
      <Box sx={{ px: '22px', pb: '8px' }}>
        <Typography sx={{ fontSize: 14, color: 'text.secondary', lineHeight: 1.6 }}>
          <Box component="span" sx={{ fontWeight: 600, color: 'text.primary' }}>{group.label}</Box>
          {' '}and{' '}
          <Box component="span" sx={{ fontWeight: 600, color: 'text.primary' }}>
            {catCount === 0 ? 'all its categories' : catCount === 1 ? '1 category' : `${catCount} categories`}
          </Box>
          {' '}will be permanently deleted. This cannot be undone.
        </Typography>
      </Box>
      <Row justify="end" gap={1} sx={{ px: '22px', py: '18px' }}>
        <Button variant="outlined" size="small" onClick={onClose} sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 500 }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          size="small"
          onClick={onConfirm}
          sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600, bgcolor: 'error.main', '&:hover': { bgcolor: 'error.dark' } }}
        >
          Delete
        </Button>
      </Row>
    </AppDialog>
  )
}
