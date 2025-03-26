export type Person = {
  id: string,
  firstname: string,
  lastname: string,
  email: string,
  profile_pics: string | null,
  createdAt: Date | string,
  admin: boolean,
  phone: string
}