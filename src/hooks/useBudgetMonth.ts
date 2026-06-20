'use client'

import { useCallback, useMemo, useRef, useState } from 'react'
import { useQuery, useMutation } from '@urql/next'
import {
  BudgetMonthDocument,
  SetIncomeAmountDocument,
  AddIncomeSourceDocument,
  RemoveIncomeSourceDocument,
  RenameIncomeSourceDocument,
  SetCategoryBudgetDocument,
  SetMonthlySpendDocument,
  SetSavingsMonthlyDocument,
  SetMonthlyContributionDocument,
  SetSurplusAllocationDocument,
  AddBudgetCategoryDocument,
  RenameCategoryDocument,
  RemoveBudgetCategoryDocument,
  AddSavingsAccountDocument,
  RenameSavingsAccountDocument,
  RemoveSavingsAccountDocument,
  AddBudgetGroupDocument,
  RenameBudgetGroupDocument,
  RemoveBudgetGroupDocument,
} from './budget.queries'
import type { GoalData, GroupData, IncomeSource, MonthSel, SavingsData, Totals } from '@/utils/budget'

/**
 * Owns all server interaction for one budget month: the `budgetMonth` query,
 * every mutation, the string→number parsing of the response, derived totals,
 * and a transient toast. Components stay presentational; `BudgetView` wires
 * the returned handlers to them.
 */
