import { NextFunction, Request, Response, Router } from "express";
import { login, me, registerUser, sendEmailVerificationLink, verifyEmail } from "../controllers/authController.js";
import requireAuth from "../middlewares/requireAuth.js";

const router = Router()

// public routes
router.post("/register", async (req: Request, res: Response, next: NextFunction) => {
  await registerUser(req, res, next)
})

router.post("/send-verification-email", async (req: Request, res: Response, next: NextFunction) => {
  await sendEmailVerificationLink(req, res, next)
})

router.post("/verify-email", async (req: Request, res: Response, next: NextFunction) => {
  await verifyEmail(req, res, next)
})

router.post("/login", async (req: Request, res: Response, next: NextFunction) => {
  await login(req, res, next)
})


// protected routes

router.get("/me", requireAuth ,async (req: Request, res: Response, next: NextFunction) => {
  await me(req, res, next)
})

export default router