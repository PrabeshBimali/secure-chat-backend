import bcrypt from "bcrypt"
import { insertUser } from "../repositories/userRepository.js"
import { CreatedUser, CreateUserInput } from "../models/User.js"
import { DatabaseError } from "pg"
import { BadRequestError } from "../errors/HTTPErrors.js"
import { EmailVerificationToken } from "../models/Token.js"
import jwt from "jsonwebtoken"
import nodemailer from "nodemailer"
import authConfig from "../config/authConfig.js"
import appConfig from "../config/appConfig.js"
import { insertToken } from "../repositories/tokenRepository.js"

const emailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: authConfig.serverEmail,
        pass: authConfig.serverEmailPwd
    }
});

export async function createNewUser(username: string, email: string, password: string): Promise<CreatedUser> {
  try{
    const salt = await bcrypt.genSalt()
    const password_hash = await bcrypt.hash(password, salt)

    const newUser: CreateUserInput = {
      username,
      email,
      password_hash
    }

    const createdUser = await insertUser(newUser)
    return createdUser
  } catch(error) {

    if(error instanceof DatabaseError) {
      if(error.constraint === "unique_email") {
        throw new BadRequestError("Email Already Exists", "email")
      }

      if(error.constraint === "unique_username") {
        throw new BadRequestError("Username Already Exists", "username")
      }
    }

    throw error
  }
}

export async function createEmailVerificationToken(userId: number, email: string): Promise<string> {
  const tokenId = crypto.randomUUID()

  const token = jwt.sign({
      userId,
      email
    }, 
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

  await insertToken(tokenInfo)
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

