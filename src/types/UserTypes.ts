export type Person = {
  id: string,
  firstname: string,
  lastname: string,
  email: string,
  staff: boolean,
  department: string,
  username: string,
  profile_pics: string | null,
  joined: Date | string,
  admin: boolean,
  active: boolean
}