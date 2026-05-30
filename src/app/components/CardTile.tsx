'use client'

import { useState } from 'react'
import { Icon } from './Icons'
import { cardCaptured, cardAvailable, cardTheme, fmt, type Card } from '../helpers'

const CARD_THEMES = {
  ink:  'linear-gradient(150deg, #27272A, #09090B)',
  teal: 'linear-gradient(150deg, #0D7A78, #083E3C)',
}

interface CardTileProps {
  card: Card
  onOpen?: (card: Card) => void
  compact?: boolean
}

export function CardTile({ card, onOpen, compact }: CardTileProps) {
  const captured = cardCaptured(card)
  const available = cardAvailable(card)
  const pct = available ? captured / available : 0
  const theme = cardTheme(card.issuer)
  const [hover, setHover] = useState(false)

  return (
    <div
      onClick={() => onOpen?.(card)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: compact ? '290px' : 'auto',
        cursor: onOpen ? 'pointer' : 'default',
        borderRadius: '16px', padding: '18px 20px', color: '#fff',
        position: 'relative', overflow: 'hidden',
        background: CARD_THEMES[theme],
        boxShadow: hover && onOpen ? 'var(--shadow-lg)' : 'var(--shadow-md)',
        transform: hover && onOpen ? 'translateY(-2px)' : 'none',
        transition: 'transform var(--dur) var(--ease), box-shadow var(--dur) var(--ease)',
      }}
    >
      <Icon name="anchor" size={19} stroke={2}
        style={{ position: 'absolute', top: '16px', right: '17px', opacity: 0.9, color: '#fff' }} />
      <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', opacity: 0.75, textTransform: 'uppercase' }}>
        {card.issuer}
      </div>
      <div style={{ fontSize: '18px', fontWeight: 600, letterSpacing: '-0.01em', marginTop: '24px' }}>{card.name}</div>
      {card.lastFour && (
        <div style={{ fontSize: '12px', fontVariantNumeric: 'tabular-nums', letterSpacing: '0.12em', opacity: 0.8, marginTop: '3px' }}>
          •••• •••• •••• {card.lastFour}
        </div>
      )}
      <div style={{ marginTop: '16px' }}>
        <div style={{ height: '5px', background: 'rgba(255,255,255,0.22)', borderRadius: '999px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${Math.round(pct * 100)}%`, background: '#fff', borderRadius: '999px', transition: 'width 600ms var(--ease)' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '10px' }}>
          <div>
            <div style={{ fontSize: '10px', opacity: 0.65, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Recovered</div>
            <div style={{ fontSize: '16px', fontWeight: 600, fontVariantNumeric: 'tabular-nums', marginTop: '2px' }}>{fmt(captured)}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '10px', opacity: 0.65, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Available</div>
            <div style={{ fontSize: '16px', fontWeight: 600, fontVariantNumeric: 'tabular-nums', marginTop: '2px' }}>{fmt(available)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
