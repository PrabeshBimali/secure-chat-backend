import { EmailVerificationToken } from "../models/Token.js";
import db from "../config/db.js"

export async function insertToken(tokenData: EmailVerificationToken) {
  const {id, userid, token, expires_at} = tokenData
  const query = `INSERT INTO email_verification_token(id, userid, token, expires_at) VALUES($1, $2, $3, $4)`
  await db.query(query, [id, userid, token, expires_at.toISOString()])
}