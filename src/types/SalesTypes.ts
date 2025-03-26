import { Person } from './UserTypes'


export type SalesType = {
  salesId: number, //remove
  id: number,
  amount: number, //remove
  totalAmount: number,
  createdAt: string,
  website: boolean, //remove
  paid: boolean,
  cash: boolean, // remove
  delivered: boolean,
  deliveredAt: string

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sold_products: any[], //remove
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  product: any[]
  user: Person,
  userId: number
}