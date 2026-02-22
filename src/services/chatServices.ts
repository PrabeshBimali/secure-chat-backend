import * as userRepo from "../repositories/userRepository.js"
import * as roomRepo from "../repositories/roomRepository.js"
import * as friendsRepo from "../repositories/friendsRepository.js"
import * as messageRepo from "../repositories/messageRepository.js"
import db from "../config/db.js"
import { BadRequestError, NotFoundError } from "../errors/HTTPErrors.js"

export async function addMessage(myId: number, targetId: number, cipherText: string, iv: string) {
  const client = await db.connect()

  try {
    const relationship = await userRepo.findWithRelationship(myId, targetId)

    if(relationship === null) {
      throw new NotFoundError("User not Found")
    }
    // In case there is no prior relationship
    if(relationship.friendship_status === null || relationship.roomid === null) {
      await client.query("BEGIN")
      const roomid = await roomRepo.insert(client)
      // TODO: Add multiple inserts at once later
      await roomRepo.insertMember(roomid, myId, client)
      await roomRepo.insertMember(roomid, targetId, client)
      await friendsRepo.insert(Math.min(myId, targetId), Math.max(myId, targetId), myId, roomid, client)
      // TODO: Change status based on if user is online
      const messageId = await messageRepo.insert(cipherText, iv, "sent", myId, roomid, client)
      await client.query("COMMIT")
      return
    }

    // if user is blocked
    if(relationship.blocked_by !== null) {
      if(relationship.blocked_by === myId) {
        throw new BadRequestError("Cannot send the message", {
          "fieldErrors": {
            "message": "Unable to send message. User is Blocked."
          }
        })
      }

      if(relationship.blocked_by === targetId) {
        throw new BadRequestError("Cannot send the message", {
          "fieldErrors": {
            "message": "Unable to send message. You are blocked."
          }
        })
      }
    }

    // if request is still pending throw error
    if(relationship.friendship_status === "pending" &&  relationship.requester_id === myId) {
      throw new BadRequestError("Cannot send the message", {
        "fieldErrors": {
          "message": "Unable to send message. Your request is still pending."
        }
      })
    }

    await client.query("BEGIN")
    // if request is pending but person who messaged receiver send update friendship status
    if(relationship.friendship_status === "pending" && relationship.requester_id === targetId) {
      await friendsRepo.updateFriendshipStatus(Math.min(myId, targetId), Math.max(myId, targetId), "friends", client)
    }

    // TODO: if target user is online statuss shouldd be delivered
    const messageId = await messageRepo.insert(cipherText, iv, "sent", myId, relationship.roomid, client)
    await client.query("COMMIT")
  } catch(error) {
    await client.query("ROLLBACK")
    throw error
  } finally {
    client.release()
  }
}