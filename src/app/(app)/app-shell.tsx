'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@urql/next'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import { Sidebar } from '@/components/layout/Sidebar'
import { Row, Stack, useToast } from '@/components/ui'
import { LogCreditDialog } from '@/components/perks/LogCreditDialog'
import { MeProvider } from './me-context'
import { MeDocument, LogPerkCreditDocument } from '@/app/me-view.queries'
import type { Card, Perk } from '@/utils/types'

/**
 * The persistent app chrome. Mounts once and stays mounted across route
 * changes, so the single Me query runs once and is shared with every page
 * via context. The log-credit dialog lives here because it's opened from
 * more than one route (the dashboard and card detail).
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const [dialogPerk, setDialogPerk] = useState<Perk | null>(null)
  const notify = useToast()

  const [{ data, fetching, error }, reexecuteQuery] = useQuery({ query: MeDocument })
  const [, logPerkCredit] = useMutation(LogPerkCreditDocument)

  const cards: Card[] = (data?.me.creditCards ?? []) as Card[]

  // Re-read the dialog's perk from live data so it reflects freshly logged credits.
  const livePerk: Perk | null = dialogPerk
    ? ((cards.flatMap((c) => c.perks).find((p) => p.id === dialogPerk.id) ?? dialogPerk) as Perk)
    : null

  function refetch() {
    reexecuteQuery({ requestPolicy: 'network-only' })
  }

  async function handleSaveCredit(perkId: string, amount: number, date: string, description: string) {
    const perkName = livePerk?.name ?? 'perk'
    await logPerkCredit({ perkId, amount, date, description: description || undefined })
    refetch()
    setDialogPerk(null)
    notify(`Logged $${amount.toFixed(2)} to ${perkName}`)
  }

  if (fetching) {
    return (
      <Row justify="center" sx={{ height: '100vh' }}>
        <CircularProgress />
      </Row>
    )
  }

  if (error) {
    return (
      <Row justify="center" sx={{ height: '100vh', p: 3 }}>
        <Alert severity="error" variant="outlined">
          {error.message}
        </Alert>
      </Row>
    )
  }

  if (!data) return null

  return (
    <MeProvider value={{ data, cards, refetch, openLogDialog: setDialogPerk }}>
      <Row align="stretch" sx={{ height: '100vh', bgcolor: 'background.default', color: 'text.primary' }}>
        <Sidebar userEmail={data.me.email} />
        <Stack component="main" sx={{ flex: 1, overflow: 'auto' }}>
          {children}
        </Stack>
      </Row>
      <LogCreditDialog perk={livePerk} onClose={() => setDialogPerk(null)} onSave={handleSaveCredit} />
    </MeProvider>
  )
}
