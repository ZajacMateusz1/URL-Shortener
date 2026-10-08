import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../src/app";

import { createTestUser } from "../fixture/login";

describe("POST api/auth/login", () => {
  const endpoint = "/api/auth/login";
  const validUserData = {
    email: "example@example.com",
    password: "ValidPassword123!",
  };
  it("Should return 200 and a token for valid credentials", async () => {
    await createTestUser({ ...validUserData, username: "username" });
    const response = await request(app)
      .post(endpoint)
      .send(validUserData)
      .expect(200);
    expect(response.body).not.toHaveProperty("password");
    expect(response.body).toMatchObject({
      id: expect.any(Number),
      email: validUserData.email,
      username: expect.any(String),
      isVerified: expect.any(Boolean),
    });
  });
  it('Should set cookie "token" in the response header', async () => {
    await createTestUser({ ...validUserData, username: "username" });
    const response = await request(app)
      .post(endpoint)
      .send(validUserData)
      .expect(200);
    const cookies = Array.isArray(response.headers["set-cookie"])
      ? response.headers["set-cookie"]
      : [];
    expect(cookies.some((cookie) => cookie.startsWith("token="))).toBe(true);
  });
  it("Should return 401 for invalid credentials", async () => {
    await createTestUser({ ...validUserData, username: "username" });
    await request(app)
      .post(endpoint)
      .send({ ...validUserData, password: "WrongPassword123!" })
      .expect(401);
  });
  it("Should return 422 for wrong payload", async () => {
    await request(app)
      .post(endpoint)
      .send({ ...validUserData, email: undefined })
      .expect(422);
  });
});
