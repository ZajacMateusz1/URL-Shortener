import { Router } from "express";
import {
  signup,
  verifyEmail,
  resendVerificationEmail,
  login,
  logout,
  resetPassword,
  changePassword,
} from "./auth-controller.js";
import validate from "@/middleware/validate.js";
import { tokenBucket } from "@/middleware/rate-limiter.js";
import {
  signUpSchema,
  emailSchema,
  loginSchema,
  passwordSchema,
} from "./auth-schema.js";

const authRouter = Router();

authRouter.post(
  "/signup",
  tokenBucket(5, 5 / (60 * 60), "auth-signup"),
  validate(signUpSchema),
  signup,
);
authRouter.get(
  "/verify-email/:token",
  tokenBucket(5, 5 / (60 * 60), "auth-verify-email"),
  verifyEmail,
);
authRouter.post(
  "/verify-email/resend",
  tokenBucket(3, 3 / (60 * 60), "auth-resend-verification"),
  validate(emailSchema),
  resendVerificationEmail,
);
authRouter.post(
  "/login",
  tokenBucket(5, 5 / 60, "auth-login"),
  validate(loginSchema),
  login,
);
authRouter.post("/logout", tokenBucket(5, 5 / 60, "auth-logout"), logout);
authRouter.post(
  "/reset-password",
  tokenBucket(3, 3 / (60 * 60), "auth-reset-password"),
  validate(emailSchema),
  resetPassword,
);
authRouter.post(
  "/reset-password/:token",
  tokenBucket(5, 5 / (60 * 60), "auth-change-password"),
  validate(passwordSchema),
  changePassword,
);

export default authRouter;
