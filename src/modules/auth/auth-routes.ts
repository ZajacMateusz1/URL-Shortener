import { Router } from "express";
import {
  singUp,
  verifyEmail,
  resendVerificationEmail,
} from "./auth-controller.js";
import validate from "@/middleware/validate.js";
import { singUpSchema, resendVerificationEmailSchema } from "./auth-schema.js";

const authRouter = Router();

authRouter.post("/singup", validate(singUpSchema), singUp);
authRouter.get("/verify-email/:token", verifyEmail);
authRouter.post(
  "/verify-email/resend",
  validate(resendVerificationEmailSchema),
  resendVerificationEmail,
);

export default authRouter;
