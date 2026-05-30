'use client'

import { Icon } from './Icons'
import { Button, Eyebrow } from './Primitives'
import { CardTile } from './CardTile'
import { PerkRow } from './PerkRow'
import { cardCaptured, cardAvailable, fmt, type Card, type Perk } from '../helpers'

interface CardDetailProps {
  card: Card
  onBack: () => void
  onLog: (perk: Perk) => void
  onAddPerk: () => void
}

export function CardDetail({ card, onBack, onLog, onAddPerk }: CardDetailProps) {
  const captured = cardCaptured(card)
  const available = cardAvailable(card)

  return (
    <div style={{ padding: '26px 30px', maxWidth: '980px' }}>
      <button
        onClick={onBack}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--fg3)', fontSize: '13px', fontWeight: 500,
          padding: '0 0 16px', fontFamily: 'var(--font-sans)',
        }}
      >
        <Icon name="chevronRight" size={14} style={{ transform: 'rotate(180deg)' }} />
        Back to dashboard
      </button>

      <div style={{ display: 'flex', gap: '26px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <CardTile card={card} />
        <div style={{ flex: 1, minWidth: '240px' }}>
          <Eyebrow>{card.issuer}</Eyebrow>
          <h1 style={{ margin: '8px 0 0', fontSize: '28px', fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--fg1)' }}>
            {card.name}
          </h1>
          <p style={{ margin: '6px 0 0', fontSize: '14px', color: 'var(--fg3)' }}>
            <span style={{ fontWeight: 600, color: 'var(--anchor-700)' }}>{fmt(captured)}</span>
            {' '}recovered of {fmt(available)} available · {card.perks.length} perks
          </p>
          <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
            <Button variant="primary" icon="plus" onClick={onAddPerk}>Add a perk</Button>
            <Button variant="secondary" icon="pencil">Edit card</Button>
          </div>
        </div>
      </div>

      <Eyebrow style={{ margin: '30px 0 6px' }}>Perks</Eyebrow>
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '4px 16px' }}>
        {card.perks.length === 0 ? (
          <div style={{ padding: '18px 4px', fontSize: '14px', color: 'var(--fg3)' }}>No perks on this card yet.</div>
        ) : (
          card.perks.map((p) => <PerkRow key={p.id} perk={p} onLog={onLog} />)
        )}
      </div>
    </div>
  )
}
