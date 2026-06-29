'use client'

import { useState } from 'react'
import { Topbar } from '@/components/layout/Topbar'
import { Segmented } from '@/components/ui'
import { BudgetView } from './monthly/BudgetView'
import { YearView } from './year/YearView'

export function BudgetingView({ userEmail }: { userEmail: string }) {
  const [budgetView, setBudgetView] = useState<'monthly' | 'yearly'>('monthly')

  return (
    <>
      <Topbar
        title="Budgeting"
        subtitle="Plan the month, log what you spend, send the surplus to a goal."
        rightSlot={
          <Segmented
            size="sm"
            value={budgetView}
            onChange={(v) => setBudgetView(v as 'monthly' | 'yearly')}
            options={[{ value: 'monthly', label: 'Monthly' }, { value: 'yearly', label: 'Yearly' }]}
          />
        }
      />
      {budgetView === 'monthly' ? <BudgetView userEmail={userEmail} /> : <YearView />}
    </>
  )
}
