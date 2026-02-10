import db from "../config/db.js"

export interface MessageForClient {
  id: string
  ciphertext: string
  iv: string
  isEdited: string
  status: "sent" | "delivered" | "read"
  createdAt: Date
  senderId: number
  replyId: string
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
  return response.rows
}