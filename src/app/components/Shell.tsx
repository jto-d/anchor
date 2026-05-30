'use client'

import { useState } from 'react'
import { Icon } from './Icons'
import { Button } from './Primitives'

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: 'layout' },
  { key: 'cards',     label: 'Cards',     icon: 'creditCard' },
  { key: 'perks',     label: 'Perks',     icon: 'gift' },
  { key: 'calendar',  label: 'Calendar',  icon: 'calendar' },
] as const

interface SidebarProps {
  route: string
  userEmail: string
  onNavigate: (key: string) => void
}

export function Sidebar({ route, userEmail, onNavigate }: SidebarProps) {
  const initials = userEmail.slice(0, 2).toUpperCase()

  return (
    <aside style={{
      width: '220px', flex: 'none', borderRight: '1px solid var(--border)',
      background: '#fff', display: 'flex', flexDirection: 'column',
      padding: '18px 12px', height: '100%', boxSizing: 'border-box',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '2px 8px 20px' }}>
        <div style={{
          width: '30px', height: '30px', borderRadius: '8px', background: 'var(--accent)',
          display: 'grid', placeItems: 'center', flex: 'none',
        }}>
          <Icon name="anchor" size={16} stroke={2} style={{ color: '#fff' }} />
        </div>
        <span style={{ fontSize: '18px', fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--fg1)' }}>Anchor</span>
      </div>

      {/* Nav */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.key}
            label={item.label}
            icon={item.icon}
            active={route === item.key}
            onClick={() => onNavigate(item.key)}
          />
        ))}
      </nav>

      {/* Bottom */}
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <NavItem label="Settings" icon="settings" onClick={() => {}} />
        <div style={{
          display: 'flex', alignItems: 'center', gap: '9px',
          padding: '10px 10px', marginTop: '4px',
          borderTop: '1px solid var(--border)', paddingTop: '12px',
        }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '999px', background: 'var(--zinc-200)',
            display: 'grid', placeItems: 'center', flex: 'none',
            fontSize: '11px', fontWeight: 700, color: 'var(--fg2)',
          }}>{initials}</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--fg1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {userEmail.split('@')[0]}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--fg4)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {userEmail}
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

function NavItem({ label, icon, active = false, onClick }: { label: string; icon: string; active?: boolean; onClick: () => void }) {
  const [hover, setHover] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
        padding: '8px 10px', borderRadius: '8px', border: 'none', cursor: 'pointer',
        fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 500,
        textAlign: 'left',
        background: active ? 'var(--accent-soft)' : (hover ? 'var(--zinc-100)' : 'transparent'),
        color: active ? 'var(--anchor-700)' : 'var(--fg2)',
        transition: 'background var(--dur) var(--ease)',
      }}
    >
      <Icon name={icon} size={17} stroke={active ? 2 : 1.7} />
      {label}
    </button>
  )
}

interface TopbarProps {
  title: string
  subtitle?: string
  onAddCard: () => void
}

export function Topbar({ title, subtitle, onAddCard }: TopbarProps) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '18px 30px', borderBottom: '1px solid var(--border)',
      background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)',
      position: 'sticky', top: 0, zIndex: 5,
    }}>
      <div>
        <h1 style={{ margin: 0, fontSize: '21px', fontWeight: 600, letterSpacing: '-0.015em', color: 'var(--fg1)' }}>{title}</h1>
        {subtitle && <p style={{ margin: '2px 0 0', fontSize: '13px', color: 'var(--fg3)' }}>{subtitle}</p>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px', height: '36px', padding: '0 12px',
          border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--fg4)',
          width: '190px', background: '#fff',
        }}>
          <Icon name="search" size={15} />
          <span style={{ fontSize: '13px' }}>Search perks…</span>
        </div>
        <Button variant="secondary" size="icon"><Icon name="bell" size={17} /></Button>
        <Button variant="primary" icon="plus" onClick={onAddCard}>Add a card</Button>
      </div>
    </div>
  )
}
