import { describe, it, expect } from "vitest";
import { createVerificationToken, createJWTToken } from "../auth-utils";

describe("Auth Utils", () => {
  it("Should create a verification token and hashed token", async () => {
    const { verificationToken, hashedToken } = await createVerificationToken();
    expect(verificationToken).toBeDefined();
    expect(hashedToken).toBeDefined();
  });

  it("Should create a JWT token", () => {
    const token = createJWTToken(1);
    expect(token).toBeDefined();
  });
});
