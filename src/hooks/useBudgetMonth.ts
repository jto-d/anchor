'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useQuery, useMutation } from '@urql/next'
import { useToast } from '@/components/ui'
import {
  BudgetMonthDocument,
  SetIncomeAmountDocument,
  AddIncomeSourceDocument,
  RemoveIncomeSourceDocument,
  RenameIncomeSourceDocument,
  SetCategoryBudgetDocument,
  SetCategoryMonthBudgetDocument,
  SetMonthlySpendDocument,
  SetSavingsMonthlyDocument,
  SetMonthlyContributionDocument,
  SetSurplusAllocationDocument,
  AddBudgetCategoryDocument,
  RenameCategoryDocument,
  RemoveBudgetCategoryDocument,
  AddBudgetLineItemDocument,
  SetLineItemBudgetDocument,
  SetLineItemMonthBudgetDocument,
  SetMonthlyLineSpendDocument,
  RenameLineItemDocument,
  RemoveBudgetLineItemDocument,
  AddSavingsAccountDocument,
  RenameSavingsAccountDocument,
  RemoveSavingsAccountDocument,
  AddBudgetGroupDocument,
  RenameBudgetGroupDocument,
  RemoveBudgetGroupDocument,
  AddSavingsGoalDocument,
  RenameSavingsGoalDocument,
  RemoveSavingsGoalDocument,
  SetSavingsGoalTargetDocument,
  SetBudgetStartDocument,
} from './budget.queries'
import type { GoalData, GroupData, IncomeSource, MonthSel, SavingsData, Totals } from '@/utils/budget'

/**
 * Owns all server interaction for one budget month: the `budgetMonth` query,
 * every mutation, the string→number parsing of the response, derived totals,
 * and a transient toast. Components stay presentational; `BudgetView` wires
 * the returned handlers to them.
 *
 * Optimistic updates: local override maps are applied on top of server data
 * so the UI reflects edits instantly. Overrides are cleared on each refetch.
 */
