import { PoolClient } from "pg";
import db from "../config/db.js"
import { CreatedUser, InsertUser, User } from "../models/User.js";

export async function insert(client: PoolClient, user: InsertUser): Promise<CreatedUser> {
  const query = `INSERT INTO users(username, email, identity_pbk, encryption_pbk) VALUES($1, $2, $3, $4) RETURNING id, username, email`
  const val = await client.query(query, [user.username, user.email, user.identity_pbk, user.encryption_pbk])
  return val.rows[0] as CreatedUser
}

export async function findById(id: number): Promise<User | null> {
  const query = `SELECT * FROM users WHERE id = $1`
  const response = await db.query(query, [id])

  if(response.rowCount === null || response.rowCount <= 0) {
    return null
  }

  return response.rows[0]
}

export async function findByIdentity_pbk(identity_pbk: string): Promise<User | null> {
  const query = `SELECT * FROM users WHERE identity_pbk=$1`
  const response = await db.query(query, [identity_pbk])

  if(response.rowCount === null || response.rowCount <= 0) {
    return null
  }

  return response.rows[0]
}

export async function findByEmail(email: string): Promise<User> {
  const query = `SELECT * FROM users WHERE email=$1`
  const val = await db.query(query, [email])
  return val.rows[0] as User
}

export async function findByUsername(username: string): Promise<User> {
  const query = `SELECT * FROM users WHERE username=$1`
  const val = await db.query(query, [username])
  return val.rows[0] as User
}

export async function updateEmailVerifiedById(id: number, value: boolean) {
  const query = `UPDATE users SET email_verified = $1, updated_at = NOW() WHERE id = $2`
  await db.query(query, [value, id])
}

