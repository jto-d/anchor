'use client'

import { useState, useEffect } from 'react'
import { Icon } from './Icons'
import { Button, Eyebrow } from './Primitives'
import { annualValue, capturedYTD, fmt2, type Perk } from '../helpers'

interface LogCreditDialogProps {
  perk: Perk | null
  onClose: () => void
  onSave: (perkId: string, amount: number, date: string, description: string) => void
}

export function LogCreditDialog({ perk, onClose, onSave }: LogCreditDialogProps) {
  const remaining = perk ? Math.max(0, annualValue(perk) - capturedYTD(perk)) : 0
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState('')
  const [desc, setDesc] = useState('')
  const [focus, setFocus] = useState<string | null>(null)

  useEffect(() => {
    if (!perk) return
    const defaultAmt = Math.min(parseFloat(perk.totalAmount), Math.max(0, annualValue(perk) - capturedYTD(perk)))
    setAmount(String(defaultAmt))
    setDate(new Date().toISOString().slice(0, 10))
    setDesc('')
  }, [perk?.id])

  if (!perk) return null

  const inputStyle = (key: string): React.CSSProperties => ({
    width: '100%', boxSizing: 'border-box', height: '40px',
    border: `1px solid ${focus === key ? 'var(--anchor-600)' : 'var(--border-strong)'}`,
    boxShadow: focus === key ? '0 0 0 3px rgba(13,122,120,0.15)' : 'none',
    borderRadius: '8px', padding: '0 12px',
    fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--fg1)',
    background: '#fff', outline: 'none',
    transition: 'border-color var(--dur) var(--ease), box-shadow var(--dur) var(--ease)',
  })

  const label: React.CSSProperties = {
    display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--fg1)', marginBottom: '7px',
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(16,24,32,0.4)',
        display: 'grid', placeItems: 'center', zIndex: 50, padding: '24px',
        animation: 'anchorFade 160ms var(--ease)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '420px', maxWidth: '100%', background: '#fff',
          borderRadius: '20px', boxShadow: 'var(--shadow-lg)', overflow: 'hidden',
          animation: 'anchorPop 180ms var(--ease)',
        }}
      >
        <div style={{ padding: '20px 22px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <Eyebrow>Log a credit</Eyebrow>
            <h2 style={{ margin: '8px 0 0', fontSize: '20px', fontWeight: 600, letterSpacing: '-0.015em', color: 'var(--fg1)' }}>
              {perk.name}
            </h2>
            <p style={{ margin: '3px 0 0', fontSize: '13px', color: 'var(--fg3)' }}>
              {fmt2(remaining)} still available this period
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fg4)', padding: '4px', borderRadius: '8px' }}
          >
            <Icon name="x" size={18} />
          </button>
        </div>

        <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={label}>Amount</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--fg3)', fontSize: '14px' }}>$</span>
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                onFocus={() => setFocus('amount')}
                onBlur={() => setFocus(null)}
                style={{ ...inputStyle('amount'), paddingLeft: '26px', fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}
              />
            </div>
          </div>
          <div>
            <label style={label}>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              onFocus={() => setFocus('date')}
              onBlur={() => setFocus(null)}
              style={inputStyle('date')}
            />
          </div>
          <div>
            <label style={label}>
              Description{' '}
              <span style={{ color: 'var(--fg4)', fontWeight: 400 }}>(optional)</span>
            </label>
            <input
              value={desc}
              placeholder="e.g. Uber Eats"
              onChange={(e) => setDesc(e.target.value)}
              onFocus={() => setFocus('desc')}
              onBlur={() => setFocus(null)}
              style={inputStyle('desc')}
            />
          </div>
        </div>

        <div style={{ padding: '0 22px 22px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button
            variant="primary"
            icon="check"
            onClick={() => onSave(perk.id, parseFloat(amount) || 0, date, desc.trim())}
          >
            Save credit
          </Button>
        </div>
      </div>
    </div>
  )
}
