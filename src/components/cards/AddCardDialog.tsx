'use client'

import { useState, useMemo, useEffect } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import AddIcon from '@mui/icons-material/Add'
import CheckIcon from '@mui/icons-material/Check'
import SearchIcon from '@mui/icons-material/Search'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { AppDialog, Dot, Row, Stack } from '@/components/ui'
import { brand } from '@/lib/theme'
import { truncate, tabularNums } from '@/lib/sx'
import { fmtDollars } from '@/utils/format'
import { CARD_CATALOG } from '@/data/cardCatalog'
import { PERK_CATALOG, type PerkTemplate } from '@/data/perkCatalog'

const PERIOD_SUFFIX: Record<PerkTemplate['period'], string> = {
  MONTHLY:     '/ mo',
  QUARTERLY:   '/ qtr',
  SEMI_ANNUAL: '/ 6 mo',
  ANNUAL:      '/ yr',
  QUADRENNIAL: '/ 4 yr',
}

function perkValue(p: PerkTemplate): string {
  if (p.totalAmount === 0) return 'Included'
  return `${fmtDollars(p.totalAmount)} ${PERIOD_SUFFIX[p.period]}`
}

interface CatalogCard {
  key: string
  name: string
  issuer: string
  color: string
  perks: PerkTemplate[]
}

/* Compact card swatch — credit-card proportioned, 40×28 */
function Swatch({ color }: { color: string }) {
  return (
    <Box sx={{ width: 40, height: 28, borderRadius: '5px', flex: 'none', bgcolor: color, position: 'relative', overflow: 'hidden', boxShadow: 'inset 0 0 0 0.5px rgba(255,255,255,0.12)' }}>
      <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(125deg, rgba(255,255,255,0.16), rgba(255,255,255,0) 55%)' }} />
      <Box sx={{ position: 'absolute', left: '5.6px', bottom: '5.6px', width: '13.6px', height: '2px', borderRadius: '2px', background: 'rgba(255,255,255,0.45)' }} />
      <Box sx={{ position: 'absolute', left: '5.6px', bottom: '10.6px', width: '8.8px', height: '2px', borderRadius: '2px', background: 'rgba(255,255,255,0.28)' }} />
    </Box>
  )
}

function CardRow({ card, selected, onSelect }: { card: CatalogCard; selected: boolean; onSelect: (key: string) => void }) {
  return (
    <Row
      component="button"
      onClick={() => onSelect(card.key)}
      gap="13px"
      sx={{
        width: '100%', textAlign: 'left',
        padding: '9px 11px', borderRadius: '11px', cursor: 'pointer', fontFamily: 'inherit',
        border: `1.5px solid ${selected ? brand.anchor[600] : 'transparent'}`,
        background: selected ? brand.accentSoft : 'transparent',
        boxShadow: selected ? '0 0 0 3px rgba(13,122,120,0.10)' : 'none',
        transition: 'background 120ms, border-color 120ms, box-shadow 120ms',
        '&:hover': { background: selected ? brand.accentSoft : brand.zinc[50] },
      }}
    >
      <Swatch color={card.color} />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ ...truncate, fontSize: '14px', fontWeight: 600, letterSpacing: '-0.01em', color: 'text.primary' }}>
          {card.name}
        </Typography>
        <Typography sx={{ ...truncate, fontSize: '12.5px', color: 'grey.500', mt: '1px' }}>
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
    </Row>
  )
}

