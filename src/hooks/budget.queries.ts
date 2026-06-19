// All client GraphQL documents for the budgeting feature, in one place so the
// data hooks (`useBudgetMonth`/`useBudgetYear`) stay focused on wiring rather
// than query text.

import { graphql } from '@/gql'

export const BudgetMonthDocument = graphql(`
  query BudgetMonth($year: Int!, $month: Int!) {
    budgetMonth(year: $year, month: $month) {
      incomeSources {
        id
        label
        sub
        amount
        position
      }
      groups {
        id
        label
        icon
        position
        categories {
          id
          label
          icon
          budget
          position
          monthSpent
        }
      }
      savings {
        id
        label
        accountType
        icon
        monthly
        annualLimit
        position
        monthContrib
        ytd
      }
      goals {
        id
        name
        icon
        target
        base
        targetYear
        targetMonth
        running
        monthAllocated
      }
    }
  }
`)

export const BudgetYearDocument = graphql(`
  query BudgetYear($year: Int!) {
    budgetYear(year: $year) {
      incomeSources { id label sub amount position }
      groups {
        id label icon position
        categories { id label icon budget position }
      }
      savings { id label accountType icon monthly annualLimit position }
      goals { id name icon target base targetYear targetMonth running }
      monthlyData {
        month hasData
        categorySpends { categoryId amount }
        savingsContribs { accountId amount }
        surplusAllocations { goalId amount }
      }
    }
  }
`)

export const SetIncomeAmountDocument = graphql(`mutation SetIncomeAmount($id: String!, $amount: Float!) { setIncomeAmount(id: $id, amount: $amount) }`)
export const AddIncomeSourceDocument = graphql(`mutation AddIncomeSource($label: String!, $amount: Float!) { addIncomeSource(label: $label, amount: $amount) }`)
export const RemoveIncomeSourceDocument = graphql(`mutation RemoveIncomeSource($id: String!) { removeIncomeSource(id: $id) }`)
export const SetCategoryBudgetDocument = graphql(`mutation SetCategoryBudget($id: String!, $budget: Float!) { setCategoryBudget(id: $id, budget: $budget) }`)
export const SetMonthlySpendDocument = graphql(`mutation SetMonthlySpend($categoryId: String!, $year: Int!, $month: Int!, $amount: Float!) { setMonthlySpend(categoryId: $categoryId, year: $year, month: $month, amount: $amount) }`)
export const SetSavingsMonthlyDocument = graphql(`mutation SetSavingsMonthly($id: String!, $monthly: Float!) { setSavingsMonthly(id: $id, monthly: $monthly) }`)
export const SetMonthlyContributionDocument = graphql(`mutation SetMonthlyContribution($accountId: String!, $year: Int!, $month: Int!, $amount: Float!) { setMonthlyContribution(accountId: $accountId, year: $year, month: $month, amount: $amount) }`)
export const SetSurplusAllocationDocument = graphql(`mutation SetSurplusAllocation($goalId: String!, $year: Int!, $month: Int!, $amount: Float!) { setSurplusAllocation(goalId: $goalId, year: $year, month: $month, amount: $amount) }`)
export const AddBudgetCategoryDocument = graphql(`mutation AddBudgetCategory($groupId: String!, $label: String!, $icon: String!, $budget: Float!) { addBudgetCategory(groupId: $groupId, label: $label, icon: $icon, budget: $budget) }`)
export const AddSavingsAccountDocument = graphql(`mutation AddSavingsAccount($label: String!, $accountType: String!, $icon: String!, $monthly: Float!) { addSavingsAccount(label: $label, accountType: $accountType, icon: $icon, monthly: $monthly) }`)
