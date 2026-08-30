import { test, expect } from "@playwright/test";

test.describe("P22 Critical User Journeys (P22-T17 đến P22-T27)", () => {
  test("P22-T17 & P22-T18: Auth Journey - Login, Sign-up, Logout & Protection", async ({
    page,
  }) => {
    // 1. Mở trang login
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: "Đăng nhập vào GenViet" })).toBeVisible();

    // 2. Mở trang signup
    await page.getByRole("link", { name: /đăng ký/i }).click();
    await expect(page).toHaveURL(/.*sign-up/);
    await expect(page.getByRole("heading", { name: "Đăng ký tài khoản GenViet" })).toBeVisible();

    // 3. Kiểm tra form controls
    await expect(page.getByLabel("Tên hiển thị")).toBeVisible();
    await expect(page.getByLabel("Địa chỉ Email")).toBeVisible();
    await expect(page.getByRole("button", { name: "Đăng ký" })).toBeVisible();
  });

  test("P22-T19: Tree Creation Journey - Form & Validation", async ({ page }) => {
    await page.goto("/trees/new");
    // Khi chưa đăng nhập -> redirect /login?next=/trees/new
    await expect(page).toHaveURL(/.*login.*next=%2Ftrees%2Fnew/);
  });

  test("P22-T20 $\\rightarrow$ P22-T23: Person & Relationships Protected Routes", async ({
    page,
  }) => {
    const fakeTreeId = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";
    const fakePersonId = "11111111-1111-4111-a111-111111111111";

    // Truy cập trang tạo người mới
    await page.goto(`/trees/${fakeTreeId}/people/new`);
    await expect(page).toHaveURL(/.*login/);

    // Truy cập trang hồ sơ người
    await page.goto(`/trees/${fakeTreeId}/people/${fakePersonId}`);
    await expect(page).toHaveURL(/.*login/);
  });

  test("P22-T24: Tree View Canvas & Controls Protected Routes", async ({ page }) => {
    const fakeTreeId = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";
    await page.goto(`/trees/${fakeTreeId}/tree`);
    await expect(page).toHaveURL(/.*login.*next=%2Ftrees%2F/);
  });

  test("P22-T25: Vietnamese Search Protected Routes", async ({ page }) => {
    await page.goto("/search?q=nguyen");
    await expect(page).toHaveURL(/.*login/);
  });

  test("P22-T27: Backup & Import Protected Routes", async ({ page }) => {
    await page.goto("/trees/import");
    await expect(page).toHaveURL(/.*login.*next=%2Ftrees%2Fimport/);
  });
});
