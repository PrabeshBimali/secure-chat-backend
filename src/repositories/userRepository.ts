import db from "../config/db.js"
import { CreatedUser, CreateUserInput } from "../models/User.js";

export async function insertUser(newUser: CreateUserInput): Promise<CreatedUser> {
  const query = `INSERT INTO users(username, email, password_hash) VALUES($1, $2, $3) RETURNING id, username, email`
  const val = await db.query(query, [newUser.username, newUser.email, newUser.password_hash])
  return val.rows[0] as CreatedUser
}

