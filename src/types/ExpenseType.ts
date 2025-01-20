import { Person } from './UserTypes'

export type ExpenseType = {
  category: string,
  id: number,
  amount: number,
  desc: string,
  createdAt: string,
  user: Person
}