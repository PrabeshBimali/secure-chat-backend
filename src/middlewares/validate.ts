import * as z from "zod"
import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../errors/HTTPErrors.js";

export function validateRequestBody(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    
    const result = schema.safeParse(req.body)
    
    if (!result.success) {
      throw new BadRequestError("Bad Request", z.flattenError(result.error))
    }
    
    next()
  }
}

export function validateRequestParams(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params)

    if(!result.success) {
      throw new BadRequestError("Bad Request", z.flattenError(result.error))
    }

    next()
  }
}