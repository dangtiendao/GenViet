import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

describe("Service Worker Script Integrity (P20-T04 & P20-T05)", () => {
  const swPath = resolve(process.cwd(), "public/sw.js");
  const swContent = readFileSync(swPath, "utf-8");

  it("file sw.js tồn tại và chứa versioned cache name với prefix genviet-", () => {
    expect(swContent).toContain("genviet-");
    expect(swContent).toContain("genviet-shell-v1");
  });

  it("precache offline fallback /offline và icons hợp lệ", () => {
    expect(swContent).toContain("OFFLINE_URL");
    expect(swContent).toContain("/icons/icon-192x192.png");
    expect(swContent).toContain("/icons/icon-512x512.png");
    expect(swContent).toContain("/apple-touch-icon.png");
  });

  it("chứa cơ chế phát hiện và bypass toàn bộ URL chứa token/signed_url/auth/backup", () => {
    expect(swContent).toContain("token=");
    expect(swContent).toContain("access_token=");
    expect(swContent).toContain("signed_url");
    expect(swContent).toContain("/auth/v1/");
    expect(swContent).toContain("/api/trees/");
    expect(swContent).toContain("/backup");
  });

  it("xử lý thông điệp SKIP_WAITING và CLEAR_PRIVATE_CACHES", () => {
    expect(swContent).toContain("SKIP_WAITING");
    expect(swContent).toContain("CLEAR_PRIVATE_CACHES");
    expect(swContent).toContain("PRIVATE_CACHES_CLEARED");
  });

  it("chặn bắt lỗi mạng ở navigation mode để trả về trang /offline fallback", () => {
    expect(swContent).toContain('request.mode === "navigate"');
    expect(swContent).toContain("caches.match(OFFLINE_URL)");
  });
});
