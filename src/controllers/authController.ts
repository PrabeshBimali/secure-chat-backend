import { NextFunction, Request, Response } from "express";
import { createEmailVerificationToken, createNewUser, createNonceForIdentity, createNonceForLogin, isUserAndDeviceValid, sendEmailVerification, verifyEmailToken, verifyIdentitySignatureForRecovery, verifyLoginSignatures } from "../services/authServices.js";
import { createErrorResponse, createSuccessResponse } from "../helpers/responseCreator.js";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../errors/HTTPErrors.js";
import * as userRepo from "../repositories/userRepository.js"
import * as deviceRepo from "../repositories/deviceRepository.js"
import { AuthRequest } from "../middlewares/requireAuth.js";
import { RecoveryChallengeRequestPayload, VerifyChallengeRequestPayload, VerifyRecoveryChallengeRequestPayload } from "../zod/schema.js";
import authConfig from "../config/authConfig.js";
import jwt from "jsonwebtoken"
import { InsertDevice } from "../models/Device.js";

interface UserInfoForClient {
  userid: number;
  username: string;
}

export async function registerUser(req: Request, res: Response, next: NextFunction) {
  try {
    const createdUser = await createNewUser(req.body)
    
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
      throw new BadRequestError()
    }

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

export async function requestChallenge(req: Request, res: Response, next: NextFunction) {
  try {

    const user = await isUserAndDeviceValid(req.body)
    const nonces = await createNonceForLogin(user.id, req.body.device_pbk, user.identity_pbk)

    const responsePayload = {
      userid: user.id,
      deviceNonce: nonces.deviceNonce,
      identityNonce: nonces.identityNonce
    }

    const response = createSuccessResponse("Sign the nonce", responsePayload)
    res.status(200).json(response)

  } catch(error) {
    next(error)
  }
}

export async function verifyChallenge(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = req.body as VerifyChallengeRequestPayload
    const isDeviceAndKeyValid = await verifyLoginSignatures(payload)

    if(!isDeviceAndKeyValid) {
      throw new UnauthorizedError("Unauthorized", {
        "fieldErrors": {
          "credentials": "The username or device provided is incorrect"
        }
      })
    }

    const user = await userRepo.findById(payload.userid)
    const device = await deviceRepo.findById(payload.device_pbk)

    if(device === null || user === null) {
      throw new NotFoundError()
    }
    
    const token = jwt.sign(
      { 
        userId: user.id, 
        username: user.username,
        device_pbk: device.device_pbk
      }, 
      authConfig.jwtSecretKey, 
      { 
        expiresIn: "1h" 
      }
    )

    const response = createSuccessResponse("Logged in!", {
      userid: user.id,
      username: user.username
    })

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000,
    })

    res.status(200).json(response)

  } catch(error) {
    next(error)
  }
}

export async function requestChallengeForRecovery(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = req.body as RecoveryChallengeRequestPayload
    const user = await userRepo.findByIdentity_pbk(payload.identity_pbk)

    if(user === null) {
      throw new NotFoundError("Not Found", {
        "fieldErrors": {
          "credentials": "No account is associated with this recovery phrase"
        }
      })
    }

    const nonce = await createNonceForIdentity(user.id, user.identity_pbk)

    const responsePayload = {
      userid: user.id,
      username: user.username,
      nonce: nonce
    }
    
    const response = createSuccessResponse("Sign the nonce", responsePayload)
    res.status(200).json(response)
    
  } catch(error) {
    next(error)
  }
}

export async function verifyChallegeForRecovery(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = req.body as VerifyRecoveryChallengeRequestPayload
    const user = await userRepo.findById(payload.userid)

    if(user === null) {
      throw new NotFoundError("Not Found", {
        "fieldErrors": {
          "credentials": "No account is associated with this recovery phrase"
        }
      })
    }

    const isIdentityValid = await verifyIdentitySignatureForRecovery(user.id, user.identity_pbk, payload.signature)

    if(!isIdentityValid) {
      throw new BadRequestError("Bad Request", {
        "fieldErrors": {
          "credentials": "Seed phrase could not be verified"
        }
      })
    }

    const device: InsertDevice = {
      device_name: payload.device.name,
      os: payload.device.os,
      browser: payload.device.browser,
      device_pbk: payload.device.device_pbk,
      userid: user.id
    }

    await deviceRepo.insert(device)
    
    const token = jwt.sign(
      { 
        userId: user.id, 
        username: user.username,
        device_pbk: device.device_pbk
      }, 
      authConfig.jwtSecretKey, 
      { 
        expiresIn: "1h" 
      }
    )

    const response = createSuccessResponse("Logged in!", {
      userid: user.id,
      username: user.username
    })

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000,
    })

    res.status(200).json(response)
    
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