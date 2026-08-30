import { test, expect } from "@playwright/test";

test.describe("GenViet PWA & Offline Shell E2E Tests (Phase P20)", () => {
  test("manifest.webmanifest returns valid JSON with standalone display and GenViet branding", async ({
    request,
  }) => {
    const response = await request.get("/manifest.webmanifest");
    expect(response.status()).toBe(200);

    const manifest = await response.json();
    expect(manifest.name).toBe("GenViet - Quản lý Cây Gia phả");
    expect(manifest.short_name).toBe("GenViet");
    expect(manifest.display).toBe("standalone");
    expect(manifest.start_url).toBe("/dashboard");
    expect(manifest.theme_color).toBe("#065f46");
    expect(manifest.icons.length).toBeGreaterThanOrEqual(4);
  });

  test("PWA icon assets load with HTTP 200", async ({ request }) => {
    const icon192 = await request.get("/icons/icon-192x192.png");
    expect(icon192.status()).toBe(200);
    expect(icon192.headers()["content-type"]).toContain("image/png");

    const icon512 = await request.get("/icons/icon-512x512.png");
    expect(icon512.status()).toBe(200);
    expect(icon512.headers()["content-type"]).toContain("image/png");

    const appleIcon = await request.get("/apple-touch-icon.png");
    expect(appleIcon.status()).toBe(200);
    expect(appleIcon.headers()["content-type"]).toContain("image/png");
  });

  test("service worker file sw.js loads with HTTP 200 and javascript content type", async ({
    request,
  }) => {
    const response = await request.get("/sw.js");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toMatch(/javascript/);
  });

  test("offline fallback page /offline loads cleanly with notice and retry button", async ({
    page,
  }) => {
    await page.goto("/offline");
    await expect(page.locator("h1")).toContainText("Thiết Bị Đang Ngoại Tuyến");
    await expect(page.locator("body")).toContainText(
      "chưa hỗ trợ thao tác chỉnh sửa phả hệ khi ngoại tuyến"
    );
    await expect(page.getByRole("button", { name: /thử lại kết nối/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /về bảng điều khiển/i })).toBeVisible();
  });

  test("mobile viewports 375x667 and 320x568 render /offline without horizontal scroll", async ({
    page,
  }) => {
    for (const viewport of [
      { width: 375, height: 667 },
      { width: 320, height: 568 },
    ]) {
      await page.setViewportSize(viewport);
      await page.goto("/offline");

      const hasHorizontalScroll = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth
      );
      expect(hasHorizontalScroll).toBe(false);
    }
  });
});
