export interface EmailVerificationToken {
  id: string
  userid: number
  token: string
  expires_at: Date
}