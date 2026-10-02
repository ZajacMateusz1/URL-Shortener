import { Router } from "express";
import {
  singup,
  verifyEmail,
  resendVerificationEmail,
  login,
  logout,
  resetPassword,
} from "./auth-controller.js";
import validate from "@/middleware/validate.js";
import { singUpSchema, emailSchema, loginSchema } from "./auth-schema.js";

const authRouter = Router();

authRouter.post("/singup", validate(singUpSchema), singup);
authRouter.get("/verify-email/:token", verifyEmail);
authRouter.post(
  "/verify-email/resend",
  validate(emailSchema),
  resendVerificationEmail,
);
authRouter.post("/login", validate(loginSchema), login);
authRouter.post("/logout", logout);
authRouter.post("/reset-password", validate(emailSchema), resetPassword);

export default authRouter;
