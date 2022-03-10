export interface BillInfo {
  id: string
  type: number
  time: Date
  category: string
  categoryName?: string
  amount: number
}

export interface Category{
  id: string
  type: number
  name: string
}

export interface CategoryChartItem {
  name: string
  value: number
}

export interface CategoryDayItem {
  date: Date
  expenses: number
}
