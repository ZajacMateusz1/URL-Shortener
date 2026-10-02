import { db, type Tx } from "@/prisma/db.js";
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
  const result = await tx.orm.public.UserVerification.create({
    userId,
    tokenHash: token,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  });
  return result;
};

export const findUserVerification = (hashedToken: string) => {
  return db.orm.public.UserVerification.where({
    tokenHash: hashedToken,
  }).first();
};

export const updateVerificationStatus = async (userId: number, tx: Tx) => {
  return tx.orm.public.User.where({ id: userId }).update({ isVerified: true });
};

export const deleteVerificationToken = async (userId: number, tx: Tx) => {
  return tx.orm.public.UserVerification.where({ userId }).delete();
};

export const resendVerificationEmailRepository = async (email: string) => {};

export const findUserToResendEmail = async (email: string) => {
  return db.orm.public.User.select("id", "email")
    .where({ email, isVerified: false })
    .first();
};

export const getUserByEmail = async (email: string) => {
  return db.orm.public.User.where({ email }).first();
};

export const resetPasswordRepository = async (
  userId: number,
  hashedToken: string,
) => {
  return db.orm.public.PasswordReset.create({
    userId,
    tokenHash: hashedToken,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  });
};
