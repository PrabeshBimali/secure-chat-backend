import { NextFunction, Request, Response } from "express";

export async function getChatContext(req: Request, res: Response, next: NextFunction) {
  try {
    console.log(req.params)
  } catch(error) {
    next(error)
  }
}