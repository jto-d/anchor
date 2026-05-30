'use client'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import AddIcon from '@mui/icons-material/Add'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { Eyebrow } from './Primitives'
import { CardTile } from './CardTile'
import { PerkRow } from './PerkRow'
import { cardCaptured, cardAvailable, fmt, type Card, type Perk } from '../helpers'

interface CardDetailProps {
  card: Card
  onBack: () => void
  onLog: (perk: Perk) => void
  onAddPerk: () => void
}

export function CardDetail({ card, onBack, onLog, onAddPerk }: CardDetailProps) {
  const captured = cardCaptured(card)
  const available = cardAvailable(card)

  return (
    <Box sx={{ p: '26px 30px', maxWidth: 980 }}>
      <Button
        onClick={onBack}
        startIcon={<ChevronLeftIcon />}
        sx={{
          color: 'grey.500',
          fontSize: 13,
          fontWeight: 500,
          mb: 2,
          px: 0,
          minWidth: 0,
          '&:hover': { bgcolor: 'transparent', color: 'text.primary' },
        }}
      >
        Back to dashboard
      </Button>

      <Box sx={{ display: 'flex', gap: '26px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <CardTile card={card} />
        <Box sx={{ flex: 1, minWidth: 240 }}>
          <Eyebrow>{card.issuer}</Eyebrow>
          <Typography variant="h4" sx={{ fontSize: 28, mt: 1 }}>
            {card.name}
          </Typography>
          <Typography sx={{ fontSize: 14, color: 'grey.500', mt: '6px' }}>
            <Box component="span" sx={{ fontWeight: 600, color: 'primary.main' }}>
              {fmt(captured)}
            </Box>{' '}
            recovered of {fmt(available)} available · {card.perks.length} perks
          </Typography>
          <Stack direction="row" spacing={1.25} sx={{ mt: 2 }}>
            <Button variant="contained" startIcon={<AddIcon />} onClick={onAddPerk}>
              Add a perk
            </Button>
            <Button
              variant="outlined"
              startIcon={<EditOutlinedIcon />}
              sx={{
                borderColor: 'grey.300',
                color: 'text.primary',
                '&:hover': { borderColor: 'grey.400', bgcolor: 'grey.50' },
              }}
            >
              Edit card
            </Button>
          </Stack>
        </Box>
      </Box>

      <Eyebrow sx={{ mt: '30px', mb: '6px' }}>Perks</Eyebrow>
      <Paper variant="outlined" sx={{ borderColor: 'divider', borderRadius: '14px', px: 2, py: '4px' }}>
        {card.perks.length === 0 ? (
          <Typography sx={{ py: '18px', px: '4px', fontSize: 14, color: 'grey.500' }}>
            No perks on this card yet.
          </Typography>
        ) : (
          card.perks.map((p) => <PerkRow key={p.id} perk={p} onLog={onLog} />)
        )}
      </Paper>
    </Box>
  )
}
