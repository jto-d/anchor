'use client'

import { useState, useRef, useEffect } from 'react'
import Box from '@mui/material/Box'
import { RewardIcon } from './RewardIcon'
import { brand } from '@/lib/theme'

export interface OverflowMenuItem {
  key: string
  label: string
  icon: string
  danger?: boolean
}

interface OverflowMenuProps {
  items: OverflowMenuItem[]
  onAction?: (key: string) => void
}

export function OverflowMenu({ items, onAction }: OverflowMenuProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  return (
    <Box ref={ref} sx={{ position: 'relative', flexShrink: 0 }}>
      <Box
        component="button"
        onClick={(e: React.MouseEvent) => { e.stopPropagation(); setOpen((v) => !v) }}
        title="Manage card"
        sx={{
          width: 30,
          height: 30,
          display: 'grid',
          placeItems: 'center',
          cursor: 'pointer',
          borderRadius: '8px',
          border: '1px solid transparent',
          background: open ? brand.zinc[100] : 'transparent',
          color: brand.zinc[500],
          fontFamily: 'inherit',
          transition: 'background 180ms ease',
          '&:hover': { background: brand.zinc[100] },
        }}
      >
        <RewardIcon name="more" size={17} />
      </Box>

      {open && (
        <Box
          sx={{
            position: 'absolute',
            top: '36px',
            right: 0,
            zIndex: 30,
            minWidth: '168px',
            background: '#fff',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: '12px',
            boxShadow: brand.shadow.lg,
            p: '6px',
          }}
        >
          {items.map((it) => (
            <Box
              key={it.key}
              component="button"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation()
                setOpen(false)
                onAction?.(it.key)
              }}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                width: '100%',
                textAlign: 'left',
                p: '8px 10px',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '8px',
                background: 'transparent',
                fontFamily: 'inherit',
                fontSize: '13.5px',
                fontWeight: 500,
                color: it.danger ? brand.red[600] : brand.zinc[950],
                transition: 'background 180ms ease',
                '&:hover': { background: it.danger ? brand.red[50] : brand.zinc[50] },
              }}
            >
              <RewardIcon
                name={it.icon}
                size={15}
                strokeWidth={1.8}
                style={{ color: it.danger ? brand.red[600] : brand.zinc[500] }}
              />
              {it.label}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
}
