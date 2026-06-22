import { builder } from '../builder'

// ---- Year query shapes ---------------------------------------------------

export const MonthlySpendItemPayload = builder.objectRef<{
  categoryId: string
  amount: string
}>('MonthlySpendItemPayload')

builder.objectType(MonthlySpendItemPayload, {
  fields: (t) => ({
    categoryId: t.string({ resolve: (x) => x.categoryId }),
    amount: t.string({ resolve: (x) => x.amount }),
  }),
})

export const MonthlyContribItemPayload = builder.objectRef<{
  accountId: string
  amount: string
}>('MonthlyContribItemPayload')

builder.objectType(MonthlyContribItemPayload, {
  fields: (t) => ({
    accountId: t.string({ resolve: (x) => x.accountId }),
    amount: t.string({ resolve: (x) => x.amount }),
  }),
})

export const SurplusAllocItemPayload = builder.objectRef<{
  goalId: string
  amount: string
}>('SurplusAllocItemPayload')

builder.objectType(SurplusAllocItemPayload, {
  fields: (t) => ({
    goalId: t.string({ resolve: (x) => x.goalId }),
    amount: t.string({ resolve: (x) => x.amount }),
  }),
})

export const BudgetMonthDataPayload = builder.objectRef<{
  month: number
  hasData: boolean
  categorySpends: { categoryId: string; amount: string }[]
  savingsContribs: { accountId: string; amount: string }[]
  surplusAllocations: { goalId: string; amount: string }[]
}>('BudgetMonthDataPayload')

builder.objectType(BudgetMonthDataPayload, {
  fields: (t) => ({
    month: t.int({ resolve: (x) => x.month }),
    hasData: t.boolean({ resolve: (x) => x.hasData }),
    categorySpends: t.field({ type: [MonthlySpendItemPayload], resolve: (x) => x.categorySpends }),
    savingsContribs: t.field({ type: [MonthlyContribItemPayload], resolve: (x) => x.savingsContribs }),
    surplusAllocations: t.field({ type: [SurplusAllocItemPayload], resolve: (x) => x.surplusAllocations }),
  }),
})

export const BudgetYearPayload = builder.objectRef<{
  incomeSources: { id: string; label: string; sub: string | null; amount: string; position: number }[]
  groups: {
    id: string; label: string; icon: string; position: number;
    categories: { id: string; label: string; icon: string; budget: string; position: number; monthSpent: string }[]
  }[]
  savings: {
    id: string; label: string; accountType: string; icon: string; monthly: string;
    annualLimit: string | null; position: number; monthContrib: string; ytd: string;
  }[]
  goals: {
    id: string; name: string; icon: string; target: string | null; base: string;
    targetYear: number | null; targetMonth: number | null; running: string; monthAllocated: string;
  }[]
  monthlyData: {
    month: number; hasData: boolean;
    categorySpends: { categoryId: string; amount: string }[];
    savingsContribs: { accountId: string; amount: string }[];
    surplusAllocations: { goalId: string; amount: string }[];
  }[]
}>('BudgetYearPayload')

builder.objectType(BudgetYearPayload, {
  fields: (t) => ({
    incomeSources: t.field({ type: [IncomeSourcePayload], resolve: (p) => p.incomeSources }),
    groups: t.field({ type: [BudgetGroupPayload], resolve: (p) => p.groups }),
    savings: t.field({ type: [SavingsAccountPayload], resolve: (p) => p.savings }),
    goals: t.field({ type: [SavingsGoalPayload], resolve: (p) => p.goals }),
    monthlyData: t.field({ type: [BudgetMonthDataPayload], resolve: (p) => p.monthlyData }),
  }),
})

// ---- Month query shapes --------------------------------------------------

export const BudgetCategoryPayload = builder.objectRef<{
  id: string
  label: string
  icon: string
  budget: string
  position: number
  monthSpent: string
}>('BudgetCategoryPayload')

builder.objectType(BudgetCategoryPayload, {
  fields: (t) => ({
    id: t.string({ resolve: (c) => c.id }),
    label: t.string({ resolve: (c) => c.label }),
    icon: t.string({ resolve: (c) => c.icon }),
    budget: t.string({ resolve: (c) => c.budget }),
    position: t.int({ resolve: (c) => c.position }),
    monthSpent: t.string({ resolve: (c) => c.monthSpent }),
  }),
})

export const BudgetGroupPayload = builder.objectRef<{
  id: string
  label: string
  icon: string
  position: number
  categories: {
    id: string
    label: string
    icon: string
    budget: string
    position: number
    monthSpent: string
  }[]
}>('BudgetGroupPayload')

