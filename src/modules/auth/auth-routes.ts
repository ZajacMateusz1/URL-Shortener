import { Router } from "express";
import { singUp, verifyEmail } from "./auth-controller.js";
import validate from "@/middleware/validate.js";
import { singUpSchema } from "./auth-schema.js";

const authRouter = Router();

authRouter.post("/singup", validate(singUpSchema), singUp);
authRouter.get("/verify-email/:token", verifyEmail);

export default authRouter;
