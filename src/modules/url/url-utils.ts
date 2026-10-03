import crypto from "crypto";

export const generateShortUrl = (): string => {
  return crypto.randomBytes(6).toString("base64url");
};
