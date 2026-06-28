import { builder } from '../builder'

// ---- Year query shapes ---------------------------------------------------

export const MonthlySpendItemPayload = builder.objectRef<{
  categoryId: string
  amount: number
}>('MonthlySpendItemPayload')

builder.objectType(MonthlySpendItemPayload, {
  fields: (t) => ({
    categoryId: t.string({ resolve: (x) => x.categoryId }),
    amount: t.float({ resolve: (x) => x.amount }),
  }),
})

export const MonthlyContribItemPayload = builder.objectRef<{
  accountId: string
  amount: number
}>('MonthlyContribItemPayload')

builder.objectType(MonthlyContribItemPayload, {
  fields: (t) => ({
    accountId: t.string({ resolve: (x) => x.accountId }),
    amount: t.float({ resolve: (x) => x.amount }),
  }),
})

export const SurplusAllocItemPayload = builder.objectRef<{
  goalId: string
  amount: number
}>('SurplusAllocItemPayload')

builder.objectType(SurplusAllocItemPayload, {
  fields: (t) => ({
    goalId: t.string({ resolve: (x) => x.goalId }),
    amount: t.float({ resolve: (x) => x.amount }),
  }),
})

export const BudgetMonthDataPayload = builder.objectRef<{
  month: number
  hasData: boolean
  categorySpends: { categoryId: string; amount: number }[]
  savingsContribs: { accountId: string; amount: number }[]
  surplusAllocations: { goalId: string; amount: number }[]
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
  incomeSources: { id: string; label: string; sub: string | null; amount: number; position: number }[]
  groups: {
    id: string; label: string; icon: string; position: number;
    categories: { id: string; label: string; icon: string; budget: number; position: number; monthSpent: number }[]
  }[]
  savings: {
    id: string; label: string; accountType: string; icon: string; monthly: number;
    annualLimit: number | null; position: number; monthContrib: number; ytd: number;
  }[]
  goals: {
    id: string; name: string; icon: string; target: number | null; base: number;
    targetYear: number | null; targetMonth: number | null; running: number; monthAllocated: number;
  }[]
  monthlyData: {
    month: number; hasData: boolean;
    categorySpends: { categoryId: string; amount: number }[];
    savingsContribs: { accountId: string; amount: number }[];
    surplusAllocations: { goalId: string; amount: number }[];
  }[]
  budgetStartYear: number | null
  budgetStartMonth: number | null
}>('BudgetYearPayload')

builder.objectType(BudgetYearPayload, {
  fields: (t) => ({
    incomeSources: t.field({ type: [IncomeSourcePayload], resolve: (p) => p.incomeSources }),
    groups: t.field({ type: [BudgetGroupPayload], resolve: (p) => p.groups }),
    savings: t.field({ type: [SavingsAccountPayload], resolve: (p) => p.savings }),
    goals: t.field({ type: [SavingsGoalPayload], resolve: (p) => p.goals }),
    monthlyData: t.field({ type: [BudgetMonthDataPayload], resolve: (p) => p.monthlyData }),
    budgetStartYear: t.int({ nullable: true, resolve: (p) => p.budgetStartYear }),
    budgetStartMonth: t.int({ nullable: true, resolve: (p) => p.budgetStartMonth }),
  }),
})

// ---- Month query shapes --------------------------------------------------

export const BudgetCategoryPayload = builder.objectRef<{
  id: string
  label: string
  icon: string
  budget: number
  position: number
  monthSpent: number
}>('BudgetCategoryPayload')

builder.objectType(BudgetCategoryPayload, {
  fields: (t) => ({
    id: t.string({ resolve: (c) => c.id }),
    label: t.string({ resolve: (c) => c.label }),
    icon: t.string({ resolve: (c) => c.icon }),
    budget: t.float({ resolve: (c) => c.budget }),
    position: t.int({ resolve: (c) => c.position }),
    monthSpent: t.float({ resolve: (c) => c.monthSpent }),
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
    budget: number
    position: number
    monthSpent: number
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
  amount: number
  position: number
}>('IncomeSourcePayload')

builder.objectType(IncomeSourcePayload, {
  fields: (t) => ({
    id: t.string({ resolve: (s) => s.id }),
    label: t.string({ resolve: (s) => s.label }),
    sub: t.string({ nullable: true, resolve: (s) => s.sub }),
    amount: t.float({ resolve: (s) => s.amount }),
    position: t.int({ resolve: (s) => s.position }),
  }),
})

export const SavingsAccountPayload = builder.objectRef<{
  id: string
  label: string
  accountType: string
  icon: string
  monthly: number
  annualLimit: number | null
  position: number
  monthContrib: number
  ytd: number
}>('SavingsAccountPayload')

builder.objectType(SavingsAccountPayload, {
  fields: (t) => ({
    id: t.string({ resolve: (s) => s.id }),
    label: t.string({ resolve: (s) => s.label }),
    accountType: t.string({ resolve: (s) => s.accountType }),
    icon: t.string({ resolve: (s) => s.icon }),
    monthly: t.float({ resolve: (s) => s.monthly }),
    annualLimit: t.float({ nullable: true, resolve: (s) => s.annualLimit }),
    position: t.int({ resolve: (s) => s.position }),
    monthContrib: t.float({ resolve: (s) => s.monthContrib }),
    ytd: t.float({ resolve: (s) => s.ytd }),
  }),
})

export const SavingsGoalPayload = builder.objectRef<{
  id: string
  name: string
  icon: string
  target: number | null
  base: number
  targetYear: number | null
  targetMonth: number | null
  running: number
  monthAllocated: number
}>('SavingsGoalPayload')

builder.objectType(SavingsGoalPayload, {
  fields: (t) => ({
    id: t.string({ resolve: (g) => g.id }),
    name: t.string({ resolve: (g) => g.name }),
    icon: t.string({ resolve: (g) => g.icon }),
    target: t.float({ nullable: true, resolve: (g) => g.target }),
    base: t.float({ resolve: (g) => g.base }),
    targetYear: t.int({ nullable: true, resolve: (g) => g.targetYear }),
    targetMonth: t.int({ nullable: true, resolve: (g) => g.targetMonth }),
    running: t.float({ resolve: (g) => g.running }),
    monthAllocated: t.float({ resolve: (g) => g.monthAllocated }),
  }),
})

export const BudgetMonthPayload = builder.objectRef<{
  incomeSources: { id: string; label: string; sub: string | null; amount: number; position: number }[]
  groups: {
    id: string
    label: string
    icon: string
    position: number
    categories: { id: string; label: string; icon: string; budget: number; position: number; monthSpent: number }[]
  }[]
  savings: {
    id: string
    label: string
    accountType: string
    icon: string
    monthly: number
    annualLimit: number | null
    position: number
    monthContrib: number
    ytd: number
  }[]
  goals: {
    id: string
    name: string
    icon: string
    target: number | null
    base: number
    targetYear: number | null
    targetMonth: number | null
    running: number
    monthAllocated: number
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
