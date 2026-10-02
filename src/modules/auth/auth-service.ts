import * as argon2 from "argon2";
import crypto from "node:crypto";
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
} from "./auth-repository.js";

import type { SingUpSchemaType } from "./auth-schema.js";

export const singUpService = async (data: SingUpSchemaType) => {
  const hashedPassword = await argon2.hash(data.password);
  data.password = hashedPassword;
  const verificationToken = crypto.randomBytes(32).toString("hex");
  const result = await db.transaction(async (tx) => {
    const user = await signUpRepository(data, tx);
    await createUserVerificationTokenRepository(
      user.id,
      crypto.createHash("sha256").update(verificationToken).digest("hex"),
      tx,
    );
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
