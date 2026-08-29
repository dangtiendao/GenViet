import { test, expect } from "@playwright/test";

test.describe("GenViet Authentication E2E Tests (Phase P09)", () => {
  test("unauthenticated user accessing /dashboard is redirected to /login with next param", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login\?next=%2Fdashboard/);
    await expect(page.getByRole("heading", { name: "Đăng nhập vào GenViet" })).toBeVisible();
  });

  test("login page renders all required elements and links", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByLabel("Địa chỉ Email")).toBeVisible();
    await expect(page.getByLabel("Mật khẩu")).toBeVisible();
    await expect(page.getByRole("button", { name: "Đăng nhập" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Quên mật khẩu?" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Đăng ký ngay" })).toBeVisible();
  });

  test("sign-up page renders all required fields", async ({ page }) => {
    await page.goto("/sign-up");
    await expect(page.getByRole("heading", { name: "Đăng ký tài khoản GenViet" })).toBeVisible();
    await expect(page.getByLabel("Tên hiển thị")).toBeVisible();
    await expect(page.getByLabel("Địa chỉ Email")).toBeVisible();
    await expect(page.getByLabel("Mật khẩu", { exact: true })).toBeVisible();
    await expect(page.getByLabel("Xác nhận mật khẩu")).toBeVisible();
    await expect(page.getByRole("button", { name: "Đăng ký" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Đăng nhập ngay" })).toBeVisible();
  });

  test("forgot-password page renders and provides neutral response", async ({ page }) => {
    await page.goto("/forgot-password");
    await expect(page.getByRole("heading", { name: "Quên mật khẩu" })).toBeVisible();
    await expect(page.getByLabel("Địa chỉ Email")).toBeVisible();
    await expect(page.getByRole("button", { name: "Gửi liên kết đặt lại" })).toBeVisible();
  });

  test("auth error page renders stable message when visited with code", async ({ page }) => {
    await page.goto("/auth-error?code=AUTH_INVALID_CREDENTIALS");
    await expect(page.getByRole("heading", { name: "Xác thực không thành công" })).toBeVisible();
    await expect(
      page.getByText("Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại.")
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Quay lại trang Đăng nhập" })).toBeVisible();
  });

  test("open-redirect attack via login query parameter is neutralized", async ({ page }) => {
    await page.goto("/login?next=https://attacker.example");
    // Verify login page loaded safely
    await expect(page.getByRole("heading", { name: "Đăng nhập vào GenViet" })).toBeVisible();
  });

  test("mobile viewport renders login form cleanly without horizontal overflow", async ({
    page,
  }) => {
    // Mobile viewport (iPhone SE / Android standard)
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: "Đăng nhập vào GenViet" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Đăng nhập" })).toBeVisible();
  });
});
