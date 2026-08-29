import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

describe("Service Role & Secret Isolation Security Tests (P08-T24)", () => {
  it("should enforce server-only import in admin client", () => {
    const adminPath = path.resolve(process.cwd(), "src/lib/supabase/admin.ts");
    const adminContent = fs.readFileSync(adminPath, "utf8");
    expect(adminContent).toContain('import "server-only"');
    expect(adminContent).toContain("createAdminClient");
  });

  it("should NOT expose service role key to browser client", () => {
    const clientPath = path.resolve(process.cwd(), "src/lib/supabase/client.ts");
    const clientContent = fs.readFileSync(clientPath, "utf8");
    expect(clientContent).not.toContain("SUPABASE_SERVICE_ROLE_KEY");
    expect(clientContent).not.toContain("service_role");
    expect(clientContent).toContain("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  });

  it("should NOT have NEXT_PUBLIC prefix on sensitive environment variables in schema", () => {
    const envPath = path.resolve(process.cwd(), "src/lib/env/index.ts");
    const envContent = fs.readFileSync(envPath, "utf8");
    expect(envContent).not.toContain("NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY");
    expect(envContent).toContain("SUPABASE_SERVICE_ROLE_KEY");
  });

  it("should NOT leak service role variable in client components or app directory", () => {
    const srcAppDir = path.resolve(process.cwd(), "src/app");
    const checkDir = (dir: string) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          checkDir(fullPath);
        } else if (/\.(tsx|jsx|ts|js)$/.test(entry.name) && !entry.name.includes(".test.")) {
          const content = fs.readFileSync(fullPath, "utf8");
          // If file has "use client", it must never reference SUPABASE_SERVICE_ROLE_KEY or createAdminClient
          if (content.includes('"use client"') || content.includes("'use client'")) {
            expect(content).not.toContain("SUPABASE_SERVICE_ROLE_KEY");
            expect(content).not.toContain("createAdminClient");
          }
        }
      }
    };
    checkDir(srcAppDir);
  });
});
