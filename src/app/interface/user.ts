export interface CreateUser {
  username: string,
  first_name: string,
  last_name: string,
  email: string,
  password: string
}

export interface User {
  id: number,
  username: string,
  first_name: string,
  last_name: string,
  email: string,
  selected?: boolean
}
