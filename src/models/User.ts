export interface User {
  id: number
  username: string
  email: string
  password_hash: string
  email_verified: boolean
  created_at: Date
  updated_at: Date
}

export interface CreateUserInput {
  username: string
  email: string
  password_hash: string
}

export interface CreatedUser {
  id: number
  username: string
  email: string
}