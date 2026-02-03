import { NextFunction, Request, Response } from "express"
import * as userRepo from "../repositories/userRepository.js"
import * as messageRepo from "../repositories/messageRepository.js"
import { assertAuth } from "../lib/utils/authUtils.js"
import { UserIdParamsSchema } from "../zod/schema.js"
import { generateFriendshipStatusForUI } from "../services/userServices.js"
import { createSuccessResponse } from "../helpers/responseCreator.js"

export async function getChatContext(req: Request, res: Response, next: NextFunction) {
  try {

    const myId = assertAuth(req)
    const result = UserIdParamsSchema.parse(req.params)
    const targetId = result.userid

    const targetUser = await userRepo.findWithRelationship(myId, targetId)
    const recentMessages = await messageRepo.findRecentByRoomid(targetUser.roomid)

    const responsePayload = {
      id: targetUser.id,
      username: targetUser.username,
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