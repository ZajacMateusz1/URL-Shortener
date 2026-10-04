import redisClient from "@/config/redis.js";
import HttpError from "@/errors/http-error.js";

import {
  shortenUrlRepository,
  redirectToOriginalUrlRepository,
} from "./url-repository.js";
import { generateShortUrl } from "./url-utils.js";

export const shortenUrlService = async (
  originalUrl: string,
  userId: number,
) => {
  for (let i = 0; i < 5; i++) {
    try {
      const short = generateShortUrl();
      const link = await shortenUrlRepository(originalUrl, short, userId);
      return link;
    } catch (error) {
      if ((error as { sqlState?: string }).sqlState === "23505") {
        continue;
      }
      throw error;
    }
  }
  throw new HttpError(
    "Failed to generate a unique short URL, try again later",
    500,
  );
};

export const redirectToOriginalUrlService = async (shortUrl: string) => {
  const cachedUrl = await redisClient.get(shortUrl);
  if (cachedUrl !== null) {
    return cachedUrl;
  }
  const originalUrl = await redirectToOriginalUrlRepository(shortUrl);
  if (!originalUrl) {
    throw new HttpError("Short URL not found", 404);
  }
  const expiresAt = new Date(originalUrl.expiresAt).getTime();
  const now = Date.now();
  if (expiresAt < now) {
    throw new HttpError("Short URL has expired", 410);
  }
  const expirationTime = Math.max(1, Math.floor((expiresAt - now) / 1000));
  await redisClient.set(shortUrl, originalUrl.longUrl, { EX: expirationTime });
  return originalUrl.longUrl;
};
