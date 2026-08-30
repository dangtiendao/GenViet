import { test, expect } from "@playwright/test";

test.describe("GenViet Family Tree Management E2E Tests (Phase P11)", () => {
  test("unauthenticated user accessing /trees is redirected to /login with next param", async ({
    page,
  }) => {
    await page.goto("/trees");
    await expect(page).toHaveURL(/\/login\?next=%2Ftrees/);
    await expect(page.getByRole("heading", { name: "Đăng nhập vào GenViet" })).toBeVisible();
  });

  test("unauthenticated user accessing /trees/new is redirected to /login with next param", async ({
    page,
  }) => {
    await page.goto("/trees/new");
    await expect(page).toHaveURL(/\/login\?next=%2Ftrees%2Fnew/);
    await expect(page.getByRole("heading", { name: "Đăng nhập vào GenViet" })).toBeVisible();
  });

  test("unauthenticated user accessing dynamic /trees/[treeId] is redirected to /login", async ({
    page,
  }) => {
    await page.goto("/trees/11111111-1111-1111-1111-111111111111");
    await expect(page).toHaveURL(/\/login\?next=%2Ftrees%2F11111111-1111-1111-1111-111111111111/);
  });

  test("unauthenticated user accessing /trees/[treeId]/settings is redirected to /login", async ({
    page,
  }) => {
    await page.goto("/trees/11111111-1111-1111-1111-111111111111/settings");
    await expect(page).toHaveURL(
      /\/login\?next=%2Ftrees%2F11111111-1111-1111-1111-111111111111%2Fsettings/
    );
  });

  test("unauthenticated user accessing /trees/trash is redirected to /login", async ({ page }) => {
    await page.goto("/trees/trash");
    await expect(page).toHaveURL(/\/login\?next=%2Ftrees%2Ftrash/);
  });

  test("mobile viewports 375x667 and 320x568 render login redirect cleanly without horizontal overflow", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto("/trees");
    await expect(page).toHaveURL(/\/login\?next=%2Ftrees/);

    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    expect(hasHorizontalScroll).toBe(false);
  });
});
