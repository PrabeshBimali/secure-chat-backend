import * as userRepo from "../repositories/userRepository.js"
import * as deviceRepo from "../repositories/deviceRepository.js"
import * as tokenRepo from "../repositories/tokenRepository.js"
import { CreatedUser, InsertUser } from "../models/User.js"
import { DatabaseError } from "pg"
import { BadRequestError, ForbiddenError } from "../errors/HTTPErrors.js"
import { EmailVerificationToken } from "../models/Token.js"
import jwt, { JwtPayload } from "jsonwebtoken"
import nodemailer from "nodemailer"
import authConfig from "../config/authConfig.js"
import appConfig from "../config/appConfig.js"
import db from "../config/db.js"
import { InsertDevice } from "../models/Device.js"
import { LoginRequestPayload, RegistrationRequestPayload } from "../zod/schema.js"
import redisClient from "../config/redisClient.js"

interface EmailVerificationJWTPayload extends JwtPayload {
  userId: number
  tokenId: string
  email: string
}

const emailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: authConfig.serverEmail,
        pass: authConfig.serverEmailPwd
    }
});

export async function createNewUser(userInfo: RegistrationRequestPayload): Promise<CreatedUser> {
  const client = await db.connect()

  const user: InsertUser = {
    username: userInfo.username,
    email: userInfo.email,
    identity_pbk: userInfo.identity_pbk,
    encryption_pbk: userInfo.encryption_pbk
  }

  try{

    await client.query("BEGIN")
    const createdUser = await userRepo.insert(client, user)
    console.log(createdUser)

    const device: InsertDevice = {
      device_name: userInfo.device.name,
      device_pbk: userInfo.device.device_pbk,
      os: userInfo.device.os,
      browser: userInfo.device.browser,
      userid: createdUser.id
    }

    await deviceRepo.insert(client, device)
    await client.query("COMMIT")

    return createdUser
  } catch(error) {

    await client.query("ROLLBACK")

    if(error instanceof DatabaseError) {
      if(error.constraint === "unique_email") {
        throw new BadRequestError("Bad Request", {
          "fieldErrors": {
            "email": "Email Already Exists"
          }
        });
      }

      if(error.constraint === "unique_username") {
        throw new BadRequestError("Bad Request", {
          "fieldErrors": {
            "username": "Username Already Exists"
          }
        })
      }
    }

    throw error
  
  } finally {
    client.release()
  }
}

export async function isUserAndDeviceValid(loginInfo: LoginRequestPayload): Promise<number> {
  const user = await userRepo.findByUsername(loginInfo.username)

  if(!user) {
    throw new BadRequestError("Invalid Username", {
      "fieldErrors": {
        "credentials": "The username or device provided is incorrect"
      }
    })
  }

  if(!user.email_verified) {
    throw new ForbiddenError("Email not Verified", {
        "fieldErrors": {
          "email": "Please verify your email address before logging in."
        }
    })
  }

  const deviceExist = await deviceRepo.existsForUser(loginInfo.device_pbk, user.id)

  if(!deviceExist) {
    throw new ForbiddenError("Device not linked", {
      "fieldErrors": {
        "device": "This device has not been authorized for this account."
      }
    })
  }

  return user.id
}

export async function createNonceForSigning(userid: number, device_pbk: string): Promise<string> {

  const array = new Uint8Array(32)
  const randomArray = crypto.getRandomValues(array)

  const nonce = Buffer.from(randomArray).toString("hex")

  const TTL = 180
  await redisClient.setEx(`auth_nonce:${userid}:${device_pbk}`, TTL, nonce)

  return nonce
}

export async function createEmailVerificationToken(userId: number, email: string): Promise<string> {
  const tokenId = crypto.randomUUID()

  const jwtPayload: EmailVerificationJWTPayload = {
    tokenId: tokenId,
    userId: userId,
    email: email
  }

  const token = jwt.sign(
    jwtPayload, 
    authConfig.jwtSecretKey, 
    {
      expiresIn: '15m'
    }
  );

  const expiretime = new Date(Date.now() + 15 * 60 * 1000)

  const tokenInfo: EmailVerificationToken = {
    id: tokenId,
    userid: userId,
    token: token,
    expires_at: expiretime
  }

  await tokenRepo.insertToken(tokenInfo)
  return token
}

export async function sendEmailVerification(email: string, token: string) {
  const verificationUrl = `${appConfig.frontendUrl}?token=${token}`;
  const mailOptions = {
      from: authConfig.serverEmail,
      to: email,
      subject: 'Verify Your Email',
      html: `<h2>Please click the following link to verify your email:</h2>
              <div> 
                <a href="${verificationUrl}">${verificationUrl}</a>
              </div>
            `
  };
  await emailTransporter.sendMail(mailOptions);
}

export async function verifyEmailToken(token: string) {
  try {
    const decoded = jwt.verify(token, authConfig.jwtSecretKey) as EmailVerificationJWTPayload
    const {tokenId, userId, email} = decoded

    if(!tokenId || !userId || !email) {
      throw new BadRequestError("Invalid or Expired Verification link")
    }

    const tokenRecord = await tokenRepo.findByIdAndUserId(tokenId, userId) 

    if(!tokenRecord) {
      throw new BadRequestError("Invalid or Expired Verification link")
    }

    if(tokenRecord.expires_at < new Date()) {
      throw new BadRequestError("Verification link has Expired")
    }

    await userRepo.updateEmailVerifiedById(userId, true)
    await tokenRepo.deleteById(tokenId)  

  } catch(error) {
    if(error instanceof jwt.JsonWebTokenError) {
      throw new BadRequestError("Invalid or Expired Verification link")
    }

    throw error
  }
}

