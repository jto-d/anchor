export const DEFAULT_GROUPS: {
  label: string
  icon: string
  position: number
  categories: { label: string; icon: string; budget: number; position: number }[]
}[] = [
  {
    label: 'Housing',
    icon: 'home',
    position: 0,
    categories: [
      { label: 'Rent / mortgage', icon: 'home', budget: 0, position: 0 },
      { label: 'Utilities', icon: 'bolt', budget: 0, position: 1 },
      { label: 'Internet', icon: 'wifi', budget: 0, position: 2 },
    ],
  },
  {
    label: 'Food',
    icon: 'restaurant',
    position: 1,
    categories: [
      { label: 'Groceries', icon: 'local_grocery_store', budget: 0, position: 0 },
      { label: 'Dining out', icon: 'restaurant', budget: 0, position: 1 },
    ],
  },
  {
    label: 'Transport',
    icon: 'directions_car',
    position: 2,
    categories: [
      { label: 'Transportation', icon: 'directions_transit', budget: 0, position: 0 },
      { label: 'Gas', icon: 'local_gas_station', budget: 0, position: 1 },
    ],
  },
  {
    label: 'Health',
    icon: 'favorite',
    position: 3,
    categories: [{ label: 'Health / medical', icon: 'favorite', budget: 0, position: 0 }],
  },
  {
    label: 'Personal',
    icon: 'shopping_bag',
    position: 4,
    categories: [
      { label: 'Personal spending', icon: 'shopping_bag', budget: 0, position: 0 },
      { label: 'Phone', icon: 'smartphone', budget: 0, position: 1 },
    ],
  },
]

export const DEFAULT_INCOME: { label: string; sub: string; amount: number; position: number }[] = [
  { label: 'Salary', sub: 'Net, monthly', amount: 0, position: 0 },
]

export const DEFAULT_SAVINGS: {
  label: string
  accountType: string
  icon: string
  monthly: number
  annualLimit: number | null
  position: number
}[] = [
  { label: 'Roth IRA', accountType: 'Roth IRA', icon: 'savings', monthly: 0, annualLimit: 7000, position: 0 },
  { label: 'HSA', accountType: 'HSA', icon: 'favorite_border', monthly: 0, annualLimit: 4400, position: 1 },
  { label: 'Emergency fund', accountType: 'Emergency Fund', icon: 'shield', monthly: 0, annualLimit: null, position: 2 },
]

export const DEFAULT_GOALS: {
  name: string
  icon: string
  target: number | null
  base: number
  targetYear: number | null
  targetMonth: number | null
}[] = [
  { name: 'Emergency fund', icon: 'shield', target: null, base: 0, targetYear: null, targetMonth: null },
  { name: 'Vacation', icon: 'beach_access', target: null, base: 0, targetYear: null, targetMonth: null },
  { name: 'New car fund', icon: 'directions_car', target: null, base: 0, targetYear: null, targetMonth: null },
]
