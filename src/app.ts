import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import cookieParser from "cookie-parser"
import { errorHandler } from "./middlewares/errorHandler.js"
import cors from "cors"
import appConfig from "./config/appConfig.js"

// router imports
import authRouter from "./routes/authRoutes.js"
import usersRouter from  "./routes/usersRoutes.js"
import chatRouter from "./routes/chatRoutes.js"
import { socketAuth } from "./middlewares/socketAuth.js"

const corsOptions = {
      origin: appConfig.frontendUrl,
      credentials: true,
};

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
        origin: appConfig.frontendUrl,
        credentials: true
    }
})

// express global middlewares
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())

// express routes
app.use("/auth", authRouter)
app.use("/users", usersRouter)
app.use("/chat", chatRouter)

app.use(errorHandler)

io.use(socketAuth)
io.on("connection", () => {
  console.log("A user connected to socket server")
})


const port = appConfig.port || 5000

httpServer.listen(port, () => {
  console.log(`Server is listening to the port ${port}`)
})