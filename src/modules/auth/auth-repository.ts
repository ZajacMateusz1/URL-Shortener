import { type Tx } from "@/prisma/db.js";
import type { SingUpSchemaType } from "./auth-schema.js";

export const signUpRepository = async (data: SingUpSchemaType, tx: Tx) => {
  const result = await tx.orm.public.User.create({
    ...data,
    isVerified: false,
  });
  return result;
};

export const createUserVerificationTokenRepository = async (
  userId: number,
  token: string,
  tx: Tx,
) => {
  const result = await tx.orm.public.userVerification.create({
    userId,
    tokenHash: token,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  });
  return result;
};
