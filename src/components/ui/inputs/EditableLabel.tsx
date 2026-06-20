'use client'

import { useState, useCallback, useRef } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { brand } from '@/lib/theme'

interface EditableLabelProps {
  value: string
  onChange: (v: string) => void
  size?: number
  weight?: number
}

/** Inline click-to-edit text field. Commits on blur/Enter, cancels on Escape. */
export function EditableLabel({ value, onChange, size = 14, weight = 500 }: EditableLabelProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const ref = useRef<HTMLInputElement>(null)

  const start = useCallback(() => {
    setDraft(value)
    setEditing(true)
  }, [value])

  const commit = useCallback(() => {
    const trimmed = draft.trim()
    setEditing(false)
    if (trimmed && trimmed !== value) onChange(trimmed)
  }, [draft, value, onChange])

  if (editing) {
    return (
      <Box sx={{ display: 'inline-flex', alignItems: 'center', height: 28, border: '1px solid', borderColor: 'primary.main', borderRadius: '7px', px: 1, bgcolor: '#fff', boxShadow: `0 0 0 2px ${brand.accentSoft}` }}>
        <TextField
          inputRef={ref}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => { if (e.key === 'Enter') commit(); else if (e.key === 'Escape') setEditing(false) }}
          variant="standard"
          autoFocus
          slotProps={{ input: { disableUnderline: true, sx: { fontSize: size, fontWeight: weight, p: 0, minWidth: 80 } } }}
        />
      </Box>
    )
  }

  return (
    <Box
      component="button"
      onClick={start}
      title="Click to rename"
      sx={{
        display: 'inline-flex', alignItems: 'center',
        height: 28, px: 0.5, cursor: 'text', border: '1px solid transparent',
        borderRadius: '7px', bgcolor: 'transparent', fontFamily: 'var(--font-sans)',
        fontSize: size, fontWeight: weight, color: 'text.primary', textAlign: 'left',
        '&:hover': { bgcolor: 'grey.50', borderColor: 'divider' },
        transition: 'background 0.15s ease',
      }}
    >
      {value}
    </Box>
  )
}
