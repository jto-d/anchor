'use client'

import { createTheme } from '@mui/material/styles'

// --- Anchor brand scales (migrated from the old globals.css design tokens) ---
const zinc = {
  50: '#FAFAFA',
  100: '#F4F4F5',
  200: '#E4E4E7',
  300: '#D4D4D8',
  400: '#A1A1AA',
  500: '#71717A',
  600: '#52525B',
  700: '#3F3F46',
  800: '#27272A',
  900: '#18181B',
  950: '#09090B',
}

const anchor = {
  50: '#E9F6F6',
  100: '#CBEBEB',
  200: '#97D8D7',
  300: '#5BC1C0',
  400: '#29A8A6',
  500: '#119290',
  600: '#0D7A78',
  700: '#0B6360',
  800: '#094F4D',
  900: '#083E3C',
}

/**
 * Raw brand values for the handful of spots that need them directly
 * (the teal-soft headline panel, status-chip colors, shadows).
 * Everything else flows through the MUI theme below.
 */
export const brand = {
  zinc,
  anchor,
  amber: { 50: '#FEF6E7', 700: '#A6630A' },
  red: { 50: '#FDECEC', 600: '#D03036' },
  accentSoft: anchor[50],
  shadow: {
    sm: '0 1px 2px rgba(16,24,32,.04), 0 1px 3px rgba(16,24,32,.06)',
    md: '0 4px 14px -4px rgba(16,24,32,.10), 0 2px 6px -2px rgba(16,24,32,.06)',
    lg: '0 18px 40px -12px rgba(16,24,32,.16)',
  },
} as const

const fontFamily =
  "'Switzer', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif"

export const theme = createTheme({
  palette: {
    primary: { main: anchor[700], dark: anchor[800], light: anchor[300], contrastText: '#fff' },
    success: { main: anchor[600], light: anchor[50], contrastText: '#fff' },
    warning: { main: brand.amber[700], light: brand.amber[50] },
    error: { main: brand.red[600], light: brand.red[50] },
    background: { default: zinc[50], paper: '#FFFFFF' },
    text: { primary: zinc[950], secondary: zinc[600], disabled: zinc[400] },
    divider: zinc[200],
    grey: {
      50: zinc[50], 100: zinc[100], 200: zinc[200], 300: zinc[300], 400: zinc[400],
      500: zinc[500], 600: zinc[600], 700: zinc[700], 800: zinc[800], 900: zinc[900],
    },
  },
  shape: { borderRadius: 11 },
  typography: {
    fontFamily,
    h1: { fontWeight: 600, letterSpacing: '-0.03em' },
    h2: { fontWeight: 600, letterSpacing: '-0.025em' },
    h3: { fontWeight: 600, letterSpacing: '-0.02em' },
    h4: { fontWeight: 600, letterSpacing: '-0.02em' },
    h5: { fontWeight: 600, letterSpacing: '-0.015em' },
    h6: { fontWeight: 600, letterSpacing: '-0.01em' },
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: '-0.01em' },
    overline: {
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      lineHeight: 1.4,
    },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { borderRadius: 8 } },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: { root: { backgroundImage: 'none' } },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600 },
        label: { letterSpacing: '-0.005em' },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: 999 },
        bar: { borderRadius: 999 },
      },
    },
  },
})
