import { describe, it, expect } from "vitest";
import { detectSchemaVersion } from "@/features/backups/versioning/version-detector";

describe("Backup Schema Version Detector", () => {
  it("nhận diện đúng phiên bản hiện tại (schemaVersion = 1)", () => {
    const res = detectSchemaVersion({ schemaVersion: 1 });
    expect(res.isSupported).toBe(true);
    expect(res.status).toBe("current");
    expect(res.schemaVersion).toBe(1);
  });

  it("từ chối phiên bản tương lai (schemaVersion = 2 hoặc 999)", () => {
    const res = detectSchemaVersion({ schemaVersion: 999 });
    expect(res.isSupported).toBe(false);
    expect(res.status).toBe("future");
  });

  it("từ chối khi thiếu schemaVersion", () => {
    const res = detectSchemaVersion({ tree: {} });
    expect(res.isSupported).toBe(false);
    expect(res.status).toBe("missing");
  });

  it("từ chối khi schemaVersion không phải số nguyên", () => {
    const res = detectSchemaVersion({ schemaVersion: "1.0" });
    expect(res.isSupported).toBe(false);
    expect(res.status).toBe("invalid");
  });
});
