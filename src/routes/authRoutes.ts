import { NextFunction, Request, Response, Router } from "express";
import { registerUser } from "../controllers/userController.js";

const router = Router()

router.post("/register", async (req: Request, res: Response, next: NextFunction) => {
  await registerUser(req, res, next)
})

export default router