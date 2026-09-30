import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
import { env } from "@/config/env.js";

import { signUpRepository } from "./auth-repository.js";

import type { SingUpSchemaType } from "./auth-schema.js";

export const singUpService = async (data: SingUpSchemaType) => {
  const hashedPassword = await argon2.hash(data.password);
  data.password = hashedPassword;
  const result = await signUpRepository(data);
  const token = jwt.sign({ id: result.id }, env.JWT_SECRET, {
    expiresIn: "1d",
  });
  return { response: { ...result, password: undefined }, token };
};
