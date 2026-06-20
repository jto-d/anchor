import type { SxProps, Theme } from '@mui/material/styles'
import { brand } from '@/lib/theme'
import { Row } from '@/components/ui/layout/Flex'
import { Dot } from './Dot'

export type TagTone = 'accent' | 'neutral' | 'amber' | 'red'
export type TagVariant = 'soft' | 'outline'

const TONES: Record<TagTone, { soft: object; outline: object }> = {
  accent: {
    soft: { bgcolor: brand.accentSoft, color: brand.anchor[700] },
    outline: { color: brand.anchor[700], borderColor: brand.anchor[100] },
  },
  neutral: {
    soft: { bgcolor: 'grey.100', color: 'text.secondary' },
    outline: { color: 'text.secondary', borderColor: 'divider' },
  },
  amber: {
    soft: { bgcolor: brand.gold[50], color: brand.amber[700] },
    outline: { color: brand.amber[700], borderColor: brand.gold[500] },
  },
  red: {
    soft: { bgcolor: brand.red[50], color: brand.red[600] },
    outline: { color: brand.red[600], borderColor: brand.red[300] },
  },
}

interface TagProps {
  tone?: TagTone
  variant?: TagVariant
  size?: 'sm' | 'md'
  /** A leading colored dot (pass any color). */
  dot?: string
  /** A leading icon node. */
  icon?: React.ReactNode
  children: React.ReactNode
  sx?: SxProps<Theme>
}

/** A compact rounded pill for labels, legend entries, and status chips. */
export function Tag({ tone = 'neutral', variant = 'soft', size = 'md', dot, icon, children, sx }: TagProps) {
  const h = size === 'sm' ? 22 : 24
  const px = size === 'sm' ? '8px' : '10px'
  const fontSize = size === 'sm' ? 11 : 12
  const toneStyle =
    variant === 'outline'
      ? { bgcolor: '#fff', border: '1px solid', ...TONES[tone].outline }
      : TONES[tone].soft

  return (
    <Row
      inline
      gap="6px"
      sx={[
        {
          height: h,
          px,
          borderRadius: 999,
          fontSize,
          fontWeight: 600,
          letterSpacing: '-0.005em',
          whiteSpace: 'nowrap',
          ...toneStyle,
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      {dot && <Dot size={8} color={dot} />}
      {icon}
      {children}
    </Row>
  )
}