builder.objectType(BudgetGroupPayload, {
  fields: (t) => ({
    id: t.string({ resolve: (g) => g.id }),
    label: t.string({ resolve: (g) => g.label }),
    icon: t.string({ resolve: (g) => g.icon }),
    position: t.int({ resolve: (g) => g.position }),
    categories: t.field({ type: [BudgetCategoryPayload], resolve: (g) => g.categories }),
  }),
})

export const IncomeSourcePayload = builder.objectRef<{
  id: string
  label: string
  sub: string | null
  amount: string
  position: number
}>('IncomeSourcePayload')

builder.objectType(IncomeSourcePayload, {
  fields: (t) => ({
    id: t.string({ resolve: (s) => s.id }),
    label: t.string({ resolve: (s) => s.label }),
    sub: t.string({ nullable: true, resolve: (s) => s.sub }),
    amount: t.string({ resolve: (s) => s.amount }),
    position: t.int({ resolve: (s) => s.position }),
  }),
})

export const SavingsAccountPayload = builder.objectRef<{
  id: string
  label: string
  accountType: string
  icon: string
  monthly: string
  annualLimit: string | null
  position: number
  monthContrib: string
  ytd: string
}>('SavingsAccountPayload')

builder.objectType(SavingsAccountPayload, {
  fields: (t) => ({
    id: t.string({ resolve: (s) => s.id }),
    label: t.string({ resolve: (s) => s.label }),
    accountType: t.string({ resolve: (s) => s.accountType }),
    icon: t.string({ resolve: (s) => s.icon }),
    monthly: t.string({ resolve: (s) => s.monthly }),
    annualLimit: t.string({ nullable: true, resolve: (s) => s.annualLimit }),
    position: t.int({ resolve: (s) => s.position }),
    monthContrib: t.string({ resolve: (s) => s.monthContrib }),
    ytd: t.string({ resolve: (s) => s.ytd }),
  }),
})

export const SavingsGoalPayload = builder.objectRef<{
  id: string
  name: string
  icon: string
  target: string | null
  base: string
  targetYear: number | null
  targetMonth: number | null
  running: string
  monthAllocated: string
}>('SavingsGoalPayload')

builder.objectType(SavingsGoalPayload, {
  fields: (t) => ({
    id: t.string({ resolve: (g) => g.id }),
    name: t.string({ resolve: (g) => g.name }),
    icon: t.string({ resolve: (g) => g.icon }),
    target: t.string({ nullable: true, resolve: (g) => g.target }),
    base: t.string({ resolve: (g) => g.base }),
    targetYear: t.int({ nullable: true, resolve: (g) => g.targetYear }),
    targetMonth: t.int({ nullable: true, resolve: (g) => g.targetMonth }),
    running: t.string({ resolve: (g) => g.running }),
    monthAllocated: t.string({ resolve: (g) => g.monthAllocated }),
  }),
})

export const BudgetMonthPayload = builder.objectRef<{
  incomeSources: { id: string; label: string; sub: string | null; amount: string; position: number }[]
  groups: {
    id: string
    label: string
    icon: string
    position: number
    categories: { id: string; label: string; icon: string; budget: string; position: number; monthSpent: string }[]
  }[]
  savings: {
    id: string
    label: string
    accountType: string
    icon: string
    monthly: string
    annualLimit: string | null
    position: number
    monthContrib: string
    ytd: string
  }[]
  goals: {
    id: string
    name: string
    icon: string
    target: string | null
    base: string
    targetYear: number | null
    targetMonth: number | null
    running: string
    monthAllocated: string
  }[]
  budgetStartYear: number | null
  budgetStartMonth: number | null
}>('BudgetMonthPayload')

builder.objectType(BudgetMonthPayload, {
  fields: (t) => ({
    incomeSources: t.field({ type: [IncomeSourcePayload], resolve: (p) => p.incomeSources }),
    groups: t.field({ type: [BudgetGroupPayload], resolve: (p) => p.groups }),
    savings: t.field({ type: [SavingsAccountPayload], resolve: (p) => p.savings }),
    goals: t.field({ type: [SavingsGoalPayload], resolve: (p) => p.goals }),
    budgetStartYear: t.int({ nullable: true, resolve: (p) => p.budgetStartYear }),
    budgetStartMonth: t.int({ nullable: true, resolve: (p) => p.budgetStartMonth }),
  }),
})
