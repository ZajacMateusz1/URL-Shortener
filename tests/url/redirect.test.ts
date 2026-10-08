import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../src/app";

import { createTestShortUrl } from "../fixture/url";
import { createTestUser } from "../fixture/login";

describe("GET api/urls/:shortUrl", () => {
  const endpoint = "/api/urls/{shortUrl}";
  it("Should return 302 and redirect to the original URL", async () => {
    const user = await createTestUser({
      email: "email@email.com",
      password: "ValidPassword123!",
      username: "username",
    });
    const { shortUrl } = await createTestShortUrl(
      "https://google.com",
      user.id,
    );
    const response = await request(app)
      .get(endpoint.replace("{shortUrl}", shortUrl))
      .expect(302);
    expect(response.headers.location).toBe("https://google.com");
  });
  it("Should return error for invalid short URL", async () => {
    await request(app).get("/api/url/invalidShortUrl").expect(404);
  });
});
