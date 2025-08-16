import express from "express"
import { createServer, Server } from "http"
import authRouter from "./routes/authRoutes.js"
import dotenv from "dotenv"
import { errorHandler } from "./middlewares/errorHandler.js"

if(process.env.NODE_ENV === "development") {
  const dotenvResult = dotenv.config()

  if(dotenvResult.error) {
    throw dotenvResult.error
  }
}

const app = express()

app.use(express.json())

app.use("/auth", authRouter)

app.use(errorHandler)

const httpServer: Server = createServer(app)

const port = process.env.PORT || 5000

httpServer.listen(port, () => {
  console.log(`Server is listening to the port ${port}`)
})