// Shared domain types for the budgeting feature.
//
// Money arrives from GraphQL as numbers (Decimal columns are exposed as Float —
// see CLAUDE.md "Pothos conventions"); dates still arrive as strings. Every
// shape here is the numeric form produced by `useBudgetMonth`.

/** The month currently in view, as a zero-based month index. */
export interface MonthSel {
  y: number
  m: number
}

export interface IncomeSource {
  id: string
  label: string
  sub: string | null
  amount: number
}

export interface CategoryData {
  id: string
  label: string
  icon: string
  budget: number
  position: number
  monthSpent: number
}

export interface GroupData {
  id: string
  label: string
  icon: string
  position: number
  categories: CategoryData[]
}

export interface SavingsData {
  id: string
  label: string
  accountType: string
  icon: string
  monthly: number
  annualLimit: number | null
  position: number
  monthContrib: number
  ytd: number
}

export interface GoalData {
  id: string
  name: string
  icon: string
  target: number | null
  base: number
  targetYear: number | null
  targetMonth: number | null
  running: number
  monthAllocated: number
}

/** Rolled-up figures that drive the summary strip and surplus math. */
export interface Totals {
  income: number
  budgeted: number
  spentSaved: number
  allocated: number
  baseSurplus: number
  surplus: number
  incomeCount: number
}
