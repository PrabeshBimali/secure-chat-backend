import redisClient from "../config/redisClient.js";
import { CustomSocket } from "../middlewares/socketAuth.js";

export async function handleConnection(socket: CustomSocket) {
  try {
    const userId = socket.userId
    const key = `user:online:${userId}`
    await redisClient.SADD(key, socket.id)

    // REMINDER keep 2 minutes for now
    // change to large number later
    await redisClient.EXPIRE(key, 300)
  } catch(e) {
    console.log(e)
  }
}

export function handleDisconnect(socket: CustomSocket) {
  return async () => {
    try{
      const userId = socket.userId
      const key = `user:online:${userId}`
      await redisClient.SREM(key, socket.id)
    } catch(e) {
      console.log(e)
    }
  }
}