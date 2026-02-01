import { NextFunction, Request, Response, Router } from "express";
import requireAuth from "../middlewares/requireAuth.js";
import { validateRequestBody } from "../middlewares/validate.js";
import { SearchUsersRequestSchema } from "../zod/schema.js";
import { searchUsers } from "../controllers/userController.js";

const router = Router()

// protected routes

//TODO: change this to GET
router.post("/search", requireAuth, validateRequestBody(SearchUsersRequestSchema), async (req: Request, res: Response, next: NextFunction) => {
  await searchUsers(req, res, next)
})

export default router