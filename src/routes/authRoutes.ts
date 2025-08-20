import { NextFunction, Request, Response, Router } from "express";
import { registerUser, sendEmailVerificationLink } from "../controllers/authController.js";

const router = Router()

router.post("/register", async (req: Request, res: Response, next: NextFunction) => {
  await registerUser(req, res, next)
})

router.post("/send-verification-email", async (req: Request, res: Response, next: NextFunction) => {
  await sendEmailVerificationLink(req, res, next)
})
export default router