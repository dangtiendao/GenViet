import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

describe("Auth Module Security & Boundaries (P09-WP01 / AC-P09-182..195)", () => {
  it("should enforce server-only in require-user.ts", () => {
    const requireUserPath = path.resolve(process.cwd(), "src/lib/auth/require-user.ts");
    const content = fs.readFileSync(requireUserPath, "utf8");
    expect(content).toContain('import "server-only"');
  });

  it("should enforce server-only in actions/index.ts", () => {
    const actionsPath = path.resolve(process.cwd(), "src/features/auth/actions/index.ts");
    const content = fs.readFileSync(actionsPath, "utf8");
    expect(content).toContain('"use server"');
  });

  it("should NOT expose service-role key in any client auth page", () => {
    const authPagesDir = path.resolve(process.cwd(), "src/app/(auth)");
    const scanDir = (dir: string) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          scanDir(fullPath);
        } else if (/\.(tsx|jsx|ts|js)$/.test(entry.name)) {
          const content = fs.readFileSync(fullPath, "utf8");
          expect(content).not.toContain("SUPABASE_SERVICE_ROLE_KEY");
          expect(content).not.toContain("service_role");
        }
      }
    };
    scanDir(authPagesDir);
  });
});
