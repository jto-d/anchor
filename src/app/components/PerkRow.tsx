'use client'

import { useState } from 'react'
import { Icon } from './Icons'
import { Button, Chip, Progress } from './Primitives'
import {
  capturedYTD, annualValue, perkPct, perkStatus, periodLabel,
  fmt, fmt2, fmtDate, MONTHS, type Perk,
} from '../helpers'

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
  const statusIcon = status.key === 'captured' ? 'check' : status.key === 'expiring' ? 'clock' : undefined
  const startMonthLabel = MONTHS[(perk.periodStartMonth - 1 + 12) % 12]

  return (
    <div style={{ borderBottom: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '15px 4px' }}>
        <button
          onClick={() => setOpen(!open)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: 0, flex: 'none',
            color: 'var(--fg4)', display: 'grid', placeItems: 'center',
            transform: open ? 'rotate(90deg)' : 'none',
            transition: 'transform var(--dur) var(--ease)',
          }}
        >
          <Icon name="chevronRight" size={17} />
        </button>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--fg1)' }}>{perk.name}</span>
            <Chip status={status.key} icon={statusIcon}>{status.label}</Chip>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--fg3)', marginTop: '3px' }}>
            {periodLabel(perk.period)} · {fmt2(parseFloat(perk.totalAmount))}
            {perk.period === 'MONTHLY' ? ' / mo' : perk.period === 'ANNUAL' ? ' / yr' : ''} · resets {startMonthLabel}
          </div>
        </div>

        <div style={{ width: '150px', flex: 'none' }}>
          <Progress value={pct} />
          <div style={{ fontSize: '11px', color: 'var(--fg3)', marginTop: '5px', fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}>
            <span style={{ fontWeight: 600, color: pct >= 1 ? 'var(--anchor-700)' : 'var(--fg1)' }}>{fmt(captured)}</span>
            {' '}of {fmt(annual)}
          </div>
        </div>

        <Button variant="ghost" size="sm" icon="plus" onClick={() => onLog(perk)} style={{ flex: 'none' }}>Log</Button>
      </div>

      {open && (
        <div style={{ padding: '0 4px 14px 36px', animation: 'anchorFade 150ms var(--ease)' }}>
          {perk.notes && (
            <p style={{ margin: '0 0 10px', fontSize: '12px', color: 'var(--fg3)' }}>{perk.notes}</p>
          )}
          {perk.perkCredits.length === 0 ? (
            <div style={{
              fontSize: '13px', color: 'var(--fg3)', padding: '11px 14px',
              background: 'var(--bg-subtle)', borderRadius: '10px', border: '1px solid var(--border)',
            }}>
              No credits logged this period.{' '}
              <span
                style={{ color: 'var(--anchor-700)', fontWeight: 600, cursor: 'pointer' }}
                onClick={() => onLog(perk)}
              >
                Log the first one →
              </span>
            </div>
          ) : (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, borderLeft: '1px solid var(--border)' }}>
              {perk.perkCredits.map((c) => (
                <li key={c.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '7px 14px',
                }}>
                  <span style={{ fontSize: '13px', color: 'var(--fg2)' }}>
                    {fmtDate(c.date)}
                    {c.description && <span style={{ color: 'var(--fg4)', marginLeft: '10px' }}>{c.description}</span>}
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: 500, fontVariantNumeric: 'tabular-nums', color: 'var(--anchor-700)' }}>
                    +{fmt2(parseFloat(c.amount))}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
