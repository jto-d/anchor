'use client'

import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import AddIcon from '@mui/icons-material/Add'
import CheckIcon from '@mui/icons-material/Check'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined'
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined'
import { Dot, ProgressBar, Row, StatusChip } from '@/components/ui'
import { tabularNums } from '@/lib/sx'
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
  const isOpenEnded = perPeriod === 0
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
      <Row gap={1.75} sx={{ py: '15px', px: '4px' }}>
        <IconButton
          size="small"
          onClick={() => setOpen(!open)}
          sx={{ p: 0, color: 'text.disabled', transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 180ms' }}
        >
          <ChevronRightIcon sx={{ fontSize: 20 }} />
        </IconButton>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Row gap={1.25} wrap>
            <Typography sx={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.01em' }}>{perk.name}</Typography>
            <StatusChip status={status.key} label={status.label} icon={statusIcon} />
            {card && (
              <Row inline gap="5px" sx={{ px: '7px', py: '2px', borderRadius: '99px', border: 1, borderColor: 'divider', bgcolor: 'grey.50', whiteSpace: 'nowrap' }}>
                <Dot size={8} color={resolveCardDesign(card.design).gradient} />
                <Typography sx={{ fontSize: 11, fontWeight: 600, color: 'text.secondary' }}>{card.name}</Typography>
              </Row>
            )}
            {perk.enrollmentRequired && (
              <Chip
                size="small"
                icon={<NotificationsActiveOutlinedIcon sx={{ fontSize: 11 }} />}
                label="Enrollment required"
                sx={{ fontSize: 11, height: 20, bgcolor: 'warning.50', color: 'warning.800', border: 1, borderColor: 'warning.200', '& .MuiChip-icon': { color: 'warning.600' } }}
              />
            )}
          </Row>
          <Typography sx={{ fontSize: 12, color: 'grey.500', mt: '3px' }}>
            {isOpenEnded
              ? `${perk.perkCredits.length} visit${perk.perkCredits.length !== 1 ? 's' : ''} logged`
              : `${periodLabel(perk.period)} · ${fmtCents(perPeriod)}${isMonthly ? ' / mo' : perk.period === 'ANNUAL' ? ' / yr' : ''} · resets ${resetLabel}`}
          </Typography>
        </Box>

        <Box sx={{ width: 150, flex: 'none' }}>
          {isOpenEnded ? (
            <Typography sx={{ ...tabularNums, fontSize: 13, fontWeight: 600, color: 'primary.main', textAlign: 'right' }}>
              {fmtDollars(ytd)}
              <Box component="span" sx={{ fontSize: 11, fontWeight: 400, color: 'grey.500' }}> this year</Box>
            </Typography>
          ) : isMonthly ? (
            <>
              <ProgressBar value={monthPct} />
              <Typography
                sx={{ ...tabularNums, fontSize: 11, color: 'grey.500', mt: '5px', textAlign: 'right' }}
              >
                <Box component="span" sx={{ fontWeight: 600, color: monthPct >= 1 ? 'primary.main' : 'text.primary' }}>
                  {fmtDollars(thisMonth)}
                </Box>{' '}
                of {fmtDollars(perPeriod)} this mo
              </Typography>
              <ProgressBar value={annual > 0 ? ytd / annual : 0} color="grey.400" thin sx={{ mt: '8px' }} />
              <Typography
                sx={{ ...tabularNums, fontSize: 10, color: 'grey.400', mt: '3px', textAlign: 'right' }}
              >
                {fmtDollars(ytd)} of {fmtDollars(annual)} / yr
              </Typography>
            </>
          ) : (
            <>
              <ProgressBar value={pct} />
              <Typography
                sx={{ ...tabularNums, fontSize: 11, color: 'grey.500', mt: '5px', textAlign: 'right' }}
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
      </Row>

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
              {isOpenEnded ? 'No visits logged yet.' : 'No credits logged this period.'}{' '}
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
                <Row
                  component="li"
                  key={c.id}
                  justify="between"
                  sx={{ px: '14px', py: '7px' }}
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
                    sx={{ ...tabularNums, fontSize: 13, fontWeight: 500, color: 'primary.main' }}
                  >
                    +{fmtCents(toAmount(c.amount))}
                  </Typography>
                </Row>
              ))}
            </Box>
          )}
        </Box>
      </Collapse>
    </Box>
  )
}
