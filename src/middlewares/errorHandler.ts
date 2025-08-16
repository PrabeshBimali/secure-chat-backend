import { NextFunction, Request, Response } from "express"
import { BadRequestError, HTTPError, ServerError } from "../errors/HTTPErrors.js"
import { createErrorResponse } from "../helpers/responseCreator.js"

export function errorHandler(error: Error, req: Request, res: Response, next: NextFunction) {
  if(error instanceof BadRequestError) {
    const response = createErrorResponse(error.message, error.field)
    return res.status(error.statusCode).json(response)
  }

  if(error instanceof HTTPError) {
    const response = createErrorResponse(error.message)
    return res.status(error.statusCode).json(response)
  }
  
  const serverError = new ServerError()
  const response = createErrorResponse(serverError.message)
  console.error(error)
  return res.status(serverError.statusCode).json(response)
}