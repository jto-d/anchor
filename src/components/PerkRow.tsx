'use client'

import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import LinearProgress from '@mui/material/LinearProgress'
import Typography from '@mui/material/Typography'
import AddIcon from '@mui/icons-material/Add'
import CheckIcon from '@mui/icons-material/Check'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined'
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined'
import { StatusChip } from './ui/StatusChip'
import { capturedYTD, capturedThisMonth, capturedInCycle, annualValue, perkPct, perkStatus, periodLabel, nextResetDate } from '@/utils/perk'
import { fmtDollars, fmtCents, fmtDate, toAmount } from '@/utils/format'
import { resolveCardDesign } from '@/utils/cardDesigns'
import type { Card, Perk } from '@/utils/types'

interface PerkRowProps {
  perk: Perk
  card?: Card
  cardOpenedDate?: string | null
  onLog: (perk: Perk) => void
}

export function PerkRow({ perk, card, cardOpenedDate, onLog }: PerkRowProps) {
  const [open, setOpen] = useState(false)
  const isMonthly = perk.period === 'MONTHLY'

  const captured   = capturedInCycle(perk, cardOpenedDate)
  const perPeriod  = toAmount(perk.totalAmount)
  const annual     = annualValue(perk)
  const ytd        = capturedYTD(perk)
  const pct        = perkPct(perk, cardOpenedDate)
  const status     = perkStatus(perk, cardOpenedDate)
  const thisMonth  = isMonthly ? capturedThisMonth(perk) : 0
  const monthPct   = isMonthly && perPeriod > 0 ? Math.min(1, thisMonth / perPeriod) : 0

  const resetDate  = nextResetDate(perk, cardOpenedDate)
  const resetLabel = resetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  const statusIcon =
    status.key === 'captured' ? <CheckIcon /> : status.key === 'expiring' ? <ScheduleOutlinedIcon /> : undefined

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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flexWrap: 'wrap' }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.01em' }}>{perk.name}</Typography>
            <StatusChip status={status.key} label={status.label} icon={statusIcon} />
            {card && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px', px: '7px', py: '2px', borderRadius: '99px', border: 1, borderColor: 'divider', bgcolor: 'grey.50', flex: 'none', whiteSpace: 'nowrap' }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: resolveCardDesign(card.design).gradient, flex: 'none' }} />
                <Typography sx={{ fontSize: 11, fontWeight: 600, color: 'text.secondary' }}>{card.name}</Typography>
              </Box>
            )}
            {perk.enrollmentRequired && (
              <Chip
                size="small"
                icon={<NotificationsActiveOutlinedIcon sx={{ fontSize: 11 }} />}
                label="Enrollment required"
                sx={{ fontSize: 11, height: 20, bgcolor: 'warning.50', color: 'warning.800', border: 1, borderColor: 'warning.200', '& .MuiChip-icon': { color: 'warning.600' } }}
              />
            )}
          </Box>
          <Typography sx={{ fontSize: 12, color: 'grey.500', mt: '3px' }}>
            {periodLabel(perk.period)} · {fmtCents(perPeriod)}
            {isMonthly ? ' / mo' : perk.period === 'ANNUAL' ? ' / yr' : ''} · resets {resetLabel}
          </Typography>
        </Box>

        <Box sx={{ width: 150, flex: 'none' }}>
          {isMonthly ? (
            <>
              <LinearProgress
                variant="determinate"
                value={monthPct * 100}
                sx={{ height: 8, bgcolor: 'grey.100', '& .MuiLinearProgress-bar': { bgcolor: 'primary.main' } }}
              />
              <Typography
                sx={{ fontSize: 11, color: 'grey.500', mt: '5px', fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}
              >
                <Box component="span" sx={{ fontWeight: 600, color: monthPct >= 1 ? 'primary.main' : 'text.primary' }}>
                  {fmtDollars(thisMonth)}
                </Box>{' '}
                of {fmtDollars(perPeriod)} this mo
              </Typography>
              <LinearProgress
                variant="determinate"
                value={annual > 0 ? Math.min(1, ytd / annual) * 100 : 0}
                sx={{ height: 5, mt: '8px', bgcolor: 'grey.100', '& .MuiLinearProgress-bar': { bgcolor: 'grey.400' } }}
              />
              <Typography
                sx={{ fontSize: 10, color: 'grey.400', mt: '3px', fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}
              >
                {fmtDollars(ytd)} of {fmtDollars(annual)} / yr
              </Typography>
            </>
          ) : (
            <>
              <LinearProgress
                variant="determinate"
                value={pct * 100}
                sx={{ height: 8, bgcolor: 'grey.100', '& .MuiLinearProgress-bar': { bgcolor: 'primary.main' } }}
              />
              <Typography
                sx={{ fontSize: 11, color: 'grey.500', mt: '5px', fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}
              >
                <Box component="span" sx={{ fontWeight: 600, color: pct >= 1 ? 'primary.main' : 'text.primary' }}>
                  {fmtDollars(captured)}
                </Box>{' '}
                of {fmtDollars(perPeriod)}
              </Typography>
            </>
          )}
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
                    +{fmtCents(toAmount(c.amount))}
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
