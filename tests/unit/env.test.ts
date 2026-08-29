import { describe, it, expect } from "vitest";
import { publicEnvSchema, serverEnvSchema, validateEnv } from "@/lib/env";

describe("Environment Validation Schema", () => {
  it("should validate a completely empty local environment safely", () => {
    const result = validateEnv({});
    expect(result.success).toBe(true);
    expect(result.data?.NODE_ENV).toBe("development");
  });

  it("should parse valid public Supabase credentials", () => {
    const validPublic = {
      NEXT_PUBLIC_SUPABASE_URL: "https://xyzcompany.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "eyJhYmM...",
    };

    const parsed = publicEnvSchema.safeParse(validPublic);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.NEXT_PUBLIC_SUPABASE_URL).toBe("https://xyzcompany.supabase.co");
    }
  });

  it("should reject invalid Supabase URL", () => {
    const invalidUrl = {
      NEXT_PUBLIC_SUPABASE_URL: "not-a-valid-url",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "key123",
    };

    const parsed = publicEnvSchema.safeParse(invalidUrl);
    expect(parsed.success).toBe(false);
  });

  it("should parse valid server-only environment variables", () => {
    const validServer = {
      NEXT_PUBLIC_SUPABASE_URL: "https://xyzcompany.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key-123",
      SUPABASE_SERVICE_ROLE_KEY: "service-role-secret-456",
      CRON_SECRET: "cron-secret-789",
      NODE_ENV: "production" as const,
    };

    const parsed = serverEnvSchema.safeParse(validServer);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.SUPABASE_SERVICE_ROLE_KEY).toBe("service-role-secret-456");
      expect(parsed.data.NODE_ENV).toBe("production");
    }
  });
});
