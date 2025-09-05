import db from "../config/db.js"
import { CreatedUser, CreateUserInput, User } from "../models/User.js";

export async function insert(newUser: CreateUserInput): Promise<CreatedUser> {
  const query = `INSERT INTO users(username, email, password_hash) VALUES($1, $2, $3) RETURNING id, username, email`
  const val = await db.query(query, [newUser.username, newUser.email, newUser.password_hash])
  return val.rows[0] as CreatedUser
}

export async function findById(id: number): Promise<User> {
  const query = `SELECT * FROM users WHERE id = $1`
  const val = await db.query(query, [id])
  return val.rows[0] as User
}

export async function findByEmail(email: string): Promise<User> {
  const query = `SELECT * FROM users WHERE email=$1`
  const val = await db.query(query, [email])
  return val.rows[0] as User
}

export async function updateEmailVerifiedById(id: number, value: boolean) {
  const query = `UPDATE users SET email_verified = $1, updated_at = NOW() WHERE id = $2`
  await db.query(query, [value, id])
}

