import type { Request, Response, NextFunction } from "express";
import errorMapper from "../utils/error-mapper.js";

const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err);
  const mappedError = errorMapper(err);
  res.status(mappedError.statusCode).json({ error: mappedError.message });
};

export default errorHandler;
