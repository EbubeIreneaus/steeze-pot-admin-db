import { Person } from './UserTypes'


export type SalesType = {
  salesId: number,
  amount: number,
  createdAt: string,
  website: boolean,
  paid: boolean,
  cash: boolean,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sold_products: any[],
  user: Person
}