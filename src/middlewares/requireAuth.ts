import jwt from "jsonwebtoken"
import { Request, Response, NextFunction } from "express"
import { UnauthorizedError } from "../errors/HTTPErrors.js"
import authConfig from "../config/authConfig.js"
import redisClient from "../config/redisClient.js"
import { revokedTokenCache } from "../helpers/redisKeys.js"

export interface AuthData {
  userId: number
  username: string
  device_pbk: string
  iat: number
  exp: number
}

export interface AuthRequest extends Request {
  auth?: AuthData
}

export default async function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const token = req.cookies.token

    if (!token) {
      throw new UnauthorizedError()
    }

    const isRevoked = await redisClient.get(revokedTokenCache.getKey(token))

    if(isRevoked) {
      throw new UnauthorizedError("Token revoked!")
    }

    const payload = jwt.verify(token, authConfig.jwtSecretKey) as AuthData

    if(!payload.userId) {
      throw new UnauthorizedError()
    }

    req.auth = payload

    next()
  } catch (error) {
    next(error)    
  }
}