import * as argon2 from "argon2";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { env } from "@/config/env.js";
import { db } from "@/prisma/db.js";

import HTTPError from "@/errors/http-error.js";
import {
  sendVerificationEmail,
  sendWelcomeEmail,
} from "@/modules/email/send-email.js";
import {
  signUpRepository,
  createUserVerificationTokenRepository,
  findUserVerification,
  updateVerificationStatus,
  deleteVerificationToken,
  findUserToResendEmail,
} from "./auth-repository.js";
import { createVerificationToken } from "./auth-utils.js";

import type { SingUpSchemaType } from "./auth-schema.js";

export const singUpService = async (data: SingUpSchemaType) => {
  const hashedPassword = await argon2.hash(data.password);
  data.password = hashedPassword;
  const { verificationToken, hashedToken } = await createVerificationToken();
  const result = await db.transaction(async (tx) => {
    const user = await signUpRepository(data, tx);
    await createUserVerificationTokenRepository(user.id, hashedToken, tx);
    return user;
  });
  const jwtToken = jwt.sign({ id: result.id }, env.JWT_SECRET, {
    expiresIn: "7d",
  });
  await sendWelcomeEmail(data.email);
  await sendVerificationEmail(data.email, verificationToken);
  return {
    response: { ...result, password: undefined },
    token: jwtToken,
  };
};

export const verifyEmailService = async (token: string) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const verificationRecord = await findUserVerification(hashedToken);
  if (verificationRecord === null) throw new HTTPError("Token not found", 404);
  if (verificationRecord.expiresAt < new Date().toISOString())
    throw new HTTPError("Token expired", 400);
  await db.transaction(async (tx) => {
    await updateVerificationStatus(verificationRecord.userId, tx);
    await deleteVerificationToken(verificationRecord.userId, tx);
  });
};

export const resendVerificationEmailService = async (email: string) => {
  const user = await findUserToResendEmail(email);
  if (!user) throw new HTTPError("User not found or already verified", 404);
  const { verificationToken, hashedToken } = await createVerificationToken();
  await db.transaction(async (tx) => {
    await deleteVerificationToken(user.id, tx);
    await createUserVerificationTokenRepository(user.id, hashedToken, tx);
  });
  await sendVerificationEmail(user.email, verificationToken);
};
