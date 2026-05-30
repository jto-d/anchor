'use client'

import { Eyebrow } from './Primitives'
import { CardTile } from './CardTile'
import { PerkRow } from './PerkRow'
import { cardCaptured, cardAvailable, perkStatus, fmt, type Card, type Perk } from '../helpers'

interface DashboardProps {
  cards: Card[]
  onOpenCard: (card: Card) => void
  onLog: (perk: Perk) => void
}

export function Dashboard({ cards, onOpenCard, onLog }: DashboardProps) {
  const captured = cards.reduce((s, c) => s + cardCaptured(c), 0)
  const available = cards.reduce((s, c) => s + cardAvailable(c), 0)
  const pct = available ? captured / available : 0

  const atRisk: { card: Card; perk: Perk }[] = []
  cards.forEach((c) =>
    c.perks.forEach((p) => {
      const st = perkStatus(p)
      if (st.key === 'open' || st.key === 'expiring' || st.key === 'partial') atRisk.push({ card: c, perk: p })
    })
  )

  return (
    <div style={{ padding: '26px 30px', maxWidth: '980px' }}>
      {/* Headline */}
      <div style={{
        background: 'var(--accent-soft)', borderRadius: '18px', padding: '22px 24px',
        marginBottom: '22px', border: '1px solid var(--anchor-100)',
      }}>
        <Eyebrow style={{ color: 'var(--anchor-700)' }}>This year</Eyebrow>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginTop: '10px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '42px', fontWeight: 600, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums', color: 'var(--anchor-800)', lineHeight: 1 }}>
            {fmt(captured)}
          </span>
          <span style={{ fontSize: '16px', color: 'var(--anchor-700)', fontWeight: 500 }}>
            recovered of {fmt(available)} available
          </span>
        </div>
        <div style={{ marginTop: '16px', maxWidth: '500px' }}>
          <div style={{ height: '7px', background: 'rgba(11,99,96,0.15)', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${Math.round(pct * 100)}%`, background: 'var(--accent)', borderRadius: '999px', transition: 'width 700ms var(--ease)' }} />
          </div>
          <div style={{ fontSize: '12px', color: 'var(--anchor-700)', marginTop: '7px', fontWeight: 500 }}>
            {Math.round(pct * 100)}% captured · {fmt(available - captured)} still on the table
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '14px', marginBottom: '28px' }}>
        <StatCard label="Cards tracked" value={String(cards.length)} sub="Across all issuers" />
        <StatCard label="Recovered" value={fmt(captured)} sub="Credits captured this year" accent="var(--anchor-700)" />
        <StatCard label="On the table" value={fmt(available - captured)} sub={`${atRisk.length} perks need attention`} accent="var(--amber-700)" />
      </div>

      {/* Card tiles */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <Eyebrow>Your cards</Eyebrow>
      </div>
      <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '32px' }}>
        {cards.map((c) => <CardTile key={c.id} card={c} compact onOpen={onOpenCard} />)}
      </div>

      {/* Needs attention */}
      <Eyebrow style={{ marginBottom: '4px' }}>Needs attention</Eyebrow>
      <p style={{ margin: '0 0 8px', fontSize: '13px', color: 'var(--fg3)' }}>Perks with value still available this period.</p>
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '4px 16px' }}>
        {atRisk.length === 0 ? (
          <div style={{ padding: '18px 4px', fontSize: '14px', color: 'var(--fg3)' }}>All caught up. Nothing on the table.</div>
        ) : (
          atRisk.slice(0, 6).map(({ perk }) => <PerkRow key={perk.id} perk={perk} onLog={onLog} />)
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: string }) {
  return (
    <div style={{
      background: '#fff', border: '1px solid var(--border)', borderRadius: '14px',
      padding: '16px 18px', flex: 1,
    }}>
      <Eyebrow>{label}</Eyebrow>
      <div style={{
        fontSize: '28px', fontWeight: 600, letterSpacing: '-0.025em', fontVariantNumeric: 'tabular-nums',
        marginTop: '10px', color: accent ?? 'var(--fg1)', lineHeight: 1,
      }}>{value}</div>
      {sub && <div style={{ fontSize: '12px', color: 'var(--fg3)', marginTop: '5px' }}>{sub}</div>}
    </div>
  )
}
