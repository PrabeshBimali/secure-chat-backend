import { NextFunction, Request, Response } from "express"
import * as userRepo from "../repositories/userRepository.js"
import * as messageRepo from "../repositories/messageRepository.js"
import { assertAuth } from "../lib/utils/authUtils.js"
import { SendMessageRequestPayload, UserIdParamsSchema } from "../zod/schema.js"
import { generateFriendshipStatusForUI } from "../services/userServices.js"
import { createSuccessResponse } from "../helpers/responseCreator.js"
import { addMessage } from "../services/chatServices.js"
import socket from "../socket.js"
import redisClient from "../config/redisClient.js"

export async function getChatContext(req: Request, res: Response, next: NextFunction) {
  try {

    const myId = assertAuth(req)
    const result = UserIdParamsSchema.parse(req.params)
    const targetId = result.userid

    const targetUser = await userRepo.findWithRelationship(myId, targetId)

    // TODO improve this error
    if(targetUser === null) {
      throw new Error()
    }

    let recentMessages: Array<messageRepo.MessageForClient> = []

    if(targetUser.roomid !== null) {
      recentMessages = await messageRepo.findRecentByRoomid(targetUser.roomid)
    }

    const responsePayload = {
      id: targetUser.id,
      username: targetUser.username,
      publicKey: targetUser.encryption_pbk,
      friendshipStatus: generateFriendshipStatusForUI(targetUser, myId),
      roomid: targetUser.roomid,
      messages: recentMessages.reverse()
    }

    const response = createSuccessResponse("Chat Context Retreived!", responsePayload)

    res.status(200).json(response)

  } catch(error) {
    next(error)
  }
}

export async function sendNewMessage(req: Request, res: Response, next: NextFunction) {
  try {
    const myId = assertAuth(req)
    const payload = req.body as SendMessageRequestPayload
    const idStr = String(payload.partnerId)
    const partnerSocketIds = await redisClient.SMEMBERS(`user:online:${idStr}`)

    const isPartnerOnline = partnerSocketIds.length > 0
    const message = await addMessage(myId, payload.partnerId, payload.ciphertext, payload.iv, isPartnerOnline)

    // send message to chat partner
    if(isPartnerOnline) {
      const io = socket.getServer()
      const socketResponse = createSuccessResponse("Message sent!", message)
      partnerSocketIds.forEach((socketid) => {
        io.to(socketid).emit("message_received", socketResponse)
      })
    }

    const httpResponseData = { messageId: message.id, partnerId: payload.partnerId, status: message.status }
    const httpResponse = createSuccessResponse("Message sent!", httpResponseData)

    res.status(200).json(httpResponse)

  } catch(error) {
    next(error)
  }
}