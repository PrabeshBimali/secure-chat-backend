import db from "../config/db.js"
import { PoolClient } from "pg"

interface ConversationData {
  roomId: string
  partnerId: number
  partnerName: string
  lastMessageAt: Date
}

export async function insert(client?: PoolClient): Promise<string> {
  const query = `INSERT INTO rooms DEFAULT VALUES RETURNING id`

  if(client) {
    const response = await client.query(query)
    return response.rows[0].id as string
  }

  const response = await db.query(query)
  return response.rows[0].id as string
}

export async function insertMember(roomid: string, userid: number, client?: PoolClient) {
  const query = `INSERT INTO room_members(userid, roomid) VALUES ($1, $2)`

  if(client) {
    await client.query(query, [userid, roomid])
    return
  }

  await db.query(query, [userid, roomid])
}

export async function findRoomsForUser(userid: number): Promise<Array<ConversationData>> {
  const query = `
    SELECT 
	   r.id AS "roomId",
      other_members.userid AS "partnerId", 
      u.username AS "partnerName", 
      r.last_message_at AS "lastMessageAt"
    FROM room_members my_rooms
    JOIN room_members other_members ON my_rooms.roomid = other_members.roomid
    JOIN rooms r ON r.id = my_rooms.roomid
    JOIN users u ON u.id = other_members.userid
    WHERE my_rooms.userid = $1 
    AND other_members.userid != $1
    ORDER BY r.last_message_at DESC;
  `

  const response = await db.query(query, [userid])
  return response.rows as Array<ConversationData>
}