import express from "express";
import errorHandler from "./middleware/error-handler.js";
import HttpError from "./errors/http-error.js";

const app = express();

app.use(express.json());
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use((req, res, next) => {
  next(new HttpError(404, "Not Found"));
});

app.use(errorHandler);

export default app;
