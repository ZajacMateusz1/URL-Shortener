import type { Request, Response, NextFunction } from "express";
import type { ZodObject } from "zod";

const validate = (schema: ZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedData = schema.parse(req.body);
      req.body = parsedData;
      next();
    } catch (error) {
      next(error);
    }
  };
};
