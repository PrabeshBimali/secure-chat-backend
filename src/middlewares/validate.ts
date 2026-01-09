import * as z from "zod"
import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../errors/HTTPErrors.js";

export const validate = (schema: z.ZodObject<any, any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    
    const result = schema.safeParse(req.body);
    
    if (!result.success) {
      throw new BadRequestError("Bad Request", z.flattenError(result.error))
    }
    
    next();
  };
};