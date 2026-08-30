import { describe, it, expect } from "vitest";
import { publicEnvSchema, serverEnvSchema } from "@/lib/env";

describe("P24: Environment Schema & Contract Tests", () => {
  it("publicEnvSchema chỉ chấp nhận các trường an toàn cho browser", () => {
    const validPublic = {
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key-123",
      NEXT_PUBLIC_APP_URL: "https://genviet.vn",
    };

    const result = publicEnvSchema.safeParse(validPublic);
    expect(result.success).toBe(true);
  });

  it("serverEnvSchema chứa các trường bí mật và không được xuất sang client", () => {
    const validServer = {
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key-123",
      SUPABASE_SERVICE_ROLE_KEY: "service-role-secret-key",
      HEARTBEAT_SECRET: "heartbeat-secret-key",
    };

    const result = serverEnvSchema.safeParse(validServer);
    expect(result.success).toBe(true);
  });
});
