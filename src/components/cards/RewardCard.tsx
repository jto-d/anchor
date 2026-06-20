'use client'

import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import AnchorIcon from '@mui/icons-material/Anchor'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { CatIcon } from '@/components/icons/CatIcon'
import { Row } from '@/components/ui'
import { TypeBadge } from './TypeBadge'
import IconButton from '@mui/material/IconButton'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import { themeOf, topRewards, baseReward, CAT, fmtRate } from '@/utils/cardRewards'
import { brand } from '@/lib/theme'
import { tabularNums } from '@/lib/sx'
import type { RewardCardData, Density } from '@/utils/cardRewards'


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
    <Row
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      gap="18px"
      sx={{
        p: dense ? '12px 16px' : '16px 18px',
        background: hover ? brand.zinc[50] : '#fff',
        transition: 'background 180ms ease',
      }}
    >
      {/* identity */}
      <Row gap="13px" sx={{ width: '272px', flexShrink: 0 }}>
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
            <Box component="span" sx={{ ...tabularNums, letterSpacing: '0.04em' }}>
              •••• {card.lastFour}
            </Box>
          </Typography>
        </Box>
      </Row>

      {/* type */}
      <Box sx={{ width: '108px', flexShrink: 0 }}>
        <TypeBadge type={card.type} size="sm" />
      </Box>

      {/* reward chips */}
      <Row wrap gap="7px" sx={{ flex: 1, minWidth: 0 }}>
        {rewards.map((r) => {
          const cat = CAT[r.cat]
          const noted = !!r.note
          return (
            <Row
              key={r.cat}
              inline
              gap="6px"
              title={noted ? undefined : `${fmtRate(r)} on ${cat.label}`}
              sx={{
                height: '26px',
                pl: '7px',
                pr: noted ? '7px' : '9px',
                borderRadius: '999px',
                background: '#fff',
                border: '1px solid',
                borderColor: noted ? 'primary.100' : 'divider',
                boxShadow: noted ? `inset 0 0 0 1px ${brand.anchor[50]}` : 'none',
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
                  ...tabularNums,
                  color: brand.anchor[700],
                  letterSpacing: '-0.02em',
                }}
              >
                {fmtRate(r)}
              </Typography>
              {noted && (
                <Tooltip title={r.note} arrow placement="top">
                  <InfoOutlinedIcon sx={{ fontSize: 13, color: 'primary.main', cursor: 'help' }} />
                </Tooltip>
              )}
            </Row>
          )
        })}
        {base && (
          <Row inline gap="5px" sx={{ height: '26px', px: '9px', color: 'text.disabled' }}>
            <Typography sx={{ fontSize: '12.5px', fontWeight: 500 }}>
              {fmtRate(base)} on everything else
            </Typography>
          </Row>
        )}
      </Row>

      <IconButton
        size="small"
        onClick={() => onAction('remove')}
        sx={{ color: 'text.disabled', '&:hover': { color: 'error.main' } }}
      >
        <DeleteOutlinedIcon fontSize="small" />
      </IconButton>
    </Row>
  )
}
