import type { Request, Response, NextFunction } from "express";

import { singUpService } from "./auth-service.js";

import type { SingUpSchemaType } from "./auth-schema.js";

export const singUp = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data: SingUpSchemaType = req.body;
    const { response, token } = await singUpService(data);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};
