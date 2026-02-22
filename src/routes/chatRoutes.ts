import { NextFunction, Response, Router } from "express";
import requireAuth, { AuthRequest } from "../middlewares/requireAuth.js";
import { getChatContext, sendNewMessage } from "../controllers/chatController.js";
import { validateRequestBody, validateRequestParams } from "../middlewares/validate.js";
import { SendMessageRequestSchema, UserIdParamsSchema } from "../zod/schema.js";

const router = Router()

// protected routes
router.get("/:userid", requireAuth, validateRequestParams(UserIdParamsSchema), async (req: AuthRequest, res: Response, next: NextFunction) => {
 await getChatContext(req, res, next)
})

router.post("/new", requireAuth, validateRequestBody(SendMessageRequestSchema), async (req: AuthRequest, res: Response, next: NextFunction) => {
  await sendNewMessage(req, res, next)
})

export default router