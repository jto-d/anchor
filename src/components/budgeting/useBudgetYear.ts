'use client'

import { useMemo } from 'react'
import { useQuery } from '@urql/next'
import { BudgetYearDocument } from './graphql'

export type MonthStatus = 'actual' | 'current' | 'assumed' | 'projected'

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
    const incomeSources = (raw?.incomeSources ?? []).map((s) => ({ ...s, amount: Number(s.amount) }))
    const groups = (raw?.groups ?? []).map((g) => ({
      ...g,
      categories: (g.categories ?? []).map((c) => ({ ...c, budget: Number(c.budget) })),
    }))
    const savings = (raw?.savings ?? []).map((s) => ({
      ...s,
      monthly: Number(s.monthly),
      annualLimit: s.annualLimit != null ? Number(s.annualLimit) : null,
    }))
    const goals = (raw?.goals ?? []).map((g) => ({
      ...g,
      target: g.target != null ? Number(g.target) : null,
      running: Number(g.running),
    }))

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
      const mData = monthlyData.find((d) => d.month === m)
      const status: MonthStatus = diff > 0 ? 'projected' : diff === 0 ? 'current' : (mData?.hasData ? 'actual' : 'assumed')
      const estimated = status === 'assumed' || status === 'projected'

      const catSpent = mData?.hasData
        ? allCats.reduce((s, c) => {
            const spend = mData.categorySpends.find((sp) => sp.categoryId === c.id)
            return s + (spend ? Number(spend.amount) : 0)
          }, 0)
        : catBudgetTotal

      const savContrib = mData?.hasData
        ? savings.reduce((s, sv) => {
            const contrib = mData.savingsContribs.find((sc) => sc.accountId === sv.id)
            return s + (contrib ? Number(contrib.amount) : 0)
          }, 0)
        : savBudgetTotal

      const outflow = catSpent + savContrib
      const allocated = (mData?.surplusAllocations ?? []).reduce((s, a) => s + Number(a.amount), 0)

      return {
        m, status, estimated,
        income: monthlyIncome,
        budgeted: budgetedPerMonth,
        catSpent, savContrib, outflow, allocated,
        surplus: monthlyIncome - outflow,
      }
    })

    const catYear: CatYearData[] = allCats.map((c) => {
      const total = months.reduce((s, mo) => {
        const mData = monthlyData.find((d) => d.month === mo.m)
        if (mData?.hasData) {
          const spend = mData.categorySpends.find((sp) => sp.categoryId === c.id)
          return s + (spend ? Number(spend.amount) : 0)
        }
        return s + c.budget
      }, 0)
      return { id: c.id, label: c.label, icon: c.icon, group: c.group, total }
    }).sort((a, b) => b.total - a.total)

    const savYear: SavingsYearData[] = savings.map((sv) => {
      let total = 0, ytd = 0
      months.forEach((mo) => {
        const mData = monthlyData.find((d) => d.month === mo.m)
        const v = mData?.hasData
          ? Number(mData.savingsContribs.find((sc) => sc.accountId === sv.id)?.amount ?? 0)
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
      income: monthlyIncome * 12,
      monthlyIncome,
      spent: months.reduce((s, mo) => s + mo.catSpent, 0),
      saved: savYear.reduce((s, sv) => s + sv.total, 0),
      surplus: months.reduce((s, mo) => s + mo.surplus, 0),
    }

    const completed = months.filter((mo) => mo.status === 'actual').length
    const projected = months.filter((mo) => mo.status === 'projected').length
    const currentLabel = currentIdx >= 0 && year === currentYear ? currentIdx : null

    return { months, catYear, savYear, goalYear, annual, completed, projected, currentLabel, currentIdx }
  }, [raw, monthlyData, year, currentYear, currentMonth])

  return { fetching, hasData: raw != null, ...derived }
}
