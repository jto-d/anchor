'use client'

import MuiTooltip, {
  tooltipClasses,
  type TooltipProps as MuiTooltipProps,
} from '@mui/material/Tooltip'
import type { SxProps, Theme } from '@mui/material/styles'
import { brand } from '@/lib/theme'

/**
 * Anchor Tooltip — a quiet, accessible tooltip on the MUI engine.
 *
 * A port of the Anchor Design System tooltip spec. Three surface treatments
 * (`dark` · `light` · `teal`), one soft 160ms motion that grows from the
 * trigger, an arrow, and an auto-flipping placement that clamps to the
 * viewport. Built on `@mui/material/Tooltip`, so it shows on hover *and*
 * keyboard focus, links via `aria-describedby`, and dismisses on Escape —
 * for free.
 *
 *   <Tooltip title="Add a card"><IconButton>…</IconButton></Tooltip>
 *   <Tooltip title="Log a credit" variant="teal" placement="top">…</Tooltip>
 *
 * For inline-text triggers (an explainer on a word mid-sentence), give the
 * trigger element {@link inlineTriggerSx} for the dotted-underline affordance.
 */

export type TooltipVariant = 'dark' | 'light' | 'teal'
/** Design placements. `auto` prefers the top, flipping/clamping to stay on screen. */
export type TooltipPlacement = 'auto' | 'top' | 'bottom' | 'left' | 'right'

export interface TooltipProps
  extends Omit<MuiTooltipProps, 'placement' | 'title' | 'slotProps'> {
  /** The short label to show (required). */
  title: React.ReactNode
  /** Surface treatment. Defaults to `dark`. */
  variant?: TooltipVariant
  /** Side to favour. Defaults to `auto` (prefers top, flips to fit). */
  placement?: TooltipPlacement
  /** Show delay in ms. Defaults to 350. */
  delay?: number
}

// Per-variant fill, text, optional hairline, shadow, and arrow color.
// Plain data so the bubble can be assembled as one contextually-typed sx object.
type VariantFill = {
  bg: string
  color: string
  border?: string
  shadow: string
  arrowBg: string
}

const VARIANT_FILL: Record<TooltipVariant, VariantFill> = {
  // zinc-900 fill, white text — classic, high contrast
  dark: {
    bg: brand.zinc[900],
    color: '#fff',
    shadow:
      '0 4px 14px -4px rgba(16,24,32,.18), 0 2px 6px -2px rgba(16,24,32,.10)',
    arrowBg: brand.zinc[900],
  },
  // white surface, hairline border, soft shadow — matches cards/menus
  light: {
    bg: '#fff',
    color: brand.zinc[900],
    border: `1px solid ${brand.zinc[200]}`,
    shadow: brand.shadow.md,
    arrowBg: '#fff',
  },
  // anchor-700 fill — branded accent for emphasis / contextual hints
  teal: {
    bg: brand.anchor[700],
    color: '#fff',
    shadow:
      '0 4px 14px -4px rgba(11,99,96,.30), 0 2px 6px -2px rgba(11,99,96,.20)',
    arrowBg: brand.anchor[700],
  },
}

/** The bubble shape (matches the spec's --atip-* tokens) + the chosen variant. */
function bubbleSx(variant: TooltipVariant): SxProps<Theme> {
  const v = VARIANT_FILL[variant]
  return {
    maxWidth: 240,
    px: '10px',
    py: '6px',
    borderRadius: '8px',
    fontSize: 13,
    fontWeight: 500,
    lineHeight: 1.4,
    letterSpacing: '-0.005em',
    textAlign: 'left',
    bgcolor: v.bg,
    color: v.color,
    border: v.border,
    boxShadow: v.shadow,
    // 9px rotated-square arrow, tucked behind the bubble (MUI default)
    [`& .${tooltipClasses.arrow}`]: { fontSize: 9 },
    [`& .${tooltipClasses.arrow}::before`]: {
      bgcolor: v.arrowBg,
      ...(v.border ? { border: v.border } : null),
    },
  }
}

/**
 * `sx` for an inline-text trigger: a dotted underline + `help` cursor, the
 * affordance the spec uses for explainer words mid-sentence.
 *
 *   <Tooltip title="Captured ÷ total" variant="light">
 *     <Box component="span" sx={inlineTriggerSx}>recovery rate</Box>
 *   </Tooltip>
 */
export const inlineTriggerSx: SxProps<Theme> = {
  textDecorationLine: 'underline',
  textDecorationStyle: 'dotted',
  textDecorationColor: brand.zinc[400],
  textUnderlineOffset: '3px',
  cursor: 'help',
}

export function Tooltip({
  title,
  variant = 'dark',
  placement = 'auto',
  delay = 350,
  arrow = true,
  children,
  ...rest
}: TooltipProps) {
  return (
    <MuiTooltip
      title={title}
      arrow={arrow}
      // `auto` favours the top, like the spec's priority order; the Popper
      // flip + preventOverflow modifiers turn it inward to stay on screen.
      placement={placement === 'auto' ? 'top' : placement}
      enterDelay={delay}
      enterNextDelay={delay}
      enterTouchDelay={delay}
      slotProps={{
        tooltip: { sx: bubbleSx(variant) },
        transition: { timeout: 160 },
      }}
      {...rest}
    >
      {children}
    </MuiTooltip>
  )
}
