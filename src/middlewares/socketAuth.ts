import { Socket } from "socket.io"
import jwt from "jsonwebtoken"
import authConfig from "../config/authConfig.js"
import cookie from "cookie"
import { BadRequestError, ServerError, UnauthorizedError } from "../errors/HTTPErrors.js";

export interface CustomSocket extends Socket {
  userId?: number
}

export function socketAuth(socket: CustomSocket, next: (err?: Error) => void) {
  try {
    const rawCookie = socket.handshake.headers.cookie;
    
    if (!rawCookie) {
      return next(new UnauthorizedError("Authentication error"))
    }

    const cookies = cookie.parse(rawCookie)
    const token = cookies.jwt

    if (!token) return next(new UnauthorizedError("Authentication error"))

    const decoded = jwt.verify(token, authConfig.jwtSecretKey) as {userId: number}

    socket.userId = decoded.userId

    next()
  } catch (err) {
    console.error("Socket Middleware Error")
    next(new ServerError("Authentication failed"))
  }
}