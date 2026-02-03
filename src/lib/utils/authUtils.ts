import { Request } from "express";
import { UnauthorizedError } from "../../errors/HTTPErrors.js";

export function assertAuth(req: Request): number {
  const userId = (req as any).userId

  if (!userId) {
    throw new UnauthorizedError()
  }

  return userId as number
}