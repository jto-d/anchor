'use client'

import { useMemo } from 'react'
import { useQuery } from '@urql/next'
import { BudgetYearDocument } from './budget.queries'

export type MonthStatus = 'actual' | 'current' | 'assumed' | 'projected' | 'no-history'

export interface YearMonth {
  m: number
  status: MonthStatus
  estimated: boolean
  income: number
  budgeted: number
  catSpent: number
  savContrib: number
  outflow: number
  allocated: number
  surplus: number
}

export interface CatYearData {
  id: string
  label: string
  icon: string
  group: string
  total: number
}

export interface SavingsYearData {
  id: string
  label: string
  accountType: string
  icon: string
  monthly: number
  annualLimit: number | null
  total: number
  ytd: number
}

export interface GoalYearData {
  id: string
  name: string
  icon: string
  target: number | null
  current: number
  targetYear: number | null
  targetMonth: number | null
}

export interface YearAnnual {
  income: number
  monthlyIncome: number
  spent: number
  saved: number
  surplus: number
}

export function useBudgetYear(year: number) {
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth()

  const [{ data, fetching }] = useQuery({
    query: BudgetYearDocument,
    variables: { year },
  })

  const raw = data?.budgetYear
  const monthlyData = raw?.monthlyData ?? []

  const derived = useMemo(() => {
    // Money arrives as numbers (GraphQL exposes Decimal as Float — see CLAUDE.md).
    const incomeSources = raw?.incomeSources ?? []
    const groups = raw?.groups ?? []
    const savings = raw?.savings ?? []
    const goals = raw?.goals ?? []
    const budgetStartYear = raw?.budgetStartYear ?? null
    const budgetStartMonth = raw?.budgetStartMonth ?? null

    const allCats = groups.flatMap((g) => g.categories.map((c) => ({ ...c, group: g.label })))
    const monthlyIncome = incomeSources.reduce((s, x) => s + x.amount, 0)
    const catBudgetTotal = allCats.reduce((s, c) => s + c.budget, 0)
    const savBudgetTotal = savings.reduce((s, x) => s + x.monthly, 0)
    const budgetedPerMonth = catBudgetTotal + savBudgetTotal

    const currentIdx = year < currentYear ? 11 : year > currentYear ? -1 : currentMonth

    const months: YearMonth[] = Array.from({ length: 12 }, (_, m) => {
      const nowOrd = currentYear * 12 + currentMonth
      const mOrd = year * 12 + m
      const diff = mOrd - nowOrd

      const isBeforeHistory = budgetStartYear != null && (
        year < budgetStartYear ||
        (year === budgetStartYear && budgetStartMonth != null && m < budgetStartMonth)
      )

      if (isBeforeHistory) {
        return {
          m, status: 'no-history' as const, estimated: false,
          income: 0, budgeted: 0, catSpent: 0, savContrib: 0,
          outflow: 0, allocated: 0, surplus: 0,
        }
      }

      const mData = monthlyData.find((d) => d.month === m)
      const status: MonthStatus = diff > 0 ? 'projected' : diff === 0 ? 'current' : (mData?.hasData ? 'actual' : 'assumed')
      const estimated = status === 'assumed' || status === 'projected'

      const catSpent = mData?.hasData
        ? allCats.reduce((s, c) => {
            const spend = mData.categorySpends.find((sp) => sp.categoryId === c.id)
            return s + (spend ? spend.amount : 0)
          }, 0)
        : catBudgetTotal

      const savContrib = mData?.hasData
        ? savings.reduce((s, sv) => {
            const contrib = mData.savingsContribs.find((sc) => sc.accountId === sv.id)
            return s + (contrib ? contrib.amount : 0)
          }, 0)
        : savBudgetTotal

      const outflow = catSpent + savContrib
      const allocated = (mData?.surplusAllocations ?? []).reduce((s, a) => s + a.amount, 0)

      return {
        m, status, estimated,
        income: monthlyIncome,
        budgeted: budgetedPerMonth,
        catSpent, savContrib, outflow, allocated,
        surplus: monthlyIncome - outflow,
      }
    })

    const activeMonths = months.filter((mo) => mo.status !== 'no-history')

    const catYear: CatYearData[] = allCats.map((c) => {
      const total = activeMonths.reduce((s, mo) => {
        const mData = monthlyData.find((d) => d.month === mo.m)
        if (mData?.hasData) {
          const spend = mData.categorySpends.find((sp) => sp.categoryId === c.id)
          return s + (spend ? spend.amount : 0)
        }
        return s + c.budget
      }, 0)
      return { id: c.id, label: c.label, icon: c.icon, group: c.group, total }
    }).sort((a, b) => b.total - a.total)

    const savYear: SavingsYearData[] = savings.map((sv) => {
      let total = 0, ytd = 0
      activeMonths.forEach((mo) => {
        const mData = monthlyData.find((d) => d.month === mo.m)
        const v = mData?.hasData
          ? (mData.savingsContribs.find((sc) => sc.accountId === sv.id)?.amount ?? 0)
          : sv.monthly
        total += v
        if (currentIdx >= 0 && mo.m <= currentIdx) ytd += v
      })
      return { id: sv.id, label: sv.label, accountType: sv.accountType, icon: sv.icon, monthly: sv.monthly, annualLimit: sv.annualLimit, total, ytd }
    })

    const goalYear: GoalYearData[] = goals.map((g) => ({
      id: g.id, name: g.name, icon: g.icon, target: g.target,
      current: g.running,
      targetYear: g.targetYear ?? null, targetMonth: g.targetMonth ?? null,
    }))

    const annual: YearAnnual = {
      income: monthlyIncome * activeMonths.length,
      monthlyIncome,
      spent: activeMonths.reduce((s, mo) => s + mo.catSpent, 0),
      saved: savYear.reduce((s, sv) => s + sv.total, 0),
      surplus: activeMonths.reduce((s, mo) => s + mo.surplus, 0),
    }

    const completed = months.filter((mo) => mo.status === 'actual').length
    const projected = months.filter((mo) => mo.status === 'projected').length
    const currentLabel = currentIdx >= 0 && year === currentYear ? currentIdx : null

    // First active month index for the current year (null = full year has history)
    const effectiveStartMonth: number | null =
      budgetStartYear != null && year === budgetStartYear && budgetStartMonth != null && budgetStartMonth > 0
        ? budgetStartMonth
        : null

    return { months, catYear, savYear, goalYear, annual, completed, projected, currentLabel, currentIdx, effectiveStartMonth }
  }, [raw, monthlyData, year, currentYear, currentMonth])

  return {
    fetching,
    hasData: raw != null,
    budgetStartYear: raw?.budgetStartYear ?? null,
    budgetStartMonth: raw?.budgetStartMonth ?? null,
    ...derived,
  }
}
