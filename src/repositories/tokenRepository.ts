import { EmailVerificationToken } from "../models/Token.js";
import db from "../config/db.js"

export async function insertToken(tokenData: EmailVerificationToken) {
  const {id, userid, token, expires_at} = tokenData
  const query = `INSERT INTO email_verification_token(id, userid, token, expires_at) VALUES($1, $2, $3, $4)`
  await db.query(query, [id, userid, token, expires_at.toISOString()])
}

export async function findByIdAndUserId(id: string, userid: number): Promise<EmailVerificationToken> {
  const query = `SELECT * FROM email_verification_token WHERE id=$1 AND userid = $2;`
  const response = await db.query(query, [id, userid])
  return response.rows[0] as EmailVerificationToken
}

export async function deleteById(id: string) {
  const query = `DELETE FROM email_verification_token WHERE id=$1`
  await db.query(query, [id])
}