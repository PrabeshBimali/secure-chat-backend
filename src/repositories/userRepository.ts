import { PoolClient } from "pg";
import db from "../config/db.js"
import { CreatedUser, InsertUser, User } from "../models/User.js";

export interface BaseUser {
  id: number
  username: string
}
export interface SearchUser extends BaseUser {
  friendship_status: string
  requester_id: number
  blocked_by: number | null
}

export interface ChatPartner extends SearchUser {
  encryption_pbk: string
  roomid: string | null
}

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

export async function searchWithRelationship(id: number, pattern: string): Promise<Array<SearchUser>> {
  const newPattern = `${pattern}%`
  const query = 
  `SELECT 
    u.id, 
    u.username, 
    f.status AS friendship_status,
    f.requester_id,
    f.blocked_by
  FROM users u
  LEFT JOIN friends f ON 
      (f.user_1_id = LEAST($1, u.id) AND f.user_2_id = GREATEST($1, u.id))
  WHERE (u.username ILIKE $2 OR u.email ILIKE $2) AND u.id != $1 
  LIMIT 7;`
  const response = await db.query(query, [id, newPattern])
  return response.rows
} 

export async function findWithRelationship(myId: number, targetId: number): Promise<ChatPartner> {
  const query = `
    SELECT
      u.id,
      u.username,
      u.encryption_pbk,
      f.status AS friendship_status,
      f.requester_id,
      f.blocked_by,
      f.roomid
    FROM users u
    LEFT JOIN friends f ON
      (f.user_1_id = $1 AND f.user_2_id = $2) OR
      (f.user_1_id = $2 AND f.user_2_id = $1)
    WHERE u.id = $2;
  `
  const response = await db.query(query, [myId, targetId])
  return response.rows[0]
}