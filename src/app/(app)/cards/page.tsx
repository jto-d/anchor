'use client'

import { CardsView } from '@/components/cards/CardsView'
import { useMe } from '../me-context'

export default function CardsPage() {
  const { cards, refetch } = useMe()
  return <CardsView cards={cards} onRefetch={refetch} />
}
