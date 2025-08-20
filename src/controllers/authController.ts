import { NextFunction, Request, Response } from "express";
import { validateEmail, validatePassword, validateUsername } from "../helpers/userValidation.js";
import { createEmailVerificationToken, createNewUser, sendEmailVerification } from "../services/authServices.js";
import { createSuccessResponse } from "../helpers/responseCreator.js";

export async function registerUser(req: Request, res: Response, next: NextFunction) {
  try {
    const {username, email, password} = req.body

    validateUsername(username)
    validateEmail(email)
    validatePassword(password)

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

    validateEmail(email)

    const token = await createEmailVerificationToken(id, email)
    await sendEmailVerification(email, token)

    const response = createSuccessResponse("Email Sent.")
    res.status(200).json(response)

  } catch(error) {
    next(error)
  }
}

export async function verifyEmail(req: Request, res: Response, next: NextFunction) {

}