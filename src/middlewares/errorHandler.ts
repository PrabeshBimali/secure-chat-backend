import { NextFunction, Request, Response } from "express"
import { BadRequestError, ForbiddenError, HTTPError, NotFoundError, ServerError, UnauthorizedError } from "../errors/HTTPErrors.js"
import { createErrorResponse } from "../helpers/responseCreator.js"

// refactor it and make it short
export function errorHandler(error: Error, req: Request, res: Response, next: NextFunction) {


  if(error instanceof ForbiddenError ||
    error instanceof NotFoundError ||
    error instanceof UnauthorizedError || 
    error instanceof BadRequestError) {
    const response = createErrorResponse(error.message, error.details)
    return res.status(error.statusCode).json(response)
  }
  
  console.error(error)
  const serverError = new ServerError()
  const response = createErrorResponse(serverError.message)
  return res.status(serverError.statusCode).json(response)
}