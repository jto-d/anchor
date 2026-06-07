'use client'

import { useState, useMemo, useEffect } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import AddIcon from '@mui/icons-material/Add'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { brand } from '@/lib/theme'
import { fmt } from '@/utils/format'
import { CARD_CATALOG } from '@/data/cardCatalog'
import { PERK_CATALOG, type PerkTemplate } from '@/data/perkCatalog'

const FONT = "'Switzer', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif"
const FOCUS_RING = `0 0 0 3px rgba(13,122,120,0.15)`


// todo: remove quadrennial and TSA perks
const PERIOD_SUFFIX: Record<PerkTemplate['period'], string> = {
  MONTHLY:     '/ mo',
  QUARTERLY:   '/ qtr',
  SEMI_ANNUAL: '/ 6 mo',
  ANNUAL:      '/ yr',
  QUADRENNIAL: '/ 4 yr',
}

function perkValue(p: PerkTemplate): string {
  if (p.totalAmount === 0) return 'Included'
  return `${fmt(p.totalAmount)} ${PERIOD_SUFFIX[p.period]}`
}

interface CatalogCard {
  key: string
  name: string
  issuer: string
  gradient: string
  perks: PerkTemplate[]
}

/* Compact gradient swatch — credit-card proportioned, 40×28 */
function Swatch({ gradient }: { gradient: string }) {
  return (
    <Box sx={{ width: 40, height: 28, borderRadius: '5px', flex: 'none', background: gradient, position: 'relative', overflow: 'hidden', boxShadow: 'inset 0 0 0 0.5px rgba(255,255,255,0.12)' }}>
      <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(125deg, rgba(255,255,255,0.16), rgba(255,255,255,0) 55%)' }} />
      <Box sx={{ position: 'absolute', left: '5.6px', bottom: '5.6px', width: '13.6px', height: '2px', borderRadius: '2px', background: 'rgba(255,255,255,0.45)' }} />
      <Box sx={{ position: 'absolute', left: '5.6px', bottom: '10.6px', width: '8.8px', height: '2px', borderRadius: '2px', background: 'rgba(255,255,255,0.28)' }} />
    </Box>
  )
}

