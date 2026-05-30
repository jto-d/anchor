'use client'

import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import LinearProgress from '@mui/material/LinearProgress'
import Typography from '@mui/material/Typography'
import AddIcon from '@mui/icons-material/Add'
import CheckIcon from '@mui/icons-material/Check'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined'
import { StatusChip } from './Primitives'
import { capturedYTD, annualValue, perkPct, perkStatus, periodLabel } from '@/utils/perk'
import { fmt, fmt2, fmtDate } from '@/utils/format'
import { MONTHS } from '@/utils/constants'
import type { Perk } from '@/utils/types'

interface PerkRowProps {
  perk: Perk
  onLog: (perk: Perk) => void
}

export function PerkRow({ perk, onLog }: PerkRowProps) {
  const [open, setOpen] = useState(false)
  const captured = capturedYTD(perk)
  const annual = annualValue(perk)
  const pct = perkPct(perk)
  const status = perkStatus(perk)
  const statusIcon =
    status.key === 'captured' ? <CheckIcon /> : status.key === 'expiring' ? <ScheduleOutlinedIcon /> : undefined
  const startMonthLabel = MONTHS[(perk.periodStartMonth - 1 + 12) % 12]

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', '&:last-of-type': { borderBottom: 0 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75, py: '15px', px: '4px' }}>
        <IconButton
          size="small"
          onClick={() => setOpen(!open)}
          sx={{ p: 0, color: 'text.disabled', transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 180ms' }}
        >
          <ChevronRightIcon sx={{ fontSize: 20 }} />
        </IconButton>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.01em' }}>{perk.name}</Typography>
            <StatusChip status={status.key} label={status.label} icon={statusIcon} />
          </Box>
          <Typography sx={{ fontSize: 12, color: 'grey.500', mt: '3px' }}>
            {periodLabel(perk.period)} · {fmt2(parseFloat(perk.totalAmount))}
            {perk.period === 'MONTHLY' ? ' / mo' : perk.period === 'ANNUAL' ? ' / yr' : ''} · resets {startMonthLabel}
          </Typography>
        </Box>

        <Box sx={{ width: 150, flex: 'none' }}>
          <LinearProgress
            variant="determinate"
            value={pct * 100}
            sx={{ height: 8, bgcolor: 'grey.100', '& .MuiLinearProgress-bar': { bgcolor: 'primary.main' } }}
          />
          <Typography
            sx={{ fontSize: 11, color: 'grey.500', mt: '5px', fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}
          >
            <Box component="span" sx={{ fontWeight: 600, color: pct >= 1 ? 'primary.main' : 'text.primary' }}>
              {fmt(captured)}
            </Box>{' '}
            of {fmt(annual)}
          </Typography>
        </Box>

        <Button
          size="small"
          startIcon={<AddIcon />}
          onClick={() => onLog(perk)}
          sx={{ flex: 'none', color: 'text.secondary', '&:hover': { bgcolor: 'grey.100', color: 'text.primary' } }}
        >
          Log
        </Button>
      </Box>

      <Collapse in={open} unmountOnExit>
        <Box sx={{ pl: '36px', pr: '4px', pb: '14px' }}>
          {perk.notes && <Typography sx={{ mb: 1.25, fontSize: 12, color: 'grey.500' }}>{perk.notes}</Typography>}
          {perk.perkCredits.length === 0 ? (
            <Box
              sx={{
                fontSize: 13,
                color: 'grey.500',
                p: '11px 14px',
                bgcolor: 'background.default',
                borderRadius: '10px',
                border: 1,
                borderColor: 'divider',
              }}
            >
              No credits logged this period.{' '}
              <Box
                component="span"
                onClick={() => onLog(perk)}
                sx={{ color: 'primary.main', fontWeight: 600, cursor: 'pointer' }}
              >
                Log the first one →
              </Box>
            </Box>
          ) : (
            <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, borderLeft: 1, borderColor: 'divider' }}>
              {perk.perkCredits.map((c) => (
                <Box
                  component="li"
                  key={c.id}
                  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: '14px', py: '7px' }}
                >
                  <Typography component="span" sx={{ fontSize: 13, color: 'text.secondary' }}>
                    {fmtDate(c.date)}
                    {c.description && (
                      <Box component="span" sx={{ color: 'text.disabled', ml: '10px' }}>
                        {c.description}
                      </Box>
                    )}
                  </Typography>
                  <Typography
                    component="span"
                    sx={{ fontSize: 13, fontWeight: 500, fontVariantNumeric: 'tabular-nums', color: 'primary.main' }}
                  >
                    +{fmt2(parseFloat(c.amount))}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Collapse>
    </Box>
  )
}
