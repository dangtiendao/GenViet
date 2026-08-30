import { describe, it, expect } from "vitest";
import manifest from "@/app/manifest";

describe("PWA Web App Manifest (P20-T01)", () => {
  const m = manifest();

  it("trả về manifest hợp lệ với đầy đủ thông tin nhận diện thương hiệu GenViet", () => {
    expect(m.name).toBe("GenViet - Quản lý Cây Gia phả");
    expect(m.short_name).toBe("GenViet");
    expect(m.lang).toBe("vi");
    expect(m.display).toBe("standalone");
    expect(m.start_url).toBe("/dashboard");
    expect(m.scope).toBe("/");
    expect(m.background_color).toBe("#fafafa");
    expect(m.theme_color).toBe("#065f46");
  });

  it("start_url không chứa token, bí mật hoặc tree ID của tài khoản cá nhân", () => {
    expect(m.start_url).not.toContain("token");
    expect(m.start_url).not.toContain("?");
    expect(m.start_url).toBe("/dashboard");
  });

  it("khai báo đầy đủ các icon PNG 192x192, 512x512, maskable và apple touch icon", () => {
    expect(m.icons).toBeDefined();
    expect(m.icons?.length).toBeGreaterThanOrEqual(4);

    const sizes = m.icons?.map((i) => i.sizes);
    expect(sizes).toContain("192x192");
    expect(sizes).toContain("512x512");
    expect(sizes).toContain("180x180");

    const maskables = m.icons?.filter((i) => i.purpose === "maskable");
    expect(maskables?.length).toBeGreaterThanOrEqual(2);
  });
});
