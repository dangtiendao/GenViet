import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

describe("P29: OAuth Security, Privacy & Authorization Isolation Tests (AC-P29-033..056)", () => {
  it("bắt buộc khai báo server-only trong handle-oauth-callback.ts", () => {
    const filePath = path.resolve(
      process.cwd(),
      "src/features/auth/services/handle-oauth-callback.ts"
    );
    const content = fs.readFileSync(filePath, "utf8");
    expect(content).toContain('import "server-only"');
  });

  it("tuyệt đối không để lộ Google Client Secret hoặc Service Role Key trong thư mục src/app hoặc src/features/auth/components", () => {
    const scanDirs = [
      path.resolve(process.cwd(), "src/app/(auth)"),
      path.resolve(process.cwd(), "src/features/auth/components"),
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
          expect(content).not.toContain("GOOGLE_CLIENT_SECRET");
          expect(content).not.toContain("SUPABASE_SERVICE_ROLE_KEY");
          expect(content).not.toContain("SUPABASE_SECRET_KEY");
          expect(content).not.toContain("NEXT_PUBLIC_GOOGLE_CLIENT_SECRET");
        }
      }
    };

    scanDirs.forEach((dir) => scanDirectory(dir));
  });

  it("đảm bảo OAuth callback và OAuth error handler không ghi nhận raw token hoặc authorization code trong log", () => {
    const callbackServicePath = path.resolve(
      process.cwd(),
      "src/features/auth/services/handle-oauth-callback.ts"
    );
    const content = fs.readFileSync(callbackServicePath, "utf8");

    // Must not log full URL params or authorization code
    expect(content).not.toContain("logger.info(code");
    expect(content).not.toContain("logger.error(code");
    expect(content).not.toContain("console.log(code");
    expect(content).not.toContain("console.error(code");
  });

  it("khẳng định quy tắc phân quyền: Google user mới không được tự động cấp Tree Membership hay liên kết Person", () => {
    // Contract verification: Ensure no automatic membership assignment or person creation exists in auth callback
    const callbackServicePath = path.resolve(
      process.cwd(),
      "src/features/auth/services/handle-oauth-callback.ts"
    );
    const content = fs.readFileSync(callbackServicePath, "utf8");

    // The callback handler must NOT query or mutate `tree_memberships` or `persons`
    expect(content).not.toContain("tree_memberships");
    expect(content).not.toContain("persons");
    expect(content).not.toContain("invitations");
    expect(content).not.toContain("insert(");
    expect(content).not.toContain("upsert(");
  });
});
