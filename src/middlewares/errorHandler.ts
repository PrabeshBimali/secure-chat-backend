import { NextFunction, Request, Response } from "express"
import { BadRequestError, ForbiddenError, HTTPError, NotFoundError, ServerError, UnauthorizedError } from "../errors/HTTPErrors.js"
import { createErrorResponse } from "../helpers/responseCreator.js"

// refactor it and make it short
export function errorHandler(error: Error, req: Request, res: Response, next: NextFunction) {
  if(error instanceof BadRequestError) {
    console.error(error)
    const response = createErrorResponse(error.message, error.details)
    return res.status(error.statusCode).json(response)
  }

  if(error instanceof HTTPError ||
    error instanceof ForbiddenError ||
    error instanceof NotFoundError ||
    error instanceof UnauthorizedError
  ) {
    const response = createErrorResponse(error.message)
    return res.status(error.statusCode).json(response)
  }
  
  const serverError = new ServerError()
  const response = createErrorResponse(serverError.message)
  console.error(error)
  return res.status(serverError.statusCode).json(response)
}