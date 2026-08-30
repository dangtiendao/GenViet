import { describe, it, expect } from "vitest";
import { isSensitiveUrl, isStaticAssetUrl } from "@/features/pwa/config/pwa.config";
import { CACHE_POLICY_MATRIX } from "@/features/pwa/config/cache-policy";

describe("PWA Cache Policy & Sensitivity Classifier", () => {
  it("nhận diện chính xác các URL nhạy cảm và chứa token bí mật", () => {
    expect(isSensitiveUrl("https://genviet.app/auth/v1/user?token=abc")).toBe(true);
    expect(isSensitiveUrl("https://genviet.app/api/trees/123/graph")).toBe(true);
    expect(isSensitiveUrl("https://genviet.app/api/trees/123/backup")).toBe(true);
    expect(
      isSensitiveUrl(
        "https://storage.supabase.co/v1/object/sign/avatars/test.webp?token=xyz&signature=123"
      )
    ).toBe(true);
    expect(isSensitiveUrl("https://genviet.app/auth/callback?code=abc")).toBe(true);
  });

  it("nhận diện chính xác các static build assets an toàn để cache", () => {
    expect(isStaticAssetUrl("http://localhost/_next/static/chunks/app.js")).toBe(true);
    expect(isStaticAssetUrl("http://localhost/_next/static/css/styles.css")).toBe(true);
    expect(isStaticAssetUrl("http://localhost/icons/icon-192x192.png")).toBe(true);
    expect(isStaticAssetUrl("http://localhost/apple-touch-icon.png")).toBe(true);
    expect(isStaticAssetUrl("http://localhost/favicon.ico")).toBe(true);
    expect(isStaticAssetUrl("http://localhost/dashboard")).toBe(false);
    expect(isStaticAssetUrl("http://localhost/api/health")).toBe(false);
  });

  it("ma trận cache policy bao phủ đầy đủ các loại request của hệ thống", () => {
    const classes = CACHE_POLICY_MATRIX.map((item) => item.requestClass);
    expect(classes).toContain("Offline Fallback HTML");
    expect(classes).toContain("PWA Icons & Manifest");
    expect(classes).toContain("Next.js Static Build Assets (JS/CSS with hash)");
    expect(classes).toContain("Supabase Auth & Session Endpoints");
    expect(classes).toContain("Family Tree Graph API");
    expect(classes).toContain("Person Search API");
    expect(classes).toContain("Audit History");
    expect(classes).toContain("Storage Avatar Signed URLs");
    expect(classes).toContain("Backup Export & Import");
  });
});
