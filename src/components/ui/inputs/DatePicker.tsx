'use client'

import TextField from '@mui/material/TextField'
import type { SxProps, Theme } from '@mui/material/styles'

interface DatePickerProps {
  label: string
  /** ISO date string "YYYY-MM-DD" or empty string */
  value: string
  onChange: (v: string) => void
  size?: 'small' | 'medium'
  fullWidth?: boolean
  sx?: SxProps<Theme>
  min?: string
  max?: string
}

/** Themed date input. Value and onChange use ISO "YYYY-MM-DD" strings. */
export function DatePicker({ label, value, onChange, size = 'small', fullWidth, sx, min, max }: DatePickerProps) {
  return (
    <TextField
      label={label}
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      size={size}
      fullWidth={fullWidth}
      sx={sx}
      slotProps={{
        inputLabel: { shrink: true },
        htmlInput: { min, max },
      }}
    />
  )
}
