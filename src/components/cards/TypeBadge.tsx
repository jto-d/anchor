'use client'

import { TYPE_META } from '@/utils/cardRewards'
import { RewardIcon } from '@/components/icons/RewardIcon'
import { Row } from '@/components/ui'
import { brand } from '@/lib/theme'
import type { CardType } from '@/utils/cardRewards'

interface TypeBadgeProps {
  type: CardType
  size?: 'sm' | 'md'
}

export function TypeBadge({ type, size = 'md' }: TypeBadgeProps) {
  const meta = TYPE_META[type]
  const sm = size === 'sm'
  return (
    <Row
      inline
      gap={sm ? '4px' : '5px'}
      sx={{
        height: sm ? '20px' : '24px',
        px: sm ? '7px' : '9px',
        borderRadius: '999px',
        fontSize: sm ? '11px' : '12px',
        fontWeight: 600,
        letterSpacing: '-0.005em',
        border: '1px solid',
        borderColor: 'divider',
        background: '#fff',
        color: brand.zinc[600],
        whiteSpace: 'nowrap',
      }}
    >
      <RewardIcon name={meta.icon} size={sm ? 11 : 13} strokeWidth={2} style={{ color: brand.zinc[500] }} />
      {meta.label}
    </Row>
  )
}
