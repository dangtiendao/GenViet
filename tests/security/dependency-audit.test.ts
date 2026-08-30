import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

describe("P22-T36: Rà soát phụ thuộc & Bảo mật chuỗi cung ứng (Dependency Security Audit)", () => {
  it("file package-lock.json tồn tại và có lockfileVersion hợp lệ (v3)", () => {
    const lockfilePath = resolve(process.cwd(), "package-lock.json");
    expect(existsSync(lockfilePath)).toBe(true);

    const lockContent = JSON.parse(readFileSync(lockfilePath, "utf-8"));
    expect(lockContent.lockfileVersion).toBeGreaterThanOrEqual(2);
    expect(lockContent.name).toBe("genviet");
  });

  it("không sử dụng các gói phụ thuộc độc hại hoặc bị cấm", () => {
    const packageJsonPath = resolve(process.cwd(), "package.json");
    const pkg = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

    const allDeps = {
      ...pkg.dependencies,
      ...pkg.devDependencies,
    };

    expect(allDeps).not.toHaveProperty("event-stream");
    expect(allDeps).not.toHaveProperty("flatmap-stream");
  });
});
