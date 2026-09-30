import { Router } from "express";
import { singUp } from "./auth-controller.js";
import validate from "@/middleware/validate.js";
import { singUpSchema } from "./auth-schema.js";

const authRouter = Router();

authRouter.post("/singup", validate(singUpSchema), singUp);

export default authRouter;