export function useBudgetMonth(sel: MonthSel) {
  const [toast, setToast] = useState<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const flash = useCallback((msg: string) => {
    setToast(msg)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setToast(null), 2800)
  }, [])

  const [{ data, fetching }, reexecute] = useQuery({
    query: BudgetMonthDocument,
    variables: { year: sel.y, month: sel.m },
  })

  const refetch = useCallback(() => reexecute({ requestPolicy: 'network-only' }), [reexecute])

  const [, setIncomeAmount] = useMutation(SetIncomeAmountDocument)
  const [, addIncomeSource] = useMutation(AddIncomeSourceDocument)
  const [, removeIncomeSource] = useMutation(RemoveIncomeSourceDocument)
  const [, setCategoryBudget] = useMutation(SetCategoryBudgetDocument)
  const [, setMonthlySpend] = useMutation(SetMonthlySpendDocument)
  const [, setSavingsMonthly] = useMutation(SetSavingsMonthlyDocument)
  const [, setMonthlyContribution] = useMutation(SetMonthlyContributionDocument)
  const [, setSurplusAllocation] = useMutation(SetSurplusAllocationDocument)
  const [, addBudgetCategory] = useMutation(AddBudgetCategoryDocument)
  const [, renameCategoryMut] = useMutation(RenameCategoryDocument)
  const [, removeBudgetCategoryMut] = useMutation(RemoveBudgetCategoryDocument)
  const [, addSavingsAccount] = useMutation(AddSavingsAccountDocument)
  const [, renameSavingsAccountMut] = useMutation(RenameSavingsAccountDocument)
  const [, removeSavingsAccountMut] = useMutation(RemoveSavingsAccountDocument)
  const [, renameIncomeSourceMut] = useMutation(RenameIncomeSourceDocument)
  const [, addBudgetGroupMut] = useMutation(AddBudgetGroupDocument)
  const [, renameBudgetGroupMut] = useMutation(RenameBudgetGroupDocument)
  const [, removeBudgetGroupMut] = useMutation(RemoveBudgetGroupDocument)

  const raw = data?.budgetMonth

  // GraphQL exposes Decimal as String (see CLAUDE.md) — parse to numbers up front.
  const incomeSources: IncomeSource[] = useMemo(() =>
    (raw?.incomeSources ?? []).map((s) => ({ ...s, amount: Number(s.amount) })), [raw])

  const groups: GroupData[] = useMemo(() =>
    (raw?.groups ?? []).map((g) => ({
      ...g,
      categories: g.categories.map((c) => ({
        ...c,
        budget: Number(c.budget),
        monthSpent: Number(c.monthSpent),
      })),
    })), [raw])

  const savings: SavingsData[] = useMemo(() =>
    (raw?.savings ?? []).map((s) => ({
      ...s,
      monthly: Number(s.monthly),
      annualLimit: s.annualLimit != null ? Number(s.annualLimit) : null,
      monthContrib: Number(s.monthContrib),
      ytd: Number(s.ytd),
    })), [raw])

  const goals: GoalData[] = useMemo(() =>
    (raw?.goals ?? []).map((g) => ({
      ...g,
      target: g.target != null ? Number(g.target) : null,
      base: Number(g.base),
      running: Number(g.running),
      monthAllocated: Number(g.monthAllocated),
    })), [raw])

  const totals: Totals = useMemo(() => {
    const income = incomeSources.reduce((s, x) => s + x.amount, 0)
    const catBudget = groups.flatMap((g) => g.categories).reduce((s, c) => s + c.budget, 0)
    const savBudget = savings.reduce((s, x) => s + x.monthly, 0)
    const budgeted = catBudget + savBudget
    const catSpent = groups.flatMap((g) => g.categories).reduce((s, c) => s + c.monthSpent, 0)
    const savContrib = savings.reduce((s, x) => s + x.monthContrib, 0)
    const spentSaved = catSpent + savContrib
    const allocated = goals.reduce((s, g) => s + g.monthAllocated, 0)
    const baseSurplus = income - budgeted
    const surplus = baseSurplus - allocated
    return { income, budgeted, spentSaved, allocated, baseSurplus, surplus, incomeCount: incomeSources.length }
  }, [incomeSources, groups, savings, goals])

  const setBudget = useCallback(async (catId: string, v: number) => {
    await setCategoryBudget({ id: catId, budget: v }); refetch()
  }, [setCategoryBudget, refetch])

  const setSpent = useCallback(async (catId: string, v: number) => {
    await setMonthlySpend({ categoryId: catId, year: sel.y, month: sel.m, amount: v }); refetch()
  }, [setMonthlySpend, sel, refetch])

  const setSavingsMonthlyAmount = useCallback(async (id: string, v: number) => {
    await setSavingsMonthly({ id, monthly: v }); refetch()
  }, [setSavingsMonthly, refetch])

  const contribute = useCallback(async (id: string, v: number) => {
    await setMonthlyContribution({ accountId: id, year: sel.y, month: sel.m, amount: v }); refetch()
  }, [setMonthlyContribution, sel, refetch])

  const setIncome = useCallback(async (id: string, v: number) => {
    await setIncomeAmount({ id, amount: v }); refetch()
  }, [setIncomeAmount, refetch])

  const addIncome = useCallback(async () => {
    await addIncomeSource({ label: 'New income', amount: 0 })
    refetch()
    flash('Income source added — name it and set an amount.')
  }, [addIncomeSource, refetch, flash])

  const removeIncome = useCallback(async (id: string) => {
    await removeIncomeSource({ id }); refetch()
  }, [removeIncomeSource, refetch])

  const addCategory = useCallback(async (groupId: string) => {
    await addBudgetCategory({ groupId, label: 'New category', icon: 'banknote', budget: 0 })
    refetch()
    flash('Category added — name it and set a budget.')
  }, [addBudgetCategory, refetch, flash])

  const renameCategory = useCallback(async (id: string, label: string) => {
    await renameCategoryMut({ id, label }); refetch()
  }, [renameCategoryMut, refetch])

  const removeCategory = useCallback(async (id: string) => {
    await removeBudgetCategoryMut({ id }); refetch()
  }, [removeBudgetCategoryMut, refetch])

  const addSavings = useCallback(async () => {
    await addSavingsAccount({ label: 'New account', accountType: 'Custom', icon: 'banknote', monthly: 0 })
    refetch()
    flash('Savings account added.')
  }, [addSavingsAccount, refetch, flash])

  const renameSavings = useCallback(async (id: string, label: string) => {
    await renameSavingsAccountMut({ id, label }); refetch()
  }, [renameSavingsAccountMut, refetch])

  const removeSavings = useCallback(async (id: string) => {
    await removeSavingsAccountMut({ id }); refetch()
  }, [removeSavingsAccountMut, refetch])

  const renameIncome = useCallback(async (id: string, label: string) => {
    await renameIncomeSourceMut({ id, label }); refetch()
  }, [renameIncomeSourceMut, refetch])

  const addGroup = useCallback(async () => {
    await addBudgetGroupMut({ label: 'New group', icon: 'tag' })
    refetch()
    flash('Group added — name it and add categories.')
  }, [addBudgetGroupMut, refetch, flash])

  const renameGroup = useCallback(async (id: string, label: string) => {
    await renameBudgetGroupMut({ id, label }); refetch()
  }, [renameBudgetGroupMut, refetch])

  const removeGroup = useCallback(async (id: string) => {
    await removeBudgetGroupMut({ id }); refetch()
  }, [removeBudgetGroupMut, refetch])

  const setAllocation = useCallback(async (goalId: string, v: number) => {
    await setSurplusAllocation({ goalId, year: sel.y, month: sel.m, amount: v }); refetch()
  }, [setSurplusAllocation, sel, refetch])

  return {
    fetching,
    hasData: raw != null,
    incomeSources,
    groups,
    savings,
    goals,
    totals,
    toast,
    dismissToast: useCallback(() => setToast(null), []),
    setBudget,
    setSpent,
    setSavingsMonthly: setSavingsMonthlyAmount,
    contribute,
    setIncome,
    addIncome,
    removeIncome,
    addCategory,
    renameCategory,
    removeCategory,
    addSavings,
    renameSavings,
    removeSavings,
    renameIncome,
    setAllocation,
    addGroup,
    renameGroup,
    removeGroup,
  }
}
