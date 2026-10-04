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
    const { sub } = req.userData!;
    const response = await shortenUrlService(originalUrl, sub);
    res.status(201).json(response);
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
    const response = await redirectToOriginalUrlService(shortUrl);
    res.status(301).redirect(response);
  } catch (error) {
    next(error);
  }
};
