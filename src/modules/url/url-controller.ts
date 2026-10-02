import type { Request, Response, NextFunction } from "express";

import HttpError from "@/errors/http-error.js";
import {
  shortenUrlService,
  redirectToOriginalUrlService,
} from "./url-service.js";

import type { ShortenUrlSchemaType } from "./url-schema.js";

export const shortenUrl = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { originalUrl }: ShortenUrlSchemaType = req.body;
    const response = await shortenUrlService(originalUrl);
    res.sendStatus(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const redirectToOriginalUrl = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { shortUrl } = req.params;
    if (typeof shortUrl !== "string") {
      throw new HttpError("Invalid short URL", 400);
    }
  } catch (error) {
    next(error);
  }
};