function PerkPreview({ card }: { card: CatalogCard | null }) {
  if (!card) {
    return (
      <Row gap="9px" sx={{ p: '14px', borderRadius: '12px', border: `1px dashed ${brand.zinc[300]}`, bgcolor: 'grey.50', color: 'text.disabled', fontSize: '13px' }}>
        <AutoAwesomeIcon sx={{ fontSize: 15, color: 'text.disabled' }} />
        Select a card to preview the perks it adds.
      </Row>
    )
  }
  if (card.perks.length === 0) {
    return (
      <Row align="start" gap="9px" sx={{ p: '13px 14px', borderRadius: '12px', bgcolor: 'grey.50', border: '1px solid', borderColor: 'divider', color: 'text.secondary', fontSize: '13px', lineHeight: 1.45 }}>
        <InfoOutlinedIcon sx={{ fontSize: 15, color: 'text.disabled', mt: '1px' }} />
        <Box component="strong" sx={{ fontWeight: 600, color: 'text.primary' }}>This card has no pre-set perks.</Box>
      </Row>
    )
  }
  return (
    <Box sx={{ borderRadius: '12px', border: '1px solid', borderColor: 'divider', bgcolor: '#fff', overflow: 'hidden' }}>
      <Row gap="7px" sx={{ p: '9px 13px', borderBottom: '1px solid', borderColor: 'divider', bgcolor: brand.accentSoft }}>
        <AutoAwesomeIcon sx={{ fontSize: 14, color: brand.anchor[700] }} />
        <Typography sx={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: brand.anchor[700], whiteSpace: 'nowrap' }}>
          {card.perks.length} {card.perks.length === 1 ? 'perk' : 'perks'} added automatically
        </Typography>
      </Row>
      <Box sx={{ maxHeight: '148px', overflowY: 'auto', py: '4px' }}>
        {card.perks.map((p, i) => {
          const val = perkValue(p)
          return (
            <Row key={i} gap="10px" sx={{ p: '7px 14px' }}>
              <Dot size={5} color={brand.anchor[400]} />
              <Typography sx={{ ...truncate, flex: 1, minWidth: 0, fontSize: '13.5px', fontWeight: 500, color: 'text.primary', letterSpacing: '-0.005em' }}>
                {p.name}
              </Typography>
              <Typography sx={{ ...tabularNums, flex: 'none', fontSize: '13px', fontWeight: 600, color: val === 'Included' ? 'grey.500' : 'text.secondary', whiteSpace: 'nowrap' }}>
                {val}
              </Typography>
            </Row>
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
        .map(([key, entry]) => ({ key, name: entry.name, issuer: entry.issuer, color: entry.color, perks: PERK_CATALOG[key] ?? [] })),
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

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      title="Add a card"
      subtitle="Pick from the catalog — perks load in automatically."
      width={480}
      disableClose={submitting}
    >
      {/* Search */}
      <Box sx={{ p: '0 22px 12px', flex: 'none' }}>
        <TextField
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search cards or issuers"
          fullWidth
          size="small"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      {/* Picker list */}
      <Box sx={{ flex: '1 1 auto', minHeight: '120px', overflowY: 'auto', px: '14px', borderTop: '1px solid', borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'grey.50' }}>
        <Stack gap="2px" sx={{ py: '6px' }}>
          {filtered.length === 0 ? (
            <Box sx={{ p: '34px 14px', textAlign: 'center', color: 'text.disabled', fontSize: '13px' }}>
              No cards match “{query}”.
            </Box>
          ) : (
            filtered.map((card) => (
              <CardRow key={card.key} card={card} selected={card.key === selectedKey} onSelect={setSelectedKey} />
            ))
          )}
        </Stack>
      </Box>

      {/* Last 4 + opened date + perk preview */}
      <Stack gap="14px" sx={{ p: '16px 22px 4px', flex: 'none' }}>
        <Row gap="14px" align="stretch">
          <TextField
            label="Last 4"
            value={lastFour}
            placeholder="1234"
            onChange={(e) => setLastFour(e.target.value.replace(/\D/g, '').slice(0, 4))}
            size="small"
            sx={{ width: 120 }}
            slotProps={{
              inputLabel: { shrink: true },
              htmlInput: { inputMode: 'numeric', maxLength: 4 },
            }}
          />
          <TextField
            label="Opened"
            type="date"
            value={openedDate}
            onChange={(e) => setOpenedDate(e.target.value)}
            size="small"
            sx={{ width: 170 }}
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Row>

        <Box
          key={selectedKey ?? 'none'}
          sx={{
            '@keyframes rowIn': { from: { opacity: 0, transform: 'translateY(3px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
            animation: selected ? 'rowIn 200ms cubic-bezier(0.2,0.6,0.2,1)' : 'none',
          }}
        >
          <PerkPreview card={selected} />
        </Box>
      </Stack>

      {/* Actions */}
      <Row justify="end" gap="10px" sx={{ p: '16px 22px 20px', flex: 'none' }}>
        <Button variant="subtle" onClick={onClose} disabled={submitting}>
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
      </Row>
    </AppDialog>
  )
}
