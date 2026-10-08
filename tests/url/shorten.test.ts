import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../src/app";

import { createTestUser } from "../fixture/login";
import { createJWTToken } from "../../src/modules/auth/auth-utils";

describe("POST api/urls/shorten", () => {
  const endpoint = "/api/urls/shorten";
  const validUrlData = {
    originalUrl: "https://google.com",
  };
  it("Should return 201 and response for valid request", async () => {
    const user = await createTestUser({
      email: "email@email.com",
      password: "ValidPassword123!",
      username: "username",
    });
    const token = createJWTToken(user.id);
    const response = await request(app)
      .post(endpoint)
      .set("Cookie", `token=${token}`)
      .send(validUrlData)
      .expect(201);
    expect(response.body).toMatchObject({
      shortUrl: expect.any(String),
      longUrl: validUrlData.originalUrl,
      ownerId: user.id,
      expiresAt: expect.any(String),
    });
  });
  it("Should return 401 for unauthenticated request", async () => {
    await request(app).post(endpoint).send(validUrlData).expect(401);
  });
  it("Should return 422 for wrong payload", async () => {
    const user = await createTestUser({
      email: "email@email.com",
      password: "ValidPassword123!",
      username: "username",
    });
    const token = createJWTToken(user.id);
    await request(app)
      .post(endpoint)
      .set("Cookie", `token=${token}`)
      .send({ originalUrl: "invalid-url" })
      .expect(422);
  });
});
