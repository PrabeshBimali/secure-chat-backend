import { NextFunction, Request, Response } from "express";
import * as userRepo from "../repositories/userRepository.js"
import { createSuccessResponse } from "../helpers/responseCreator.js";
import { SearchUsersRequestPayload } from "../zod/schema.js";

export async function searchUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const { userid, usernamePattern } = req.body as SearchUsersRequestPayload

    const rawUsers = await userRepo.searchUsersWithFriendshipStatus(userid, usernamePattern)
  
    const users = rawUsers.map(user => {
     
      const friendshipStatus = user.friendship_status === null ? "none" : user.friendship_status
      const requesterId = user.requester_id
      return (
        {
          id: user.id,
          username: user.username,
          friendshipStatus,
          requesterId
        }
      )
    })

    const response = createSuccessResponse("Users Retrieved!", users)

    res.status(200).json(response)
  } catch(error) {
    next(error)
  }
}