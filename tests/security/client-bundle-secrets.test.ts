import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

describe("P22-T33: Quét bí mật đặc quyền trong Client Assets (Client Bundle Secrets Scan)", () => {
  it("file Service Worker public/sw.js không chứa service-role key, database password hoặc heartbeat secret", () => {
    const swPath = resolve(process.cwd(), "public/sw.js");
    expect(existsSync(swPath)).toBe(true);

    const swContent = readFileSync(swPath, "utf-8");

    expect(swContent).not.toContain("SUPABASE_SERVICE_ROLE_KEY");
    expect(swContent).not.toContain("HEARTBEAT_SECRET");
    expect(swContent).not.toContain("service_role");
    expect(swContent).not.toContain("postgres://");
    expect(swContent).not.toContain("postgresql://");
  });

  it("file Web App Manifest public/icons không chứa token hay secret", () => {
    const manifestPath = resolve(process.cwd(), "src/app/manifest.ts");
    expect(existsSync(manifestPath)).toBe(true);

    const manifestContent = readFileSync(manifestPath, "utf-8");

    expect(manifestContent).not.toContain("token");
    expect(manifestContent).not.toContain("secret");
  });
});
