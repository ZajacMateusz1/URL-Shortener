import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { env } from "@/config/env.js";
import HttpError from "@/errors/http-error.js";

import type { UserDataType } from "@/types/index.js";

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    throw new HttpError("Unauthorized", 401);
  }
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as UserDataType;
    req.userData = decoded;
    next();
  } catch (error) {
    console.error(error);
    throw new HttpError("Unauthorized", 401);
  }
};

export default checkAuth;
