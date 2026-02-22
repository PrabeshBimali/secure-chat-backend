import db from "../config/db.js"
import { PoolClient } from "pg"

export type DBFriendStatusOptions = "pending" | "friends" | "blocked"

export async function insert(user1Id: number, user2Id: number, requesterId: number, roomid: string, client?: PoolClient) {
  const query = `INSERT INTO friends (user_1_id, user_2_id, requester_id, roomid) VALUES ($1, $2, $3, $4)`

  if(client) {
    await client.query(query, [user1Id, user2Id, requesterId, roomid])
    return
  }

  await db.query(query, [user1Id, user2Id, requesterId, roomid])
}

export async function updateFriendshipStatus(user1Id: number, user2Id: number, status: DBFriendStatusOptions, client?: PoolClient) {
  const query = `UPDATE friends SET status=$1 WHERE user_1_id=$2 AND user_2_id=$3`

  if(client) {
    await client.query(query, [status, user1Id, user2Id])
    return
  }

  await db.query(query, [status, user1Id, user2Id])
}