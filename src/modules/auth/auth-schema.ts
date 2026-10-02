import { z } from "zod";

export const emailSchema = z.object({
  email: z.email("Incorrect email format"),
});

export const loginSchema = emailSchema.extend({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(64, "Password must be at most 64 characters")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[0-9]/, "Password must contain a number")
    .regex(/[^A-Za-z0-9]/, "Password must contain a special character"),
});

export const singUpSchema = loginSchema.extend({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(32, "Username must be at most 32 characters"),
});

export type EmailSchemaType = z.infer<typeof emailSchema>;
export type LoginSchemaType = z.infer<typeof loginSchema>;
export type SingUpSchemaType = z.infer<typeof singUpSchema>;
