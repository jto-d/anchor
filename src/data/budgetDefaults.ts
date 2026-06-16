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
      { label: 'Rent / mortgage', icon: 'home', budget: 1850, position: 0 },
      { label: 'Utilities', icon: 'bolt', budget: 180, position: 1 },
      { label: 'Internet', icon: 'wifi', budget: 70, position: 2 },
    ],
  },
  {
    label: 'Food',
    icon: 'restaurant',
    position: 1,
    categories: [
      { label: 'Groceries', icon: 'local_grocery_store', budget: 600, position: 0 },
      { label: 'Dining out', icon: 'restaurant', budget: 300, position: 1 },
    ],
  },
  {
    label: 'Transport',
    icon: 'directions_car',
    position: 2,
    categories: [
      { label: 'Transportation', icon: 'directions_transit', budget: 120, position: 0 },
      { label: 'Gas', icon: 'local_gas_station', budget: 160, position: 1 },
    ],
  },
  {
    label: 'Health',
    icon: 'favorite',
    position: 3,
    categories: [{ label: 'Health / medical', icon: 'favorite', budget: 140, position: 0 }],
  },
  {
    label: 'Personal',
    icon: 'shopping_bag',
    position: 4,
    categories: [
      { label: 'Personal spending', icon: 'shopping_bag', budget: 400, position: 0 },
      { label: 'Phone', icon: 'smartphone', budget: 90, position: 1 },
    ],
  },
]

export const DEFAULT_INCOME: { label: string; sub: string; amount: number; position: number }[] = [
  { label: 'Salary', sub: 'Net, monthly', amount: 5400, position: 0 },
]

export const DEFAULT_SAVINGS: {
  label: string
  accountType: string
  icon: string
  monthly: number
  annualLimit: number | null
  position: number
}[] = [
  { label: 'Roth IRA', accountType: 'Roth IRA', icon: 'savings', monthly: 400, annualLimit: 7000, position: 0 },
  { label: 'HSA', accountType: 'HSA', icon: 'favorite_border', monthly: 300, annualLimit: 4400, position: 1 },
  { label: 'Emergency fund', accountType: 'Emergency Fund', icon: 'shield', monthly: 300, annualLimit: null, position: 2 },
]

export const DEFAULT_GOALS: {
  name: string
  icon: string
  target: number | null
  base: number
  targetYear: number | null
  targetMonth: number | null
}[] = [
  { name: 'Emergency fund', icon: 'shield', target: 15000, base: 8200, targetYear: 2026, targetMonth: 11 },
  { name: 'Vacation 2026', icon: 'beach_access', target: 4000, base: 1450, targetYear: 2026, targetMonth: 7 },
  { name: 'New car fund', icon: 'directions_car', target: 12000, base: 3100, targetYear: 2027, targetMonth: 5 },
]
