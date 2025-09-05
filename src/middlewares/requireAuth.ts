import jwt from "jsonwebtoken"
import { Request, Response, NextFunction } from "express"
import { UnauthorizedError } from "../errors/HTTPErrors.js"
import authConfig from "../config/authConfig.js"

export interface AuthRequest extends Request {
  userId?: number
}

export default function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const token = req.cookies.token

    if (!token) {
      throw new UnauthorizedError()
    }

    const payload = jwt.verify(token, authConfig.jwtSecretKey) as { userId: number }

    if(!payload.userId) {
      throw new UnauthorizedError()
    }

    req.userId = payload.userId

    next()
  } catch (error) {
    next(error)    
  }
}