function CardRow({ card, selected, onSelect }: { card: CatalogCard; selected: boolean; onSelect: (key: string) => void }) {
  return (
    <Box
      component="button"
      type="button"
      onClick={() => onSelect(card.key)}
      sx={{
        display: 'flex', alignItems: 'center', gap: '13px', width: '100%', textAlign: 'left',
        padding: '9px 11px', borderRadius: '11px', cursor: 'pointer', fontFamily: 'inherit',
        border: `1.5px solid ${selected ? brand.anchor[600] : 'transparent'}`,
        background: selected ? brand.accentSoft : 'transparent',
        boxShadow: selected ? '0 0 0 3px rgba(13,122,120,0.10)' : 'none',
        transition: 'background 120ms, border-color 120ms, box-shadow 120ms',
        '&:hover': { background: selected ? brand.accentSoft : brand.zinc[50] },
      }}
    >
      <Swatch gradient={card.gradient} />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontSize: '14px', fontWeight: 600, letterSpacing: '-0.01em', color: 'text.primary', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {card.name}
        </Typography>
        <Typography sx={{ fontSize: '12.5px', color: 'grey.500', mt: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {card.issuer}
        </Typography>
      </Box>
      <Box sx={{
        width: 20, height: 20, borderRadius: '999px', flex: 'none', display: 'grid', placeItems: 'center', color: '#fff',
        border: selected ? 'none' : `1.5px solid ${brand.zinc[300]}`,
        background: selected ? brand.anchor[600] : 'transparent',
        transition: 'background 120ms, border-color 120ms',
      }}>
        {selected && <CheckIcon sx={{ fontSize: 13 }} />}
      </Box>
    </Box>
  )
}

function PerkPreview({ card }: { card: CatalogCard | null }) {
  if (!card) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '9px', p: '14px', borderRadius: '12px', border: `1px dashed ${brand.zinc[300]}`, bgcolor: 'grey.50', color: 'text.disabled', fontSize: '13px' }}>
        <AutoAwesomeIcon sx={{ fontSize: 15, color: 'text.disabled' }} />
        Select a card to preview the perks it adds.
      </Box>
    )
  }
  if (card.perks.length === 0) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '9px', p: '13px 14px', borderRadius: '12px', bgcolor: 'grey.50', border: '1px solid', borderColor: 'divider', color: 'text.secondary', fontSize: '13px', lineHeight: 1.45 }}>
        <InfoOutlinedIcon sx={{ fontSize: 15, color: 'text.disabled', mt: '1px' }} />
        <span>
          <Box component="strong" sx={{ fontWeight: 600, color: 'text.primary' }}>No pre-set perks.</Box> You can add them manually after.
        </span>
      </Box>
    )
  }
  return (
    <Box sx={{ borderRadius: '12px', border: '1px solid', borderColor: 'divider', bgcolor: '#fff', overflow: 'hidden' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '7px', p: '9px 13px', borderBottom: '1px solid', borderColor: 'divider', bgcolor: brand.accentSoft }}>
        <AutoAwesomeIcon sx={{ fontSize: 14, color: brand.anchor[700] }} />
        <Typography sx={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: brand.anchor[700], whiteSpace: 'nowrap' }}>
          {card.perks.length} {card.perks.length === 1 ? 'perk' : 'perks'} added automatically
        </Typography>
      </Box>
      <Box sx={{ maxHeight: '148px', overflowY: 'auto', py: '4px' }}>
        {card.perks.map((p, i) => {
          const val = perkValue(p)
          return (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: '10px', p: '7px 14px' }}>
              <Box sx={{ width: 5, height: 5, borderRadius: '999px', bgcolor: brand.anchor[400], flex: 'none' }} />
              <Typography sx={{ flex: 1, minWidth: 0, fontSize: '13.5px', fontWeight: 500, color: 'text.primary', letterSpacing: '-0.005em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {p.name}
              </Typography>
              <Typography sx={{ flex: 'none', fontSize: '13px', fontWeight: 600, color: val === 'Included' ? 'grey.500' : 'text.secondary', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
                {val}
              </Typography>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}

interface AddCardDialogProps {
  open: boolean
  existingDesigns: string[]
  onClose: () => void
  onAdd: (catalogKey: string, lastFour: string, openedDate: string) => Promise<void> | void
}

export function AddCardDialog({ open, existingDesigns, onClose, onAdd }: AddCardDialogProps) {
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [lastFour, setLastFour] = useState('')
  const [openedDate, setOpenedDate] = useState('')
  const [searchFocus, setSearchFocus] = useState(false)
  const [lastFocus, setLastFocus] = useState(false)
  const [dateFocus, setDateFocus] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Reset everything each time the dialog opens.
  useEffect(() => {
    if (open) {
      setSelectedKey(null)
      setQuery('')
      setLastFour('')
      setOpenedDate('')
      setSubmitting(false)
    }
  }, [open])

  const catalog = useMemo<CatalogCard[]>(
    () =>
      Object.entries(CARD_CATALOG)
        .filter(([key]) => !existingDesigns.includes(key))
        .map(([key, entry]) => ({ key, name: entry.name, issuer: entry.issuer, gradient: entry.gradient, perks: PERK_CATALOG[key] ?? [] })),
    [existingDesigns],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return catalog
    return catalog.filter((c) => (c.name + ' ' + c.issuer).toLowerCase().includes(q))
  }, [catalog, query])

  const selected = catalog.find((c) => c.key === selectedKey) ?? null

  async function handleConfirm() {
    if (!selected) return
    setSubmitting(true)
    try {
      await onAdd(selected.key, lastFour, openedDate)
    } finally {
      setSubmitting(false)
    }
  }

  const inputBase = {
    boxSizing: 'border-box' as const,
    height: 40,
    borderRadius: '10px',
    fontFamily: 'inherit',
    color: brand.zinc[950],
    background: '#fff',
    outline: 'none',
    transition: 'border-color 180ms, box-shadow 180ms',
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      slotProps={{
        paper: { sx: { width: 480, maxWidth: '100%', maxHeight: 'calc(100vh - 48px)', borderRadius: '20px', boxShadow: brand.shadow.lg, overflow: 'hidden', display: 'flex', flexDirection: 'column' } },
        backdrop: { sx: { backgroundColor: 'rgba(16,24,32,0.42)' } },
      }}
    >
      {/* Header */}
      <Box sx={{ p: '20px 22px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flex: 'none' }}>
        <Box>
          <Typography component="h2" sx={{ m: 0, fontSize: '20px', fontWeight: 600, letterSpacing: '-0.015em', color: 'text.primary' }}>
            Add a card
          </Typography>
          <Typography sx={{ mt: '4px', fontSize: '13px', color: 'grey.500' }}>
            Pick from the catalog — perks load in automatically.
          </Typography>
        </Box>
        <IconButton onClick={onClose} aria-label="Close" sx={{ color: 'text.disabled', mt: '-2px', mr: '-6px', '&:hover': { bgcolor: 'grey.100', color: 'text.secondary' } }}>
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>

      {/* Search */}
      <Box sx={{ p: '0 22px 12px', flex: 'none' }}>
        <Box sx={{ position: 'relative' }}>
          <SearchIcon sx={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'text.disabled', pointerEvents: 'none', fontSize: 16 }} />
          <Box
            component="input"
            value={query}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
            onFocus={() => setSearchFocus(true)}
            onBlur={() => setSearchFocus(false)}
            placeholder="Search cards or issuers"
            sx={{
              ...inputBase,
              width: '100%',
              pl: '36px',
              pr: '12px',
              fontSize: '14px',
              border: `1px solid ${searchFocus ? brand.anchor[600] : brand.zinc[300]}`,
              boxShadow: searchFocus ? FOCUS_RING : 'none',
              '&::placeholder': { color: brand.zinc[400] },
            }}
          />
        </Box>
      </Box>

      {/* Picker list */}
      <Box sx={{ flex: '1 1 auto', minHeight: '120px', overflowY: 'auto', px: '14px', borderTop: '1px solid', borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'grey.50' }}>
        <Box sx={{ py: '6px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {filtered.length === 0 ? (
            <Box sx={{ p: '34px 14px', textAlign: 'center', color: 'text.disabled', fontSize: '13px' }}>
              No cards match “{query}”.
            </Box>
          ) : (
            filtered.map((card) => (
              <CardRow key={card.key} card={card} selected={card.key === selectedKey} onSelect={setSelectedKey} />
            ))
          )}
        </Box>
      </Box>

      {/* Last 4 + opened date + perk preview */}
      <Box sx={{ p: '16px 22px 4px', display: 'flex', flexDirection: 'column', gap: '14px', flex: 'none' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Box component="label" htmlFor="lastfour" sx={{ fontSize: '13px', fontWeight: 600, color: 'text.primary', flex: 'none' }}>
              Last 4 <Box component="span" sx={{ color: 'text.disabled', fontWeight: 400 }}>(optional)</Box>
            </Box>
            <Box
              component="input"
              id="lastfour"
              value={lastFour}
              placeholder="1234"
              inputMode="numeric"
              maxLength={4}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastFour(e.target.value.replace(/\D/g, '').slice(0, 4))}
              onFocus={() => setLastFocus(true)}
              onBlur={() => setLastFocus(false)}
              sx={{
                ...inputBase,
                width: 88,
                textAlign: 'center',
                fontSize: '15px',
                fontWeight: 500,
                letterSpacing: '0.18em',
                fontVariantNumeric: 'tabular-nums',
                border: `1px solid ${lastFocus ? brand.anchor[600] : brand.zinc[300]}`,
                boxShadow: lastFocus ? FOCUS_RING : 'none',
                '&::placeholder': { color: brand.zinc[400], letterSpacing: '0.18em' },
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Box component="label" htmlFor="openeddate" sx={{ fontSize: '13px', fontWeight: 600, color: 'text.primary', flex: 'none' }}>
              Opened <Box component="span" sx={{ color: 'text.disabled', fontWeight: 400 }}>(optional)</Box>
            </Box>
            <Box
              component="input"
              id="openeddate"
              type="date"
              value={openedDate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOpenedDate(e.target.value)}
              onFocus={() => setDateFocus(true)}
              onBlur={() => setDateFocus(false)}
              sx={{
                ...inputBase,
                width: 148,
                px: '10px',
                fontSize: '13.5px',
                fontVariantNumeric: 'tabular-nums',
                border: `1px solid ${dateFocus ? brand.anchor[600] : brand.zinc[300]}`,
                boxShadow: dateFocus ? FOCUS_RING : 'none',
              }}
            />
          </Box>
        </Box>

        <Box
          key={selectedKey ?? 'none'}
          sx={{
            '@keyframes rowIn': { from: { opacity: 0, transform: 'translateY(3px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
            animation: selected ? 'rowIn 200ms cubic-bezier(0.2,0.6,0.2,1)' : 'none',
          }}
        >
          <PerkPreview card={selected} />
        </Box>
      </Box>

      {/* Actions */}
      <Box sx={{ p: '16px 22px 20px', display: 'flex', gap: '10px', justifyContent: 'flex-end', flex: 'none' }}>
        <Button onClick={onClose} disabled={submitting} sx={{ color: 'text.secondary', '&:hover': { bgcolor: 'grey.100' } }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={!selected || submitting}
          onClick={handleConfirm}
          startIcon={submitting ? <CircularProgress size={15} color="inherit" /> : <AddIcon />}
        >
          Add card
        </Button>
      </Box>
    </Dialog>
  )
}
