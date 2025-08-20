import dotenv from "dotenv"

if(process.env.NODE_ENV === "development") {
  const dotenvResult = dotenv.config()

  if(dotenvResult.error) {
    console.error(dotenvResult.error)
    process.exit(-1)
  }
}

const appConfig = {
  frontendUrl: process.env.FRONTEND_URL as string,
  port: Number(process.env.PORT)
}

export default appConfig