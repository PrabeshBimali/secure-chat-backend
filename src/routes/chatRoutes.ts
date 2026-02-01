import { NextFunction, Request, Response, Router } from "express";
import requireAuth from "../middlewares/requireAuth.js";
import { getChatContext } from "../controllers/chatController.js";

const router = Router()

// protected routes
router.get("/:userid", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
 await getChatContext(req, res, next)
})

export default router