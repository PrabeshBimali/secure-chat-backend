import db from "../config/db.js"
import { PoolClient } from "pg"

export interface MessageForClient {
  id: string
  ciphertext: string
  iv: string
  isEdited: boolean
  status: "sent" | "delivered" | "read"
  createdAt: Date
  senderId: number
  replyId: string | null
}

export async function findRecentByRoomid(roomid: string, limit: number = 50): Promise<Array<MessageForClient>> {
  const query = `
    SELECT 
    id, ciphertext, iv, 
    is_edited AS "isEdited",
    status,
    created_at AS "createdAt",
    senderid AS "senderId",
    replyid AS "replyId"
    FROM messages 
    WHERE roomid = $1 
    ORDER BY created_at DESC 
    LIMIT $2`
  const response = await db.query(query, [roomid, limit])
  return response.rows as Array<MessageForClient>
}

export async function insert(cipherText: string, iv: string, status: "sent" | "delivered" | "read",  senderid: number, roomid: string, client?: PoolClient): Promise<MessageForClient> {
  const query = `INSERT INTO 
    messages(ciphertext, iv, status, senderid, roomid) 
    VALUES($1, $2, $3, $4, $5) 
    RETURNING id, ciphertext, iv,
    is_edited AS "isEdited",
    status,
    created_at AS "createdAt",
    senderid AS "senderId",
    replyid AS "replyId"`

  if(client) {
    const response = await client.query(query, [cipherText, iv, status, senderid, roomid])
    return response.rows[0] as MessageForClient
  }
  
  const response = await db.query(query, [cipherText, iv, status, senderid, roomid])
  return response.rows[0] as MessageForClient
}