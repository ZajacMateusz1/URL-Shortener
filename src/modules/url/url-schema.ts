import { z } from "zod";

export const shortenUrlSchema = z.object({
  originalUrl: z.httpUrl(),
});

export type ShortenUrlSchemaType = z.infer<typeof shortenUrlSchema>;
