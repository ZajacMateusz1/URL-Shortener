import { env } from "@/config/env";
import crypto from "crypto";
import jwt from "jsonwebtoken";

export const createVerificationToken = async () => {
  const verificationToken = crypto.randomBytes(32).toString("hex");
  return {
    verificationToken,
    hashedToken: crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex"),
  };
};

export const createJWTToken = (userId: number) => {
  return jwt.sign({ id: userId }, env.JWT_SECRET, {
    expiresIn: "7d",
  });
};
