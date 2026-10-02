import { Router } from "express";
import {
  singup,
  verifyEmail,
  resendVerificationEmail,
  login,
  logout,
} from "./auth-controller.js";
import validate from "@/middleware/validate.js";
import {
  singUpSchema,
  resendVerificationEmailSchema,
  loginSchema,
} from "./auth-schema.js";

const authRouter = Router();

authRouter.post("/singup", validate(singUpSchema), singup);
authRouter.get("/verify-email/:token", verifyEmail);
authRouter.post(
  "/verify-email/resend",
  validate(resendVerificationEmailSchema),
  resendVerificationEmail,
);
authRouter.post("/login", validate(loginSchema), login);
authRouter.post("/logout", logout);

export default authRouter;
