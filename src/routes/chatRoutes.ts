import { NextFunction, Response, Router } from "express";
import requireAuth, { AuthRequest } from "../middlewares/requireAuth.js";
import { getChatContext } from "../controllers/chatController.js";
import { validateRequestParams } from "../middlewares/validate.js";
import { UserIdParamsSchema } from "../zod/schema.js";

const router = Router()

// protected routes
router.get("/:userid", requireAuth, validateRequestParams(UserIdParamsSchema), async (req: AuthRequest, res: Response, next: NextFunction) => {
 await getChatContext(req, res, next)
})

export default router