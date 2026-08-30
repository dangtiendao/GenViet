import { describe, it, expect } from "vitest";
import {
  timingSafeStringEqual,
  extractSecretFromHeaders,
  verifyHeartbeatSecret,
} from "@/features/operations/heartbeat/heartbeat-auth";

describe("Heartbeat Authentication & Web Crypto Helper (P21-T06 & P21-T07)", () => {
  const SECRET = "genviet_super_secret_heartbeat_token_2026";

  describe("timingSafeStringEqual", () => {
    it("trả về true khi hai chuỗi giống hệt nhau", async () => {
      const result = await timingSafeStringEqual(SECRET, SECRET);
      expect(result).toBe(true);
    });

    it("trả về false khi hai chuỗi khác nhau về ký tự", async () => {
      const result = await timingSafeStringEqual(SECRET, "genviet_wrong_secret_token_2026");
      expect(result).toBe(false);
    });

    it("trả về false khi hai chuỗi khác nhau về độ dài", async () => {
      const result = await timingSafeStringEqual(SECRET, SECRET.slice(0, 10));
      expect(result).toBe(false);
    });

    it("trả về false khi một trong hai chuỗi rỗng", async () => {
      expect(await timingSafeStringEqual(SECRET, "")).toBe(false);
      expect(await timingSafeStringEqual("", SECRET)).toBe(false);
      expect(await timingSafeStringEqual("", "")).toBe(false);
    });
  });

  describe("extractSecretFromHeaders", () => {
    it("trích xuất chính xác token từ Authorization Bearer header", () => {
      const token = extractSecretFromHeaders(`Bearer ${SECRET}`, null);
      expect(token).toBe(SECRET);
    });

    it("trích xuất chính xác token không phân biệt chữ hoa chữ thường của từ khóa Bearer", () => {
      const token = extractSecretFromHeaders(`bearer ${SECRET}`, null);
      expect(token).toBe(SECRET);
    });

    it("trích xuất token từ x-heartbeat-secret header khi không có Authorization header", () => {
      const token = extractSecretFromHeaders(null, SECRET);
      expect(token).toBe(SECRET);
    });

    it("trả về null khi cả hai headers đều thiếu hoặc không đúng định dạng", () => {
      expect(extractSecretFromHeaders(null, null)).toBeNull();
      expect(extractSecretFromHeaders("Basic dXNlcjpwYXNz", null)).toBeNull();
      expect(extractSecretFromHeaders("", "")).toBeNull();
    });
  });

  describe("verifyHeartbeatSecret", () => {
    it("xác minh thành công khi client gửi đúng secret qua Authorization Bearer header", async () => {
      const isValid = await verifyHeartbeatSecret(`Bearer ${SECRET}`, null, SECRET);
      expect(isValid).toBe(true);
    });

    it("xác minh thành công khi client gửi đúng secret qua x-heartbeat-secret header", async () => {
      const isValid = await verifyHeartbeatSecret(null, SECRET, SECRET);
      expect(isValid).toBe(true);
    });

    it("từ chối khi client gửi sai secret", async () => {
      const isValid = await verifyHeartbeatSecret("Bearer wrong_secret", null, SECRET);
      expect(isValid).toBe(false);
    });

    it("từ chối khi server chưa cấu hình expected secret", async () => {
      const isValid = await verifyHeartbeatSecret(`Bearer ${SECRET}`, null, undefined);
      expect(isValid).toBe(false);
    });
  });
});
