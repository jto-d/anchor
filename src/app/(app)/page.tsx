'use client'

import { useRouter } from 'next/navigation'
import { Topbar } from '@/components/layout/Topbar'
import { PerksDashboard } from '@/components/perks/PerksDashboard'
import { useMe } from './me-context'

export default function PerksPage() {
  const router = useRouter()
  const { cards, openLogDialog } = useMe()

  return (
    <>
      <Topbar title="Dashboard" subtitle="Track every perk before it expires." />
      <PerksDashboard
        cards={cards}
        onOpenCard={(card) => router.push(`/card/${card.id}`)}
        onLog={openLogDialog}
      />
    </>
  )
}
