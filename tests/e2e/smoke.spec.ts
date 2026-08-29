import { test, expect } from "@playwright/test";

test.describe("GenViet Foundation Smoke Tests", () => {
  test("homepage loads successfully and displays GenViet title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/GenViet/i);

    const heading = page.locator("h1");
    await expect(heading).toBeVisible();
    await expect(heading).toHaveText("GenViet");
  });

  test("health check API returns HTTP 200 and ok status", async ({ request }) => {
    const response = await request.get("/api/health");
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data.status).toBe("ok");
    expect(data.service).toBe("genviet");
  });
});
