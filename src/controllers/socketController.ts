import redisClient from "../config/redisClient.js"
import { userOnlineCache } from "../helpers/redisKeys.js"
import { CustomSocket } from "../middlewares/socketAuth.js"

export async function handleConnection(socket: CustomSocket) {
  try {
    const userId = socket.userId
    const key = userOnlineCache.getKey(userId)
    await redisClient.SADD(key, socket.id)

    await redisClient.EXPIRE(key, userOnlineCache.getTTL())
  } catch(e) {
    console.log(e)
  }
}

export function handleDisconnect(socket: CustomSocket) {
  return async () => {
    try{
      const userId = socket.userId
      const key = userOnlineCache.getKey(userId)
      await redisClient.SREM(key, socket.id)
    } catch(e) {
      console.log(e)
    }
  }
}