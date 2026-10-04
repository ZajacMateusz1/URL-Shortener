import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    globals: true,
    environment: "node",
    env: {
      DATABASE_URL: "postgresql://postgres:password@localhost:5432/mydb",
      JWT_SECRET: "test-jwt-secret-at-least-32-characters-long",
      RESEND_API_KEY: "test_resend_api_key",
      BASE_URL: "http://localhost:5000",
      REDIS_URL: "redis://localhost:6379",
    },
    setupFiles: ["./tests/setup"],
  },
});
