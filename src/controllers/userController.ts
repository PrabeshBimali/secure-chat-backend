import { NextFunction, Request, Response } from "express";
import * as userRepo from "../repositories/userRepository.js"
import { createSuccessResponse } from "../helpers/responseCreator.js";
import { SearchUsersRequestPayload } from "../zod/schema.js";
import { generateFriendshipStatusForUI } from "../services/userServices.js";

export async function searchUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const { userid, usernamePattern } = req.body as SearchUsersRequestPayload

    const rawUsers = await userRepo.searchWithRelationship(userid, usernamePattern)
  
    const users = rawUsers.map(user => {
      
      let friendshipStatus = generateFriendshipStatusForUI(user, userid)

      return (
        {
          id: user.id,
          username: user.username,
          friendshipStatus
        }
      )
    })

    const response = createSuccessResponse("Users Retrieved!", users)

    res.status(200).json(response)
  } catch(error) {
    next(error)
  }
}