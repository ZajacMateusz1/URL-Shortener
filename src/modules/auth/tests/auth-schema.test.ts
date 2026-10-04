import { describe, expect, it } from "vitest";
import {
  emailSchema,
  passwordSchema,
  loginSchema,
  signUpSchema,
} from "../auth-schema";

describe("Auth Schema", () => {
  it("Accepts a valid email", () => {
    const validEmail = {
      email: "example@example.com",
    };
    expect(() => {
      const result = emailSchema.safeParse(validEmail);
      expect(result.success).toBe(true);
    });
  });

  it("Rejects an invalid email", () => {
    const invalidEmail = {
      email: "invalid-email",
    };
    expect(() => {
      const result = emailSchema.safeParse(invalidEmail);
      expect(result.success).toBe(false);
    });
  });

  it("Accepts a valid password", () => {
    const validPassword = {
      password: "ValidPassword123!",
    };
    expect(() => {
      const result = passwordSchema.safeParse(validPassword);
      expect(result.success).toBe(true);
    });
  });

  it("Rejects an invalid password", () => {
    const invalidPassword = {
      password: "short",
    };
    expect(() => {
      const result = passwordSchema.safeParse(invalidPassword);
      expect(result.success).toBe(false);
    });
  });

  it("Accepts a valid login schema", () => {
    const validLogin = {
      email: "example@example.com",
      password: "ValidPassword123!",
    };
    expect(() => {
      const result = loginSchema.safeParse(validLogin);
      expect(result.success).toBe(true);
    });
  });

  it("Rejects an invalid login schema", () => {
    const invalidLogin = {
      email: "invalid-email",
      password: "short",
    };
    expect(() => {
      const result = loginSchema.safeParse(invalidLogin);
      expect(result.success).toBe(false);
    });
  });

  it("Accepts a valid sign-up schema", () => {
    const validSignUp = {
      email: "example@example.com",
      password: "ValidPassword123!",
    };
    expect(() => {
      const result = signUpSchema.safeParse(validSignUp);
      expect(result.success).toBe(true);
    });
  });

  it("Rejects an invalid sign-up schema", () => {
    const invalidSignUp = {
      email: "invalid-email",
      password: "short",
      username: "ab",
    };
    expect(() => {
      const result = signUpSchema.safeParse(invalidSignUp);
      expect(result.success).toBe(false);
    });
  });
});
