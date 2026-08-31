import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

describe("P30-T51, AC-P30-068: Public Routes Client Bundle Secrets Scan", () => {
  it("không chứa SUPABASE_SERVICE_ROLE_KEY hay service_role trong public routes và components", () => {
    const publicDirs = [
      path.resolve(process.cwd(), "src/app/public"),
      path.resolve(process.cwd(), "src/features/public-trees/components"),
    ];

    const scanDirectory = (dir: string) => {
      if (!fs.existsSync(dir)) return;
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          scanDirectory(fullPath);
        } else if (/\.(tsx|jsx|ts|js)$/.test(entry.name)) {
          const content = fs.readFileSync(fullPath, "utf8");
          expect(content).not.toContain("SUPABASE_SERVICE_ROLE_KEY");
          expect(content).not.toContain("service_role");
        }
      }
    };

    for (const dir of publicDirs) {
      scanDirectory(dir);
    }
  });
});
