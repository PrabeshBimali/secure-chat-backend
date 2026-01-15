import { NextFunction, Request, Response, Router } from "express";
import { requestChallenge, me, registerUser, sendEmailVerificationLink, verifyEmail, verifyChallenge } from "../controllers/authController.js";
import requireAuth from "../middlewares/requireAuth.js";
import { validate } from "../middlewares/validate.js";
import { ChallengeRequestSchema, RegistrationRequestSchema } from "../zod/schema.js";

const router = Router()

// public routes
router.post("/register", validate(RegistrationRequestSchema), async (req: Request, res: Response, next: NextFunction) => {
  await registerUser(req, res, next)
})

router.post("/send-verification-email", async (req: Request, res: Response, next: NextFunction) => {
  await sendEmailVerificationLink(req, res, next)
})

router.post("/verify-email", async (req: Request, res: Response, next: NextFunction) => {
  await verifyEmail(req, res, next)
})

router.post("/request-challenge", validate(ChallengeRequestSchema), async (req: Request, res: Response, next: NextFunction) => {
  await requestChallenge(req, res, next)
})

router.post("/verify-challenge", async (req: Request, res: Response, next: NextFunction) => {
  await verifyChallenge(req, res, next)
})

// protected routes

router.get("/me", requireAuth ,async (req: Request, res: Response, next: NextFunction) => {
  await me(req, res, next)
})

export default router