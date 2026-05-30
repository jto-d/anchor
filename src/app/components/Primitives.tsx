'use client'

import { useState } from 'react'
import { Icon } from './Icons'
import type { StatusKey } from '../helpers'

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  icon?: string
  children?: React.ReactNode
  onClick?: () => void
  style?: React.CSSProperties
  type?: 'button' | 'submit' | 'reset'
}

export function Button({ variant = 'primary', size = 'md', icon, children, onClick, style, type = 'button' }: ButtonProps) {
  const [hover, setHover] = useState(false)

  const sizes: Record<string, React.CSSProperties> = {
    sm:   { height: '32px', fontSize: '13px', padding: '0 12px' },
    md:   { height: '38px', fontSize: '14px', padding: '0 16px' },
    lg:   { height: '44px', fontSize: '15px', padding: '0 20px' },
    icon: { height: '38px', width: '38px', padding: 0 },
  }

  const variants: Record<string, React.CSSProperties> = {
    primary:   { background: hover ? 'var(--accent-hover)' : 'var(--accent)', color: '#fff' },
    secondary: { background: hover ? 'var(--zinc-50)' : '#fff', color: 'var(--fg1)', border: '1px solid var(--border-strong)' },
    ghost:     { background: hover ? 'var(--zinc-100)' : 'transparent', color: hover ? 'var(--fg1)' : 'var(--fg2)' },
  }

  return (
    <button
      type={type}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        fontFamily: 'var(--font-sans)', fontWeight: 600, letterSpacing: '-0.01em',
        borderRadius: '8px', border: '1px solid transparent', cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
        lineHeight: 1, whiteSpace: 'nowrap',
        transition: 'background var(--dur) var(--ease)',
        ...sizes[size],
        ...variants[variant],
        ...style,
      }}
    >
      {icon && <Icon name={icon} size={size === 'lg' ? 18 : 16} stroke={2} />}
      {children}
    </button>
  )
}

const CHIP_STYLES: Record<StatusKey, React.CSSProperties> = {
  captured:  { background: 'var(--accent-soft)', color: 'var(--anchor-700)' },
  partial:   { background: 'var(--accent-soft)', color: 'var(--anchor-700)' },
  expiring:  { background: 'var(--amber-50)',    color: 'var(--amber-700)' },
  open:      { background: 'var(--zinc-100)',    color: 'var(--fg2)' },
  forfeited: { background: 'var(--red-50)',      color: 'var(--red-600)' },
}

interface ChipProps {
  status?: StatusKey
  icon?: string
  children: React.ReactNode
}

export function Chip({ status = 'open', icon, children }: ChipProps) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      height: '24px', padding: '0 10px', borderRadius: '999px',
      fontSize: '12px', fontWeight: 600, letterSpacing: '-0.005em',
      ...CHIP_STYLES[status],
    }}>
      {icon && <Icon name={icon} size={13} stroke={2.2} />}
      {children}
    </span>
  )
}

interface ProgressProps {
  value: number
  color?: string
  track?: string
  height?: number
}

export function Progress({ value, color = 'var(--accent)', track = 'var(--zinc-100)', height = 8 }: ProgressProps) {
  return (
    <div style={{ height, background: track, borderRadius: '999px', overflow: 'hidden' }}>
      <div style={{
        height: '100%', width: `${Math.round(value * 100)}%`,
        background: color, borderRadius: '999px',
        transition: 'width 600ms var(--ease)',
      }} />
    </div>
  )
}

export function Eyebrow({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em',
      textTransform: 'uppercase', color: 'var(--fg3)', ...style,
    }}>
      {children}
    </div>
  )
}
