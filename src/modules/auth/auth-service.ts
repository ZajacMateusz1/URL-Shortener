import * as argon2 from "argon2";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { env } from "@/config/env.js";
import { db } from "@/prisma/db.js";

import { sendWelcomeEmail } from "@/modules/email/send-email.js";
import {
  signUpRepository,
  createUserVerificationTokenRepository,
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
  return {
    response: { ...result, password: undefined },
    token: jwtToken,
  };
};
