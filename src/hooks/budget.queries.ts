// All client GraphQL documents for the budgeting feature, in one place so the
// data hooks (`useBudgetMonth`/`useBudgetYear`) stay focused on wiring rather
// than query text.

import { graphql } from '@/gql'

export const BudgetMonthDocument = graphql(`
  query BudgetMonth($year: Int!, $month: Int!) {
    budgetMonth(year: $year, month: $month) {
      budgetStartYear
      budgetStartMonth
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
export const SetCategoryMonthBudgetDocument = graphql(`mutation SetCategoryMonthBudget($id: String!, $year: Int!, $month: Int!, $budget: Float!) { setCategoryMonthBudget(id: $id, year: $year, month: $month, budget: $budget) }`)
export const SetMonthlySpendDocument = graphql(`mutation SetMonthlySpend($categoryId: String!, $year: Int!, $month: Int!, $amount: Float!) { setMonthlySpend(categoryId: $categoryId, year: $year, month: $month, amount: $amount) }`)
export const SetSavingsMonthlyDocument = graphql(`mutation SetSavingsMonthly($id: String!, $monthly: Float!) { setSavingsMonthly(id: $id, monthly: $monthly) }`)
export const SetMonthlyContributionDocument = graphql(`mutation SetMonthlyContribution($accountId: String!, $year: Int!, $month: Int!, $amount: Float!) { setMonthlyContribution(accountId: $accountId, year: $year, month: $month, amount: $amount) }`)
export const SetSurplusAllocationDocument = graphql(`mutation SetSurplusAllocation($goalId: String!, $year: Int!, $month: Int!, $amount: Float!) { setSurplusAllocation(goalId: $goalId, year: $year, month: $month, amount: $amount) }`)
export const AddBudgetCategoryDocument = graphql(`mutation AddBudgetCategory($groupId: String!, $label: String!, $icon: String!, $budget: Float!) { addBudgetCategory(groupId: $groupId, label: $label, icon: $icon, budget: $budget) }`)
export const RenameCategoryDocument = graphql(`mutation RenameCategory($id: String!, $label: String!) { renameCategory(id: $id, label: $label) }`)
export const RemoveBudgetCategoryDocument = graphql(`mutation RemoveBudgetCategory($id: String!) { removeBudgetCategory(id: $id) }`)
export const AddSavingsAccountDocument = graphql(`mutation AddSavingsAccount($label: String!, $accountType: String!, $icon: String!, $monthly: Float!) { addSavingsAccount(label: $label, accountType: $accountType, icon: $icon, monthly: $monthly) }`)
export const RenameSavingsAccountDocument = graphql(`mutation RenameSavingsAccount($id: String!, $label: String!) { renameSavingsAccount(id: $id, label: $label) }`)
export const RemoveSavingsAccountDocument = graphql(`mutation RemoveSavingsAccount($id: String!) { removeSavingsAccount(id: $id) }`)
export const RenameIncomeSourceDocument = graphql(`mutation RenameIncomeSource($id: String!, $label: String!) { renameIncomeSource(id: $id, label: $label) }`)
export const AddBudgetGroupDocument = graphql(`mutation AddBudgetGroup($label: String!, $icon: String!) { addBudgetGroup(label: $label, icon: $icon) }`)
export const RenameBudgetGroupDocument = graphql(`mutation RenameBudgetGroup($id: String!, $label: String!) { renameBudgetGroup(id: $id, label: $label) }`)
export const RemoveBudgetGroupDocument = graphql(`mutation RemoveBudgetGroup($id: String!) { removeBudgetGroup(id: $id) }`)
export const AddSavingsGoalDocument = graphql(`mutation AddSavingsGoal($name: String!, $icon: String!) { addSavingsGoal(name: $name, icon: $icon) }`)
export const RenameSavingsGoalDocument = graphql(`mutation RenameSavingsGoal($id: String!, $name: String!) { renameSavingsGoal(id: $id, name: $name) }`)
export const RemoveSavingsGoalDocument = graphql(`mutation RemoveSavingsGoal($id: String!) { removeSavingsGoal(id: $id) }`)
export const SetSavingsGoalTargetDocument = graphql(`mutation SetSavingsGoalTarget($id: String!, $target: Float) { setSavingsGoalTarget(id: $id, target: $target) }`)
export const SetBudgetStartDocument = graphql(`mutation SetBudgetStart($year: Int!, $month: Int!) { setBudgetStart(year: $year, month: $month) }`)
export const CopyMonthBudgetDocument = graphql(`mutation CopyMonthBudget($fromYear: Int!, $fromMonth: Int!, $toYear: Int!, $toMonth: Int!) { copyMonthBudget(fromYear: $fromYear, fromMonth: $fromMonth, toYear: $toYear, toMonth: $toMonth) }`)
