'use client'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { RewardIcon } from './RewardIcon'
import { CatIcon } from './CatIcon'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { CATEGORIES, TYPE_META, themeOf, cardRate, rankForCategory } from '@/utils/cardRewards'
import { fmtRate } from '@/utils/cardRewards'
import { brand } from '@/lib/theme'
import type { RewardCardData } from '@/utils/cardRewards'
import AnchorIcon from '@mui/icons-material/Anchor'

interface SuggestMatrixProps {
  cards: RewardCardData[]
}

export function SuggestMatrix({ cards }: SuggestMatrixProps) {
  return (
    <Box>
      <Box
        sx={{
          overflowX: 'auto',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: '14px',
          background: '#fff',
        }}
      >
        <Box
          component="table"
          sx={{ borderCollapse: 'collapse', width: '100%', minWidth: 720 }}
        >
          <Box component="thead">
            <Box component="tr">
              <Box
                component="th"
                sx={{
                  position: 'sticky',
                  left: 0,
                  zIndex: 2,
                  background: '#fff',
                  textAlign: 'left',
                  p: '14px 16px',
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  minWidth: 168,
                }}
              >
                <Eyebrow sx={{ fontSize: '10px' }}>Category</Eyebrow>
              </Box>
              {cards.map((card) => {
                const th = themeOf(card)
                return (
                  <Box
                    key={card.id}
                    component="th"
                    sx={{
                      p: '12px 10px',
                      borderBottom: '1px solid',
                      borderLeft: '1px solid',
                      borderColor: 'divider',
                      minWidth: 132,
                      verticalAlign: 'bottom',
                    }}
                  >
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                      <Box
                        sx={{
                          width: 34,
                          height: 23,
                          borderRadius: '5px',
                          background: th.gradient,
                          display: 'grid',
                          placeItems: 'center',
                        }}
                      >
                        <AnchorIcon sx={{ fontSize: 11, color: 'rgba(255,255,255,.9)' }} />
                      </Box>
                      <Typography
                        sx={{
                          fontSize: '12px',
                          fontWeight: 600,
                          color: 'text.primary',
                          letterSpacing: '-0.01em',
                          textAlign: 'center',
                          lineHeight: 1.2,
                        }}
                      >
                        {card.name}
                      </Typography>
                      <RewardIcon
                        name={TYPE_META[card.type].icon}
                        size={12}
                        strokeWidth={2}
                        style={{ color: brand.zinc[400] }}
                      />
                    </Box>
                  </Box>
                )
              })}
            </Box>
          </Box>

          <Box component="tbody">
            {CATEGORIES.map((c, ri) => {
              const ranked = rankForCategory(cards, c.key)
              const top = ranked.length ? ranked[0].reward.rate : 0
              const last = ri === CATEGORIES.length - 1

              return (
                <Box component="tr" key={c.key}>
                  <Box
                    component="td"
                    sx={{
                      position: 'sticky',
                      left: 0,
                      zIndex: 1,
                      background: c.key === 'base' ? brand.zinc[50] : '#fff',
                      p: '10px 16px',
                      borderBottom: last ? 'none' : '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <CatIcon cat={c} size={28} />
                      <Typography sx={{ fontSize: '13.5px', fontWeight: 500, color: 'text.primary', letterSpacing: '-0.005em' }}>
                        {c.label}
                      </Typography>
                    </Box>
                  </Box>

                  {cards.map((card) => {
                    const reward = cardRate(card, c.key)
                    const isWin = reward && reward.rate === top && c.key !== 'base'
                    return (
                      <Box
                        key={card.id}
                        component="td"
                        sx={{
                          textAlign: 'center',
                          p: '10px',
                          borderLeft: '1px solid',
                          borderBottom: last ? 'none' : '1px solid',
                          borderColor: 'divider',
                          background: isWin
                            ? brand.accentSoft
                            : c.key === 'base'
                            ? brand.zinc[50]
                            : '#fff',
                        }}
                      >
                        {reward ? (
                          <Box sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                            <Typography
                              sx={{
                                fontSize: '14px',
                                fontWeight: isWin ? 700 : 500,
                                fontVariantNumeric: 'tabular-nums',
                                letterSpacing: '-0.02em',
                                color: isWin
                                  ? brand.anchor[700]
                                  : reward.viaBase
                                  ? brand.zinc[400]
                                  : 'text.secondary',
                              }}
                            >
                              {fmtRate(reward)}
                            </Typography>
                            {reward.note && !reward.viaBase && (
                              <Tooltip title={reward.note} arrow placement="top">
                                <InfoOutlinedIcon sx={{ fontSize: 11, color: isWin ? brand.anchor[600] : brand.zinc[400], cursor: 'help' }} />
                              </Tooltip>
                            )}
                          </Box>
                        ) : (
                          <Typography sx={{ color: brand.zinc[300] }}>—</Typography>
                        )}
                      </Box>
                    )
                  })}
                </Box>
              )
            })}
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: '7px', mt: '14px', color: brand.zinc[400] }}>
        <RewardIcon name="alert" size={13} strokeWidth={1.8} />
        <Typography sx={{ fontSize: '12px', letterSpacing: '-0.005em', color: brand.zinc[400] }}>
          Ranked by rate. Points (×) and cash back (%) aren&apos;t a direct dollar comparison.
        </Typography>
      </Box>
    </Box>
  )
}
