export interface User {
  id: number
  username: string
  email: string
  email_verified: boolean
  identity_pbk: string
  created_at: Date
  updated_at: Date
}

export interface InsertUser {
  username: string
  email: string
  encryption_pbk: string
  identity_pbk: string
}

export interface CreatedUser {
  id: number
  username: string
  email: string
}