import dotenv from "dotenv"

if(process.env.NODE_ENV === "development") {
  const dotenvResult = dotenv.config()

  if(dotenvResult.error) {
    console.error(dotenvResult.error)
    process.exit(-1)
  }
}

const authConfig = {
  jwtSecretKey: process.env.JWT_SECRET_KEY as string,
  serverEmail: process.env.SERVER_EMAIL as string,
  serverEmailPwd: process.env.SERVER_EMAIL_PWD as string,
}

export default authConfig