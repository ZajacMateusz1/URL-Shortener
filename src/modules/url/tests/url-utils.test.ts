import { describe, expect, it } from "vitest";
import { generateShortUrl } from "../url-utils";

describe("Url Schema", () => {
  it("Should generate a short URL", () => {
    const shortUrl = generateShortUrl();
    expect(shortUrl).toBeDefined();
  });
});
