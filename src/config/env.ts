import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.url("Database URL must be a valid URL"),
  JWT_SECRET: z.string().trim().min(1, "JWT secret must be provided"),
  RESEND_API_KEY: z.string().trim().min(1, "Resend API key must be provided"),
});

export const env = envSchema.parse(process.env);
