'use client'

import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import AnchorIcon from '@mui/icons-material/Anchor'
import { CardFace } from './CardFace'
import { CatIcon } from './CatIcon'
import { RateBadge } from './RateBadge'
import { TypeBadge } from './TypeBadge'
import { OverflowMenu } from './OverflowMenu'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { themeOf, topRewards, baseReward, CAT, fmtRate } from '@/utils/cardRewards'
import { brand } from '@/lib/theme'
import type { RewardCardData, TileStyle, Density, Reward } from '@/utils/cardRewards'

const MENU_ITEMS = [
  { key: 'edit',   label: 'Edit card',   icon: 'pencil' },
  { key: 'remove', label: 'Remove card', icon: 'trash',  danger: true },
]

function RewardLine({ reward, dense }: { reward: Reward; dense: boolean }) {
  const cat = CAT[reward.cat]
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: dense ? '9px' : '11px' }}>
      <CatIcon cat={cat} size={dense ? 28 : 32} />
      <Typography
        sx={{
          fontSize: dense ? '13px' : '13.5px',
          fontWeight: 500,
          color: 'text.primary',
          flex: 1,
          letterSpacing: '-0.005em',
        }}
      >
        {cat.label}
      </Typography>
      <RateBadge reward={reward} size={dense ? 'sm' : 'md'} />
    </Box>
  )
}

function RewardList({ card, dense }: { card: RewardCardData; dense: boolean }) {
  const rewards = topRewards(card)
  const base = baseReward(card)
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: dense ? '9px' : '11px' }}>
      {rewards.map((r) => (
        <RewardLine key={r.cat} reward={r} dense={dense} />
      ))}
      {base && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: dense ? '9px' : '11px',
            pt: dense ? '8px' : '10px',
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          <CatIcon cat={CAT.base} size={dense ? 28 : 32} />
          <Typography
            sx={{
              fontSize: dense ? '13px' : '13.5px',
              fontWeight: 500,
              color: 'text.secondary',
              flex: 1,
              letterSpacing: '-0.005em',
            }}
          >
            Everything else
          </Typography>
          <RateBadge reward={base} size={dense ? 'sm' : 'md'} muted />
        </Box>
      )}
    </Box>
  )
}

function TitleBlock({ card, dense, light }: { card: RewardCardData; dense: boolean; light?: boolean }) {
  return (
    <Box sx={{ minWidth: 0, flex: 1 }}>
      <Typography
        sx={{
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          color: light ? 'rgba(255,255,255,.8)' : 'text.disabled',
        }}
      >
        {card.issuer}
      </Typography>
      <Typography
        sx={{
          fontSize: dense ? '15px' : '16.5px',
          fontWeight: 600,
          letterSpacing: '-0.01em',
          mt: '3px',
          color: light ? '#fff' : 'text.primary',
        }}
      >
        {card.name}
      </Typography>
      <Typography
        sx={{
          fontSize: '12px',
          fontVariantNumeric: 'tabular-nums',
          letterSpacing: '0.08em',
          mt: '3px',
          color: light ? 'rgba(255,255,255,.72)' : brand.zinc[400],
        }}
      >
        •••• {card.lastFour}
      </Typography>
    </Box>
  )
}

interface RewardCardProps {
  card: RewardCardData
  style?: TileStyle
  density?: Density
  onAction: (key: string) => void
}

