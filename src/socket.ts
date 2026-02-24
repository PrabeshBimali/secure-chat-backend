import { Server } from "socket.io";
import { Server as HttpServer } from "http"
import appConfig from "./config/appConfig.js"

class Socket {
  private static instance: Socket
  public io: Server | null = null

  private constructor() {}

  public static getInstance(): Socket {
    if (!Socket.instance) {
      Socket.instance = new Socket()
    }
    return Socket.instance;
  }

  init(httpServer: HttpServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: appConfig.frontendUrl,
        credentials: true
      }
    });
    return this.io
  }

  getServer(): Server {
    if(!this.io) {
      throw Error("Socket not initialized")
    }

    return this.io
  }
}

export default Socket.getInstance()