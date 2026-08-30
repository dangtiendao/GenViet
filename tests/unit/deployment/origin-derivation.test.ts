import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { getAppOrigin, getAuthCallbackUrl } from "@/config/env";

describe("P24: Origin Derivation & Auth Callback URL Tests", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("suy dẫn chính xác URL từ NEXT_PUBLIC_APP_URL khi cấu hình", () => {
    process.env.NEXT_PUBLIC_APP_URL = "https://genviet.vn";
    delete process.env.VERCEL_URL;
    expect(getAppOrigin()).toBe("https://genviet.vn");
  });

  it("suy dẫn chính xác URL từ VERCEL_URL trong môi trường Preview", () => {
    delete process.env.NEXT_PUBLIC_APP_URL;
    delete process.env.NEXT_PUBLIC_SITE_URL;
    process.env.VERCEL_URL = "genviet-git-feature-dangtiendao.vercel.app";
    expect(getAppOrigin()).toBe("https://genviet-git-feature-dangtiendao.vercel.app");
  });

  it("tạo URL auth callback đúng chuẩn mực và mã hóa tham số next an toàn", () => {
    process.env.NEXT_PUBLIC_APP_URL = "https://genviet.vn";
    const callbackUrl = getAuthCallbackUrl("/trees/123/tree");
    expect(callbackUrl).toBe("https://genviet.vn/auth/callback?next=%2Ftrees%2F123%2Ftree");
  });
});
