import { builder } from '../builder'

// ---- Year query shapes ---------------------------------------------------

export const MonthlySpendItemPayload = builder.simpleObject('MonthlySpendItemPayload', {
  fields: (t) => ({
    categoryId: t.string(),
    amount: t.float(),
  }),
})

export const MonthlyContribItemPayload = builder.simpleObject('MonthlyContribItemPayload', {
  fields: (t) => ({
    accountId: t.string(),
    amount: t.float(),
  }),
})

export const SurplusAllocItemPayload = builder.simpleObject('SurplusAllocItemPayload', {
  fields: (t) => ({
    goalId: t.string(),
    amount: t.float(),
  }),
})

export const BudgetMonthDataPayload = builder.simpleObject('BudgetMonthDataPayload', {
  fields: (t) => ({
    month: t.int(),
    hasData: t.boolean(),
    categorySpends: t.field({ type: [MonthlySpendItemPayload] }),
    savingsContribs: t.field({ type: [MonthlyContribItemPayload] }),
    surplusAllocations: t.field({ type: [SurplusAllocItemPayload] }),
  }),
})

export const BudgetYearPayload = builder.simpleObject('BudgetYearPayload', {
  fields: (t) => ({
    incomeSources: t.field({ type: [IncomeSourcePayload] }),
    groups: t.field({ type: [BudgetGroupPayload] }),
    savings: t.field({ type: [SavingsAccountPayload] }),
    goals: t.field({ type: [SavingsGoalPayload] }),
    monthlyData: t.field({ type: [BudgetMonthDataPayload] }),
    budgetStartYear: t.int({ nullable: true }),
    budgetStartMonth: t.int({ nullable: true }),
  }),
})

// ---- Month query shapes --------------------------------------------------

export const BudgetLineItemPayload = builder.simpleObject('BudgetLineItemPayload', {
  fields: (t) => ({
    id: t.string(),
    label: t.string(),
    icon: t.string(),
    budget: t.float(),
    position: t.int(),
    monthSpent: t.float(),
  }),
})

export const BudgetCategoryPayload = builder.simpleObject('BudgetCategoryPayload', {
  fields: (t) => ({
    id: t.string(),
    label: t.string(),
    icon: t.string(),
    budget: t.float(),
    position: t.int(),
    monthSpent: t.float(),
    lineItems: t.field({ type: [BudgetLineItemPayload] }),
  }),
})

export const BudgetGroupPayload = builder.simpleObject('BudgetGroupPayload', {
  fields: (t) => ({
    id: t.string(),
    label: t.string(),
    icon: t.string(),
    position: t.int(),
    categories: t.field({ type: [BudgetCategoryPayload] }),
  }),
})

export const IncomeSourcePayload = builder.simpleObject('IncomeSourcePayload', {
  fields: (t) => ({
    id: t.string(),
    label: t.string(),
    sub: t.string({ nullable: true }),
    amount: t.float(),
    position: t.int(),
  }),
})

export const SavingsAccountPayload = builder.simpleObject('SavingsAccountPayload', {
  fields: (t) => ({
    id: t.string(),
    label: t.string(),
    accountType: t.string(),
    icon: t.string(),
    monthly: t.float(),
    annualLimit: t.float({ nullable: true }),
    position: t.int(),
    monthContrib: t.float(),
    ytd: t.float(),
  }),
})

export const SavingsGoalPayload = builder.simpleObject('SavingsGoalPayload', {
  fields: (t) => ({
    id: t.string(),
    name: t.string(),
    icon: t.string(),
    target: t.float({ nullable: true }),
    base: t.float(),
    targetYear: t.int({ nullable: true }),
    targetMonth: t.int({ nullable: true }),
    running: t.float(),
    monthAllocated: t.float(),
  }),
})

export const BudgetMonthPayload = builder.simpleObject('BudgetMonthPayload', {
  fields: (t) => ({
    incomeSources: t.field({ type: [IncomeSourcePayload] }),
    groups: t.field({ type: [BudgetGroupPayload] }),
    savings: t.field({ type: [SavingsAccountPayload] }),
    goals: t.field({ type: [SavingsGoalPayload] }),
    budgetStartYear: t.int({ nullable: true }),
    budgetStartMonth: t.int({ nullable: true }),
    subscriptionsMonthly: t.float(),
  }),
})
