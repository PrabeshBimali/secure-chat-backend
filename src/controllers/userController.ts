import { NextFunction, Request, Response } from "express";
import { validateEmail, validatePassword, validateUsername } from "../helpers/userValidation.js";
import { createNewUser } from "../services/userServices.js";
import { createSuccessResponse } from "../helpers/responseCreator.js";

export async function registerUser(req: Request, res: Response, next: NextFunction) {
  try {
    const {username, email, password} = req.body

    validateUsername(username)
    validateEmail(email)
    validatePassword(password)

    await createNewUser(username, email, password)

    const response = createSuccessResponse("User Created!")
    res.status(201).json(response)

  } catch(error) {
    next(error)
  }
}