import type { Request, Response, NextFunction } from "express";
import errorMapper from "../utils/error-mapper.js";

const errorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (res.headersSent) {
    return next(error);
  }
  console.error(error);
  const mappedError = errorMapper(error);
  res
    .status(mappedError.statusCode)
    .json({ error: mappedError.message, details: mappedError.details });
};

export default errorHandler;
