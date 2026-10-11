import { describe, it } from "vitest";
import request from "supertest";
import express from "express";

import { tokenBucket } from "../../src/middleware/rate-limiter";

describe("Toen bucket rate-limiter", () => {
  const endpoint = "/test";
  const app = express();
  app.get(endpoint, tokenBucket(2, 0.1, "test"), (req, res) =>
    res.json({ status: "ok" }),
  );

  it("Should allow requests within the rate limit", async () => {
    await request(app).get(endpoint).send().expect(200);
    await request(app).get(endpoint).send().expect(200);
  });

  it("Should return 429 when the rate limit is exceeded", async () => {
    await request(app).get(endpoint).send().expect(200);
    await request(app).get(endpoint).send().expect(200);
    await request(app).get(endpoint).send().expect(429);
  });
});