export function RewardCard({ card, style = 'statement', density = 'comfortable', onAction }: RewardCardProps) {
  const dense = density === 'compact'
  const th = themeOf(card)
  const [hover, setHover] = useState(false)
  const pad = dense ? '14px' : '18px'

  return (
    <Box
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      sx={{
        background: '#fff',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: '14px',
        boxShadow: hover ? brand.shadow.md : brand.shadow.sm,
        overflow: 'hidden',
        transition: 'box-shadow 180ms ease, transform 180ms ease',
        transform: hover ? 'translateY(-2px)' : 'none',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* header — style-dependent */}
      {style === 'face' ? (
        <Box sx={{ p: pad, pb: dense ? '12px' : '14px' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: dense ? '12px' : '14px' }}>
            <TypeBadge type={card.type} size="sm" />
            <OverflowMenu items={MENU_ITEMS} onAction={onAction} />
          </Box>
          <CardFace card={card} mini />
        </Box>
      ) : (
        <Box sx={{ position: 'relative' }}>
          {style === 'band' && (
            <Box sx={{ height: '5px', background: th.gradient }} />
          )}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              p: pad,
              pb: dense ? '12px' : '14px',
            }}
          >
            {style === 'band' ? (
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '11px',
                  flexShrink: 0,
                  background: th.gradient,
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <AnchorIcon sx={{ fontSize: 19, color: '#fff' }} />
              </Box>
            ) : (
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '11px',
                  flexShrink: 0,
                  border: '1px solid',
                  borderColor: 'divider',
                  background: brand.zinc[50],
                  display: 'grid',
                  placeItems: 'center',
                  position: 'relative',
                }}
              >
                <Box
                  sx={{
                    width: 11,
                    height: 11,
                    borderRadius: '999px',
                    background: th.gradient,
                  }}
                />
              </Box>
            )}
            <TitleBlock card={card} dense={dense} />
            <OverflowMenu items={MENU_ITEMS} onAction={onAction} />
          </Box>
          <Box sx={{ px: pad, pb: dense ? '12px' : '14px' }}>
            <TypeBadge type={card.type} size="sm" />
          </Box>
        </Box>
      )}

      {/* rewards body */}
      <Box
        sx={{
          p: `${dense ? '12px' : '14px'} ${pad} ${pad}`,
          borderTop: '1px solid',
          borderColor: 'divider',
          background: brand.zinc[50],
          flex: 1,
        }}
      >
        <Eyebrow sx={{ fontSize: '10px', mb: dense ? '10px' : '12px' }}>Earns</Eyebrow>
        <RewardList card={card} dense={dense} />
      </Box>
    </Box>
  )
}

/* Dense list row — used in the list layout */
export function CardListRow({ card, density = 'comfortable', onAction }: {
  card: RewardCardData
  density?: Density
  onAction: (key: string) => void
}) {
  const dense = density === 'compact'
  const th = themeOf(card)
  const rewards = topRewards(card)
  const base = baseReward(card)
  const [hover, setHover] = useState(false)

  return (
    <Box
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '18px',
        p: dense ? '12px 16px' : '16px 18px',
        background: hover ? brand.zinc[50] : '#fff',
        transition: 'background 180ms ease',
      }}
    >
      {/* identity */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '13px', width: '272px', flexShrink: 0 }}>
        <Box
          sx={{
            width: 44,
            height: 30,
            borderRadius: '6px',
            flexShrink: 0,
            background: th.gradient,
            display: 'grid',
            placeItems: 'center',
            boxShadow: '0 1px 2px rgba(16,24,32,.05)',
          }}
        >
          <AnchorIcon sx={{ fontSize: 13, color: 'rgba(255,255,255,.92)' }} />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            noWrap
            sx={{ fontSize: '14px', fontWeight: 600, letterSpacing: '-0.01em', color: 'text.primary' }}
          >
            {card.name}
          </Typography>
          <Typography sx={{ fontSize: '12px', color: 'text.disabled', mt: '1px' }}>
            {card.issuer} ·{' '}
            <Box component="span" sx={{ fontVariantNumeric: 'tabular-nums', letterSpacing: '0.04em' }}>
              •••• {card.lastFour}
            </Box>
          </Typography>
        </Box>
      </Box>

      {/* type */}
      <Box sx={{ width: '108px', flexShrink: 0 }}>
        <TypeBadge type={card.type} size="sm" />
      </Box>

      {/* reward chips */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '7px', flex: 1, minWidth: 0 }}>
        {rewards.map((r) => {
          const cat = CAT[r.cat]
          return (
            <Box
              key={r.cat}
              title={`${fmtRate(r)} on ${cat.label}`}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                height: '26px',
                pl: '7px',
                pr: '9px',
                borderRadius: '999px',
                background: '#fff',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <CatIcon cat={cat} size={18} />
              <Typography sx={{ fontSize: '12.5px', fontWeight: 500, color: 'text.secondary' }}>
                {cat.label}
              </Typography>
              <Typography
                sx={{
                  fontSize: '12.5px',
                  fontWeight: 700,
                  color: brand.anchor[700],
                  fontVariantNumeric: 'tabular-nums',
                  letterSpacing: '-0.02em',
                }}
              >
                {fmtRate(r)}
              </Typography>
            </Box>
          )
        })}
        {base && (
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: '5px', height: '26px', px: '9px', color: 'text.disabled' }}>
            <Typography sx={{ fontSize: '12.5px', fontWeight: 500 }}>
              {fmtRate(base)} on everything else
            </Typography>
          </Box>
        )}
      </Box>

      <OverflowMenu items={MENU_ITEMS} onAction={onAction} />
    </Box>
  )
}
