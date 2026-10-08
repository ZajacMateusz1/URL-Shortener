import * as argon2 from "argon2";
import { db } from "../../src/prisma/db";

export const createTestUser = async (userData: {
  email: string;
  password: string;
  username: string;
}) => {
  const hashedPassword = await argon2.hash(userData.password);
  return await db.orm.public.User.create({
    ...userData,
    password: hashedPassword,
    isVerified: false,
  });
};
