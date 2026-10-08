import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../src/app";

describe("POST /api/auth/signup", () => {
  const endpoint = "/api/auth/signup";
  const validUserData = {
    email: "example@example.com",
    password: "ValidPassword123!",
    username: "username",
  };
  it("Should return 201 for valid user data", async () => {
    const response = await request(app)
      .post(endpoint)
      .send(validUserData)
      .expect(201);
    expect(response.body).not.toHaveProperty("password");
    expect(response.body).toMatchObject({
      id: expect.any(Number),
      email: validUserData.email,
      username: validUserData.username,
      isVerified: false,
    });
  });
  it('Should set cookie "token" in the response header', async () => {
    const response = await request(app)
      .post(endpoint)
      .send(validUserData)
      .expect(201);
    const cookies = Array.isArray(response.headers["set-cookie"])
      ? response.headers["set-cookie"]
      : [];
    expect(cookies.some((cookie) => cookie.startsWith("token="))).toBe(true);
  });
  it("Should return error for duplicate email", async () => {
    await request(app).post(endpoint).send(validUserData).expect(201);
    await request(app).post(endpoint).send(validUserData).expect(500);
  });
  it("Should return 422 for wrong payload", async () => {
    await request(app)
      .post(endpoint)
      .send({ ...validUserData, email: undefined })
      .expect(422);
  });
});
