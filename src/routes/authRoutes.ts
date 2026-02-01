import { NextFunction, Request, Response, Router } from "express";
import { requestChallenge, me, registerUser, sendEmailVerificationLink, verifyEmail, verifyChallenge, requestChallengeForRecovery, verifyChallegeForRecovery } from "../controllers/authController.js";
import requireAuth from "../middlewares/requireAuth.js";
import { validateRequestBody } from "../middlewares/validate.js";
import { ChallengeRequestSchema, RecoveryChallengeRequestSchema, RegistrationRequestSchema, VerifyChallengeRequestSchema, VerifyRecoveryChallengeRequestSchema } from "../zod/schema.js";

const router = Router()

// public routes
router.post("/register", validateRequestBody(RegistrationRequestSchema), async (req: Request, res: Response, next: NextFunction) => {
  await registerUser(req, res, next)
})

router.post("/send-verification-email", async (req: Request, res: Response, next: NextFunction) => {
  await sendEmailVerificationLink(req, res, next)
})

router.post("/verify-email", async (req: Request, res: Response, next: NextFunction) => {
  await verifyEmail(req, res, next)
})

router.post("/request-challenge", validateRequestBody(ChallengeRequestSchema), async (req: Request, res: Response, next: NextFunction) => {
  await requestChallenge(req, res, next)
})

router.post("/verify-challenge", validateRequestBody(VerifyChallengeRequestSchema), async (req: Request, res: Response, next: NextFunction) => {
  await verifyChallenge(req, res, next)
})

router.post("/recovery/request", validateRequestBody(RecoveryChallengeRequestSchema), async (req: Request, res: Response, next: NextFunction) => {
  await requestChallengeForRecovery(req, res, next)
})

router.post("/recovery/verify", validateRequestBody(VerifyRecoveryChallengeRequestSchema), async (req: Request, res: Response, next: NextFunction) => {
  await verifyChallegeForRecovery(req, res, next)
})

// protected routes

router.get("/me", requireAuth ,async (req: Request, res: Response, next: NextFunction) => {
  await me(req, res, next)
})

export default router