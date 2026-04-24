import { Request } from "express";
import { UnauthorizedError } from "../../errors/HTTPErrors.js";
import { AuthData } from "../../middlewares/requireAuth.js";

export function assertAuth(req: Request): AuthData {
  const authData = (req as any).auth

  if (!authData) {
    throw new UnauthorizedError()
  }

  return authData as AuthData
}