import { Router } from "express";
import validate from "@/middleware/validate.js";
import checkAuth from "@/middleware/check-auth.js";

import { redirectToOriginalUrl, shortenUrl } from "./url-controller.js";
import { shortenUrlSchema } from "./url-schema.js";

const urlRouter = Router();

urlRouter.post("/shorten", checkAuth, validate(shortenUrlSchema), shortenUrl);
urlRouter.get("/:shortUrl", redirectToOriginalUrl);

export default urlRouter;
