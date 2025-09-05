import { NextFunction, Request, Response } from "express";
import { validateEmail, validatePassword, validateUsername } from "../helpers/userValidation.js";
import { createEmailVerificationToken, createNewUser, getUserWithValidCredentials, sendEmailVerification, verifyEmailToken } from "../services/authServices.js";
import { createErrorResponse, createSuccessResponse } from "../helpers/responseCreator.js";
import { BadRequestError, NotFoundError } from "../errors/HTTPErrors.js";
import jwt from "jsonwebtoken";
import * as userRepo from "../repositories/userRepository.js"
import authConfig from "../config/authConfig.js";
import { AuthRequest } from "../middlewares/requireAuth.js";

interface UserInfoForClient {
  userid: number;
  username: string;
}

export async function registerUser(req: Request, res: Response, next: NextFunction) {
  try {
    const {username, email, password} = req.body

    validateUsername(username.trim())
    validateEmail(email.trim())
    validatePassword(password.trim())

    const createdUser = await createNewUser(username, email, password)
    
    const response = createSuccessResponse("User Registered!", createdUser)
    res.status(201).json(response)
  } catch(error) {
    next(error)
  }
}

export async function sendEmailVerificationLink(req: Request, res: Response, next: NextFunction) {
  try {
    const { id, email } = req.body

    if(!Number(id)) {
      throw new BadRequestError("User id is required", "id")
    }

    validateEmail(email.trim())

    const user = await userRepo.findById(id)

    if(!user) {
      throw new BadRequestError("User not found!")
    }

    if(user.email_verified) {
      const response = createErrorResponse("This Email is already Verified!")
      return res.status(409).json(response)
    }

    const token = await createEmailVerificationToken(id, email)
    await sendEmailVerification(email, token)

    const response = createSuccessResponse("Email Sent.")
    res.status(200).json(response)

  } catch(error) {
    next(error)
  }
}

export async function verifyEmail(req: Request, res: Response, next: NextFunction) {
  try {
    const { token } = req.body

    if(!token.trim()) {
      throw new BadRequestError("Invalid or Expired verification link")
    }

    await verifyEmailToken(token)

    const response = createSuccessResponse("Email Verified Successfully!")
    res.status(200).json(response)

  } catch(error) {
    next(error)
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const {email, password} = req.body

    validateEmail(email.trim())
    validatePassword(password.trim())

    const validUser = await getUserWithValidCredentials(email, password)

    if(!validUser.email_verified) {
      const response = createSuccessResponse("Email not Verified!. Redirecting...", {
        email: validUser.email,
        id: validUser.id
      })
      return res.status(403).json(response)
    }

    const token = jwt.sign({ userId: validUser.id }, authConfig.jwtSecretKey, { expiresIn: "1h" })
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000,
    })

    const userInfo: UserInfoForClient = {
      userid: validUser.id,
      username: validUser.username
    }

    const response = createSuccessResponse("Logged in...", userInfo)
    return res.status(200).json(response)    
  } catch(error) {
    next(error)
  }
}

export async function me(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userid = req.userId

    if(!userid) {
      throw new NotFoundError("User not Found")
    }

    const user = await userRepo.findById(userid)

    if(!user) {
      throw new NotFoundError("User not Found")
    }

    const userInfo: UserInfoForClient = {
      userid: user.id,
      username: user.username
    }

    const response = createSuccessResponse("Authenticated!", userInfo)

    res.status(200).json(response)

  } catch(error) {
    next(error)
  }
}