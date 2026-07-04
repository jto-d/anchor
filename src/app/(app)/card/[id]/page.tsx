'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { Topbar } from '@/components/layout/Topbar'
import { CardDetail } from '@/components/perks/CardDetail'
import { useMe } from '../../me-context'

export default function CardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { cards, openLogDialog } = useMe()

  const card = cards.find((c) => c.id === id)

  if (!card) {
    return (
      <Box sx={{ p: '26px 30px', maxWidth: 980 }}>
        <Button
          onClick={() => router.push('/')}
          startIcon={<ChevronLeftIcon />}
          sx={{ color: 'grey.500', fontSize: 13, fontWeight: 500, mb: 2, px: 0, minWidth: 0 }}
        >
          Back to perks dashboard
        </Button>
        <Typography sx={{ fontSize: 14, color: 'grey.500' }}>
          This card isn&rsquo;t in your wallet.
        </Typography>
      </Box>
    )
  }

  return (
    <>
      <Topbar
        title={card.name}
        subtitle={`${card.issuer}${card.lastFour ? ' · •••• ' + card.lastFour : ''}`}
      />
      <CardDetail card={card} onBack={() => router.push('/')} onLog={openLogDialog} />
    </>
  )
}
