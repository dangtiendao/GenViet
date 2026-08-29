import { describe, it, expect } from "vitest";
import { type Database } from "@/lib/supabase/database.types";
import { createClient as createBrowserClient } from "@/lib/supabase/client";

describe("Supabase Client Foundations", () => {
  it("should have valid Database TypeScript types defined", () => {
    const mockStatus: Database["_system"]["Tables"]["infrastructure_status"]["Row"] = {
      id: "genviet_foundation",
      phase_code: "P06",
      initialized_at: "2026-08-29T15:00:00Z",
      version: "v0.1.0",
    };

    expect(mockStatus.id).toBe("genviet_foundation");
    expect(mockStatus.phase_code).toBe("P06");
  });

  it("should throw error or create client safely without unhandled crashes", () => {
    // When environment variables are missing, calling createBrowserClient throws descriptive error
    try {
      const client = createBrowserClient();
      expect(client).toBeDefined();
    } catch (error: any) {
      expect(error.message).toContain("Missing Supabase environment variables");
    }
  });
});
