import { NextFunction, Request, Response, Router } from "express";
import requireAuth from "../middlewares/requireAuth.js";
import { getConversationListForUser } from "../controllers/roomController.js";

const router = Router()

// protected routes
router.get("/list", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  await getConversationListForUser(req, res, next)
})

export default router