export function useBudgetMonth(sel: MonthSel) {
  const notify = useToast()

  const [{ data, fetching }, reexecute] = useQuery({
    query: BudgetMonthDocument,
    variables: { year: sel.y, month: sel.m },
    requestPolicy: 'cache-and-network',
  })

  // Optimistic override maps — cleared when fresh server data arrives
  const [localBudgets, setLocalBudgets] = useState<Record<string, number>>({})
  const [localSpends, setLocalSpends] = useState<Record<string, number>>({})
  const [localContribs, setLocalContribs] = useState<Record<string, number>>({})
  const [localSavingsMonthly, setLocalSavingsMonthly] = useState<Record<string, number>>({})
  const [localAllocations, setLocalAllocations] = useState<Record<string, number>>({})
  const [localIncome, setLocalIncome] = useState<Record<string, number>>({})

  const prevRaw = useRef(data?.budgetMonth)
  useEffect(() => {
    if (data?.budgetMonth !== prevRaw.current) {
      prevRaw.current = data?.budgetMonth
      setLocalBudgets({})
      setLocalSpends({})
      setLocalContribs({})
      setLocalSavingsMonthly({})
      setLocalAllocations({})
      setLocalIncome({})
    }
  }, [data?.budgetMonth])

  const refetch = useCallback(() => reexecute({ requestPolicy: 'network-only' }), [reexecute])

  const [, setCategoryBudget] = useMutation(SetCategoryBudgetDocument)
  const [, setCategoryMonthBudget] = useMutation(SetCategoryMonthBudgetDocument)
  const [, setIncomeAmount] = useMutation(SetIncomeAmountDocument)
  const [, addIncomeSource] = useMutation(AddIncomeSourceDocument)
  const [, removeIncomeSource] = useMutation(RemoveIncomeSourceDocument)
  const [, setMonthlySpend] = useMutation(SetMonthlySpendDocument)
  const [, setSavingsMonthly] = useMutation(SetSavingsMonthlyDocument)
  const [, setMonthlyContribution] = useMutation(SetMonthlyContributionDocument)
  const [, setSurplusAllocation] = useMutation(SetSurplusAllocationDocument)
  const [, addBudgetCategory] = useMutation(AddBudgetCategoryDocument)
  const [, renameCategoryMut] = useMutation(RenameCategoryDocument)
  const [, removeBudgetCategoryMut] = useMutation(RemoveBudgetCategoryDocument)
  const [, addBudgetLineItem] = useMutation(AddBudgetLineItemDocument)
  const [, setLineItemBudget] = useMutation(SetLineItemBudgetDocument)
  const [, setLineItemMonthBudget] = useMutation(SetLineItemMonthBudgetDocument)
  const [, setMonthlyLineSpend] = useMutation(SetMonthlyLineSpendDocument)
  const [, renameLineItemMut] = useMutation(RenameLineItemDocument)
  const [, removeBudgetLineItemMut] = useMutation(RemoveBudgetLineItemDocument)
  const [, addSavingsAccount] = useMutation(AddSavingsAccountDocument)
  const [, renameSavingsAccountMut] = useMutation(RenameSavingsAccountDocument)
  const [, removeSavingsAccountMut] = useMutation(RemoveSavingsAccountDocument)
  const [, renameIncomeSourceMut] = useMutation(RenameIncomeSourceDocument)
  const [, addBudgetGroupMut] = useMutation(AddBudgetGroupDocument)
  const [, renameBudgetGroupMut] = useMutation(RenameBudgetGroupDocument)
  const [, removeBudgetGroupMut] = useMutation(RemoveBudgetGroupDocument)
  const [, addSavingsGoalMut] = useMutation(AddSavingsGoalDocument)
  const [, renameSavingsGoalMut] = useMutation(RenameSavingsGoalDocument)
  const [, removeSavingsGoalMut] = useMutation(RemoveSavingsGoalDocument)
  const [, setGoalTargetMut] = useMutation(SetSavingsGoalTargetDocument)
  const [, setBudgetStartMut] = useMutation(SetBudgetStartDocument)

  const raw = data?.budgetMonth

  // Money arrives as numbers (GraphQL exposes Decimal as Float — see CLAUDE.md);
  // these maps only layer optimistic local overrides on top of the server values.
  const incomeSources: IncomeSource[] = useMemo(() =>
    (raw?.incomeSources ?? []).map((s) => ({
      ...s,
      amount: localIncome[s.id] ?? s.amount,
    })), [raw, localIncome])

  const groups: GroupData[] = useMemo(() =>
    (raw?.groups ?? []).map((g) => ({
      ...g,
      categories: g.categories.map((c) => ({
        ...c,
        budget: localBudgets[c.id] ?? c.budget,
        monthSpent: localSpends[c.id] ?? c.monthSpent,
        lineItems: c.lineItems.map((l) => ({
          ...l,
          budget: localBudgets[l.id] ?? l.budget,
          monthSpent: localSpends[l.id] ?? l.monthSpent,
        })),
      })),
    })), [raw, localBudgets, localSpends])

  const savings: SavingsData[] = useMemo(() =>
    (raw?.savings ?? []).map((s) => ({
      ...s,
      monthly: localSavingsMonthly[s.id] ?? s.monthly,
      monthContrib: localContribs[s.id] ?? s.monthContrib,
    })), [raw, localSavingsMonthly, localContribs])

  const goals: GoalData[] = useMemo(() =>
    (raw?.goals ?? []).map((g) => ({
      ...g,
      monthAllocated: localAllocations[g.id] ?? g.monthAllocated,
    })), [raw, localAllocations])

  const subscriptionsMonthly = raw?.subscriptionsMonthly ?? 0

  const totals: Totals = useMemo(() => {
    const income = incomeSources.reduce((s, x) => s + x.amount, 0)
    const catBudget = groups.flatMap((g) => g.categories).reduce((s, c) => s + c.budget, 0)
    const savBudget = savings.reduce((s, x) => s + x.monthly, 0)
    const budgeted = catBudget + savBudget + subscriptionsMonthly
    const catSpent = groups.flatMap((g) => g.categories).reduce((s, c) => s + c.monthSpent, 0)
    const savContrib = savings.reduce((s, x) => s + x.monthContrib, 0)
    const spentSaved = catSpent + savContrib + subscriptionsMonthly
    const allocated = goals.reduce((s, g) => s + g.monthAllocated, 0)
    const baseSurplus = income - budgeted
    const surplus = baseSurplus - allocated
    return { income, budgeted, spentSaved, allocated, baseSurplus, surplus, incomeCount: incomeSources.length }
  }, [incomeSources, groups, savings, goals, subscriptionsMonthly])

  const setBudget = useCallback(async (catId: string, v: number) => {
    setLocalBudgets((p) => ({ ...p, [catId]: v }))
    await Promise.all([
      setCategoryMonthBudget({ id: catId, year: sel.y, month: sel.m, budget: v }),
      setCategoryBudget({ id: catId, budget: v }),
    ])
    refetch()
  }, [setCategoryMonthBudget, setCategoryBudget, sel, refetch])

  const setSpent = useCallback(async (catId: string, v: number) => {
    setLocalSpends((p) => ({ ...p, [catId]: v }))
    await setMonthlySpend({ categoryId: catId, year: sel.y, month: sel.m, amount: v })
    refetch()
  }, [setMonthlySpend, sel, refetch])

  const setSavingsMonthlyAmount = useCallback(async (id: string, v: number) => {
    setLocalSavingsMonthly((p) => ({ ...p, [id]: v }))
    await setSavingsMonthly({ id, monthly: v })
    refetch()
  }, [setSavingsMonthly, refetch])

  const contribute = useCallback(async (id: string, v: number) => {
    setLocalContribs((p) => ({ ...p, [id]: v }))
    await setMonthlyContribution({ accountId: id, year: sel.y, month: sel.m, amount: v })
    refetch()
  }, [setMonthlyContribution, sel, refetch])

  const setIncome = useCallback(async (id: string, v: number) => {
    setLocalIncome((p) => ({ ...p, [id]: v }))
    await setIncomeAmount({ id, amount: v })
    refetch()
  }, [setIncomeAmount, refetch])

  const addIncome = useCallback(async () => {
    await addIncomeSource({ label: 'New income', amount: 0 })
    refetch()
    notify('Income source added — name it and set an amount.')
  }, [addIncomeSource, refetch, notify])

  const removeIncome = useCallback(async (id: string) => {
    await removeIncomeSource({ id }); refetch()
  }, [removeIncomeSource, refetch])

  const addCategory = useCallback(async (groupId: string) => {
    await addBudgetCategory({ groupId, label: 'New category', icon: 'banknote', budget: 0 })
    refetch()
    notify('Category added — name it and set a budget.')
  }, [addBudgetCategory, refetch, notify])

  const renameCategory = useCallback(async (id: string, label: string) => {
    await renameCategoryMut({ id, label }); refetch()
  }, [renameCategoryMut, refetch])

  const removeCategory = useCallback(async (id: string) => {
    await removeBudgetCategoryMut({ id }); refetch()
  }, [removeBudgetCategoryMut, refetch])

  const addLineItem = useCallback(async (categoryId: string) => {
    await addBudgetLineItem({ categoryId, year: sel.y, month: sel.m, label: 'New line', icon: 'banknote' })
    refetch()
    notify('Line item added — name it and set a budget.')
  }, [addBudgetLineItem, sel, refetch, notify])

  // Keeps the parent category's optimistic total in sync with its lines, mirroring how
  // group totals already recompute reactively from their (possibly overridden) categories.
  const setLineBudget = useCallback(async (lineId: string, categoryId: string, v: number) => {
    setLocalBudgets((p) => {
      const next = { ...p, [lineId]: v }
      const cat = groups.flatMap((g) => g.categories).find((c) => c.id === categoryId)
      if (cat) next[categoryId] = cat.lineItems.reduce((s, l) => s + (l.id === lineId ? v : next[l.id] ?? l.budget), 0)
      return next
    })
    await Promise.all([
      setLineItemMonthBudget({ id: lineId, year: sel.y, month: sel.m, budget: v }),
      setLineItemBudget({ id: lineId, budget: v }),
    ])
    refetch()
  }, [groups, setLineItemMonthBudget, setLineItemBudget, sel, refetch])

  const setLineSpent = useCallback(async (lineId: string, categoryId: string, v: number) => {
    setLocalSpends((p) => {
      const next = { ...p, [lineId]: v }
      const cat = groups.flatMap((g) => g.categories).find((c) => c.id === categoryId)
      if (cat) next[categoryId] = cat.lineItems.reduce((s, l) => s + (l.id === lineId ? v : next[l.id] ?? l.monthSpent), 0)
      return next
    })
    await setMonthlyLineSpend({ lineItemId: lineId, year: sel.y, month: sel.m, amount: v })
    refetch()
  }, [groups, setMonthlyLineSpend, sel, refetch])

  const renameLineItem = useCallback(async (id: string, label: string) => {
    await renameLineItemMut({ id, label }); refetch()
  }, [renameLineItemMut, refetch])

  const removeLineItem = useCallback(async (id: string) => {
    await removeBudgetLineItemMut({ id, year: sel.y, month: sel.m }); refetch()
  }, [removeBudgetLineItemMut, sel, refetch])

  const addSavings = useCallback(async () => {
    await addSavingsAccount({ label: 'New account', accountType: 'Custom', icon: 'banknote', monthly: 0 })
    refetch()
    notify('Savings account added.')
  }, [addSavingsAccount, refetch, notify])

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
    notify('Group added — name it and add categories.')
  }, [addBudgetGroupMut, refetch, notify])

  const renameGroup = useCallback(async (id: string, label: string) => {
    await renameBudgetGroupMut({ id, label }); refetch()
  }, [renameBudgetGroupMut, refetch])

  const removeGroup = useCallback(async (id: string) => {
    await removeBudgetGroupMut({ id }); refetch()
  }, [removeBudgetGroupMut, refetch])

  const setAllocation = useCallback(async (goalId: string, v: number) => {
    setLocalAllocations((p) => ({ ...p, [goalId]: v }))
    await setSurplusAllocation({ goalId, year: sel.y, month: sel.m, amount: v })
    refetch()
  }, [setSurplusAllocation, sel, refetch])

  const addGoal = useCallback(async () => {
    await addSavingsGoalMut({ name: 'New goal', icon: 'star' })
    refetch()
    notify('Goal added — name it and set a target.')
  }, [addSavingsGoalMut, refetch, notify])

  const renameGoal = useCallback(async (id: string, name: string) => {
    await renameSavingsGoalMut({ id, name }); refetch()
  }, [renameSavingsGoalMut, refetch])

  const removeGoal = useCallback(async (id: string) => {
    await removeSavingsGoalMut({ id }); refetch()
  }, [removeSavingsGoalMut, refetch])

  const setGoalTarget = useCallback(async (id: string, target: number) => {
    await setGoalTargetMut({ id, target: target > 0 ? target : null })
    refetch()
  }, [setGoalTargetMut, refetch])

  const setBudgetStart = useCallback(async (year: number, month: number) => {
    await setBudgetStartMut({ year, month }); refetch()
  }, [setBudgetStartMut, refetch])

  return {
    fetching,
    hasData: raw != null,
    incomeSources,
    groups,
    savings,
    goals,
    totals,
    subscriptionsMonthly,
    budgetStartYear: raw?.budgetStartYear ?? null,
    budgetStartMonth: raw?.budgetStartMonth ?? null,
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
    addLineItem,
    setLineBudget,
    setLineSpent,
    renameLineItem,
    removeLineItem,
    addSavings,
    renameSavings,
    removeSavings,
    renameIncome,
    setAllocation,
    addGroup,
    renameGroup,
    removeGroup,
    addGoal,
    renameGoal,
    removeGoal,
    setGoalTarget,
    setBudgetStart,
  }
}
