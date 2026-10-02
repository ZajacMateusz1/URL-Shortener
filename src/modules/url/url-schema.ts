import { z } from "zod";

export const shortenUrlSchema = z.object({
  originalUrl: z.url(),
});

export type ShortenUrlSchemaType = z.infer<typeof shortenUrlSchema>;
