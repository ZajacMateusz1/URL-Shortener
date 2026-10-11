import { Router } from "express";
import validate from "@/middleware/validate.js";
import checkAuth from "@/middleware/check-auth.js";
import { tokenBucket } from "@/middleware/rate-limiter.js";

import { redirectToOriginalUrl, shortenUrl } from "./url-controller.js";
import { shortenUrlSchema } from "./url-schema.js";

const urlRouter = Router();

urlRouter.post(
  "/shorten",
  tokenBucket(20, 20 / 60, "url-shorten"),
  checkAuth,
  validate(shortenUrlSchema),
  shortenUrl,
);
urlRouter.get(
  "/:shortUrl",
  tokenBucket(100, 100 / 60, "url-redirect"),
  redirectToOriginalUrl,
);

export default urlRouter;
