import express from "express"
import { createServer, Server } from "http"
import cookieParser from "cookie-parser"
import { errorHandler } from "./middlewares/errorHandler.js"
import cors from "cors"
import appConfig from "./config/appConfig.js"

// router imports
import authRouter from "./routes/authRoutes.js"
import usersRouter from  "./routes/usersRoutes.js"
import chatRouter from "./routes/chatRoutes.js"

const corsOptions = {
      origin: appConfig.frontendUrl,
      credentials: true,
};

const app = express()

app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())

app.use("/auth", authRouter)
app.use("/users", usersRouter)
app.use("/chat", chatRouter)

app.use(errorHandler)

const httpServer: Server = createServer(app)

const port = appConfig.port || 5000

httpServer.listen(port, () => {
  console.log(`Server is listening to the port ${port}`)
})