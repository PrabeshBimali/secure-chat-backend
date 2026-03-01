import { NextFunction, Request, Response } from "express"
import { assertAuth } from "../lib/utils/authUtils.js"
import * as roomRepo from "../repositories/roomRepository.js"
import { createSuccessResponse } from "../helpers/responseCreator.js"

export async function getConversationListForUser(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = assertAuth(req)
    const conversationData = await roomRepo.findRoomsForUser(userId)
    const response = createSuccessResponse("conversation list loaded", conversationData)

    res.status(200).json(response)
  } catch(error) {
    next(error)
  }
}