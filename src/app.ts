import express from "express";
import errorHandler from "@/middleware/error-handler.js";
import HttpError from "@/errors/http-error.js";

import authRouter from "@/modules/auth/auth-routes.js";
import urlRouter from "@/modules/url/url-routes.js";

const app = express();

app.use(express.json());
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRouter);
app.use("/api/urls", urlRouter);

app.use((req, res, next) => {
  next(new HttpError("Endpoint not found", 404));
});

app.use(errorHandler);

export default app;
