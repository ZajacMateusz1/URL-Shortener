import { db } from "@/prisma/db.js";
import type { SingUpSchemaType } from "./auth-schema.js";

export const signUpRepository = async (data: SingUpSchemaType) => {
  const result = await db.orm.public.User.create(data);
  return result;
};
