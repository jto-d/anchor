'use client'

import { SubscriptionsView } from '@/components/subscriptions'
import { issuerShort } from '@/utils/issuer'
import type { SubCard } from '@/data/subscriptionData'
import { useMe } from '../me-context'

export default function SubscriptionsPage() {
  const { cards } = useMe()

  const subCards: SubCard[] = cards.map((c) => ({
    id: c.id,
    name: c.name,
    issuer: c.issuer,
    short: issuerShort(c.issuer),
    lastFour: c.lastFour ?? '',
  }))

  return <SubscriptionsView cards={subCards} />
}
