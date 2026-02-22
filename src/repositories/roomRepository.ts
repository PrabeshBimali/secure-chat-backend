import db from "../config/db.js"
import { PoolClient } from "pg"

export async function insert(client?: PoolClient): Promise<string> {
  const query = `INSERT INTO rooms DEFAULT VALUES RETURNING id`

  if(client) {
    const response = await client.query(query)
    return response.rows[0].id as string
  }

  const response = await db.query(query)
  return response.rows[0].id as string
}

export async  function insertMember(roomid: string, userid: number, client?: PoolClient) {
  const query = `INSERT INTO room_members(userid, roomid) VALUES ($1, $2)`

  if(client) {
    await client.query(query, [userid, roomid])
    return
  }

  await db.query(query, [userid, roomid])
}