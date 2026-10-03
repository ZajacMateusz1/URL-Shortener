import { db } from "@/prisma/db.js";

export const shortenUrlRepository = (
  originalUrl: string,
  shortUrl: string,
  userId: number,
) => {
  return db.orm.public.Link.create({
    shortUrl,
    longUrl: originalUrl,
    ownerId: userId,
    expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
  });
};

export const redirectToOriginalUrlRepository = (shortUrl: string) => {
  return db.orm.public.Link.select("longUrl", "expiresAt")
    .where({ shortUrl })
    .first();
};
