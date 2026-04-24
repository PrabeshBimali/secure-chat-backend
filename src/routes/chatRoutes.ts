import { NextFunction, Response, Router } from "express";
import requireAuth, { AuthRequest } from "../middlewares/requireAuth.js";
import { getChatContext, getChatHistory, sendNewMessage } from "../controllers/chatController.js";
import { validateQueryString, validateRequestBody, validateRequestParams } from "../middlewares/validate.js";
import { HistoryQueryStringSchema, SendMessageRequestSchema, UserIdParamsSchema } from "../zod/schema.js";

const router = Router()

// protected routes
router.get("/history", requireAuth, validateQueryString(HistoryQueryStringSchema), async (req: AuthRequest, res: Response, next: NextFunction) => {
  await getChatHistory(req, res, next)
})

router.get("/:userid", requireAuth, validateRequestParams(UserIdParamsSchema), async (req: AuthRequest, res: Response, next: NextFunction) => {
 await getChatContext(req, res, next)
})


router.post("/new", requireAuth, validateRequestBody(SendMessageRequestSchema), async (req: AuthRequest, res: Response, next: NextFunction) => {
  await sendNewMessage(req, res, next)
})

export default router