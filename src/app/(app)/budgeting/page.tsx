'use client'

import { useRouter } from 'next/navigation'
import { BudgetingView } from '@/components/budgeting'
import { useMe } from '../me-context'

export default function BudgetingPage() {
  const router = useRouter()
  const { data } = useMe()
  return (
    <BudgetingView
      userEmail={data.me.email}
      onNavigateToSubscriptions={() => router.push('/subscriptions')}
    />
  )
}
