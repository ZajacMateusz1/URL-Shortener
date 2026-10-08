import { afterEach, vi, afterAll, beforeAll, beforeEach } from "vitest";
import redisClient, { connectRedis } from "../src/config/redis";
import { db } from "../src/prisma/db";

beforeAll(async () => {
  await connectRedis();
});

vi.mock("../src/modules/email/send-email", () => ({
  sendWelcomeEmail: vi.fn(),
  sendVerificationEmail: vi.fn(),
  sendResetPasswordEmail: vi.fn(),
}));

beforeEach(async () => {
  await db.transaction(async (tx) => {
    await tx.orm.public.UserVerification.where({}).deleteAll();
    await tx.orm.public.PasswordReset.where({}).deleteAll();
    await tx.orm.public.Link.where({}).deleteAll();
    await tx.orm.public.User.where({}).deleteAll();
  });
  await redisClient.flushDb();
});

afterEach(async () => {
  vi.clearAllMocks();
});

afterAll(async () => {
  await redisClient.quit();
});
