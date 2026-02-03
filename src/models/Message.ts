export interface Message {
  id: string
  ciphertext: string
  iv: string
  is_edited: boolean
  is_deleted: boolean
  status: string
  created_at: Date
  updated_at: Date
  senderid: number
  roomid: string
  replyid: string
}