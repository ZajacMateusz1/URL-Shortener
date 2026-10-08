import { db } from "../../src/prisma/db";
import { generateShortUrl } from "../../src/modules/url/url-utils";

export const createTestShortUrl = async (
  originalUrl: string,
  userId: number,
) => {
  const shortUrl = generateShortUrl();
  return db.orm.public.Link.create({
    shortUrl,
    longUrl: originalUrl,
    ownerId: userId,
    expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
  });
};
