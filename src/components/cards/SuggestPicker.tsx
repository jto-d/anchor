'use client'

import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { CatIcon } from './CatIcon'
import { RateBadge } from './RateBadge'
import { RewardIcon } from './RewardIcon'
import { Eyebrow } from '@/components/ui/Eyebrow'
import {
  CATEGORIES, CAT, themeOf, topRewards, rankForCategory, fmtRate, TYPE_META,
} from '@/utils/cardRewards'
import { brand } from '@/lib/theme'
import type { RewardCardData, CategoryKey } from '@/utils/cardRewards'

function RateCompareNote() {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '7px', mt: '14px', color: brand.zinc[400] }}>
      <RewardIcon name="alert" size={13} strokeWidth={1.8} />
      <Typography sx={{ fontSize: '12px', letterSpacing: '-0.005em', color: brand.zinc[400] }}>
        Ranked by rate. Points (×) and cash back (%) aren&apos;t a direct dollar comparison.
      </Typography>
    </Box>
  )
}

interface SuggestPickerProps {
  cards: RewardCardData[]
}

export function SuggestPicker({ cards }: SuggestPickerProps) {
  const [selected, setSelected] = useState<CategoryKey>('dining')
  const cat = CAT[selected]
  const ranked = rankForCategory(cards, selected)
  const winners = ranked.filter((r) => r.winner)

  return (
    <Box>
      {/* category selector */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px', mb: '20px' }}>
        {CATEGORIES.filter((c) => c.key !== 'base').map((c) => {
          const active = c.key === selected
          return (
            <Box
              key={c.key}
              component="button"
              onClick={() => setSelected(c.key as CategoryKey)}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                height: '38px',
                pl: '10px',
                pr: '14px',
                borderRadius: '999px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: '13.5px',
                fontWeight: active ? 600 : 500,
                letterSpacing: '-0.005em',
                border: '1px solid',
                borderColor: active ? brand.anchor[700] : 'divider',
                background: active ? brand.anchor[700] : '#fff',
                color: active ? '#fff' : 'text.secondary',
                transition: 'background 180ms ease, color 180ms ease, border-color 180ms ease',
                '&:hover': !active ? { background: brand.zinc[50] } : {},
              }}
            >
              <CatIcon cat={c} size={20} active={active} dark={active} />
              {c.label}
            </Box>
          )
        })}
      </Box>

      {/* result grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '16px', alignItems: 'stretch' }}>
        {/* winner panel */}
        <Box
          sx={{
            background: brand.accentSoft,
            border: '1px solid',
            borderColor: brand.anchor[100],
            borderRadius: '14px',
            p: '22px 24px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', color: brand.anchor[700] }}>
            <RewardIcon name="trophy" size={15} strokeWidth={2} />
            <Eyebrow sx={{ color: brand.anchor[700] }}>
              {winners.length > 1
                ? `Top cards for ${cat.label.toLowerCase()}`
                : `Best for ${cat.label.toLowerCase()}`}
            </Eyebrow>
          </Box>

          <Box sx={{ mt: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {winners.map(({ card, reward }) => {
              const th = themeOf(card)
              return (
                <Box key={card.id} sx={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <Box
                    sx={{
                      width: 52,
                      height: 52,
                      borderRadius: '13px',
                      flexShrink: 0,
                      background: th.gradient,
                      display: 'grid',
                      placeItems: 'center',
                      boxShadow: brand.shadow.sm,
                    }}
                  >
                    <RewardIcon name="anchor" size={22} strokeWidth={2} color="#fff" />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontSize: '19px',
                        fontWeight: 600,
                        letterSpacing: '-0.015em',
                        color: brand.anchor[900],
                        lineHeight: 1.15,
                      }}
                    >
                      {card.name}
                    </Typography>
                    <Typography sx={{ fontSize: '12.5px', color: brand.anchor[700], mt: '2px' }}>
                      {card.issuer} · {TYPE_META[card.type].label}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                    <Typography
                      sx={{
                        fontSize: '34px',
                        fontWeight: 700,
                        letterSpacing: '-0.03em',
                        color: brand.anchor[800],
                        fontVariantNumeric: 'tabular-nums',
                        lineHeight: 1,
                      }}
                    >
                      {fmtRate(reward)}
                    </Typography>
                    <Typography sx={{ fontSize: '11px', color: brand.anchor[700], mt: '3px', letterSpacing: '0.02em' }}>
                      {card.type === 'points' ? 'points' : 'cash back'}
                    </Typography>
                  </Box>
                </Box>
              )
            })}
          </Box>

          {/* also earns — only when there's a single winner */}
          {winners.length === 1 && (() => {
            const others = topRewards(winners[0].card).filter((r) => r.cat !== selected).slice(0, 4)
            if (!others.length) return null
            return (
              <Box
                sx={{
                  mt: '20px',
                  pt: '18px',
                  borderTop: '1px solid',
                  borderColor: brand.anchor[100],
                }}
              >
                <Eyebrow sx={{ color: brand.anchor[600], fontSize: '10px', mb: '10px' }}>
                  Also earns
                </Eyebrow>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
                  {others.map((r) => {
                    const oc = CAT[r.cat]
                    return (
                      <Box
                        key={r.cat}
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          height: '28px',
                          pl: '8px',
                          pr: '10px',
                          borderRadius: '999px',
                          background: 'rgba(255,255,255,0.7)',
                          border: '1px solid',
                          borderColor: brand.anchor[100],
                        }}
                      >
                        <RewardIcon name={oc.icon} size={13} strokeWidth={1.8} color={brand.anchor[600]} />
                        <Typography sx={{ fontSize: '12.5px', fontWeight: 500, color: brand.anchor[800] }}>
                          {oc.label}
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
                </Box>
              </Box>
            )
          })()}

          <Typography sx={{ mt: 'auto', pt: '18px', fontSize: '13px', color: brand.anchor[700], lineHeight: 1.5 }}>
            {winners.length > 1 ? (
              <>These cards tie at the top rate for {cat.label.toLowerCase()}. Reach for whichever fits your goal — points or cash back.</>
            ) : (
              <>Reach for your <strong style={{ fontWeight: 600 }}>{winners[0]?.card.name}</strong> on {cat.blurb.toLowerCase()}.</>
            )}
          </Typography>
        </Box>

        {/* ranked board */}
        <Box
          sx={{
            background: '#fff',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: '14px',
            p: '6px 4px',
          }}
        >
          {ranked.map(({ card, reward, winner, viaBase }, i) => (
            <Box
              key={card.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                p: '11px 16px',
                borderBottom: i < ranked.length - 1 ? '1px solid' : 'none',
                borderColor: 'divider',
              }}
            >
              <Typography
                sx={{
                  width: '18px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: winner ? brand.anchor[700] : brand.zinc[400],
                  fontVariantNumeric: 'tabular-nums',
                  textAlign: 'right',
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </Typography>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '999px',
                  flexShrink: 0,
                  background: themeOf(card).gradient,
                }}
              />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  noWrap
                  sx={{ fontSize: '13.5px', fontWeight: winner ? 600 : 500, color: 'text.primary' }}
                >
                  {card.name}
                </Typography>
                <Typography sx={{ fontSize: '11.5px', color: brand.zinc[400] }}>
                  {card.issuer}{viaBase ? ' · base rate' : ''}
                </Typography>
              </Box>
              <RateBadge reward={reward} winner={winner} muted={!winner} size="sm" />
            </Box>
          ))}
        </Box>
      </Box>

      <RateCompareNote />
    </Box>
  )
}
