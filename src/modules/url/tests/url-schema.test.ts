import { describe, expect, it } from "vitest";
import { shortenUrlSchema } from "../url-schema";

describe("Url Schema", () => {
  it("Accepts a valid URL", () => {
    const validUrl = {
      originalUrl: "https://www.example.com",
    };
    expect(() => {
      const result = shortenUrlSchema.safeParse(validUrl);
      expect(result.success).toBe(true);
    });
  });

  it("Rejects an invalid URL", () => {
    const invalidUrl = {
      originalUrl: "invalid-url",
    };
    expect(() => {
      const result = shortenUrlSchema.safeParse(invalidUrl);
      expect(result.success).toBe(false);
    });
  });
});
