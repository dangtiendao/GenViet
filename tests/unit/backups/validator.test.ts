import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";
import { validateBackupFile } from "@/features/backups/services/backup-import-validator";
import { BACKUP_ERROR_CODES } from "@/features/backups/errors/backup.errors";

describe("Backup Import Multi-Layer Validator", () => {
  it("xác thực thành công tệp hợp lệ valid-v1.json và tính toán digest", () => {
    const filePath = resolve(__dirname, "../../fixtures/backups/valid-v1.json");
    const content = readFileSync(filePath, "utf-8");

    const result = validateBackupFile(content);
    expect(result.isValid).toBe(true);
    expect(result.doc).not.toBeNull();
    expect(result.preview).not.toBeNull();
    expect(result.preview?.personCount).toBe(3);
    expect(result.preview?.relationshipCount).toBe(2);
    expect(result.preview?.digestSha256).toHaveLength(64);
  });

  it("phát hiện chu trình tổ tiên - hậu duệ trong tampered-reference.json", () => {
    const filePath = resolve(__dirname, "../../fixtures/backups/tampered-reference.json");
    const content = readFileSync(filePath, "utf-8");

    const result = validateBackupFile(content);
    expect(result.isValid).toBe(false);
    expect(result.report.errors.some((e) => e.code === BACKUP_ERROR_CODES.CYCLE_DETECTED)).toBe(
      true
    );
  });

  it("phát hiện secret / token tiêm nhiễm trong oversized-metadata.json", () => {
    const filePath = resolve(__dirname, "../../fixtures/backups/oversized-metadata.json");
    const content = readFileSync(filePath, "utf-8");

    const result = validateBackupFile(content);
    expect(result.isValid).toBe(false);
    expect(
      result.report.errors.some((e) => e.code === BACKUP_ERROR_CODES.SECRET_FIELD_DETECTED)
    ).toBe(true);
  });

  it("từ chối tệp vượt quá 10 MB", () => {
    const bigContent = "a".repeat(11 * 1024 * 1024);
    const result = validateBackupFile(bigContent);
    expect(result.isValid).toBe(false);
    expect(result.report.errors[0]?.code).toBe(BACKUP_ERROR_CODES.FILE_TOO_LARGE);
  });

  it("chống prototype pollution với __proto__", () => {
    const maliciousJson = '{"__proto__": {"admin": true}, "schemaVersion": 1}';
    const result = validateBackupFile(maliciousJson);
    expect(result.isValid).toBe(false);
    expect(result.report.errors[0]?.code).toBe(BACKUP_ERROR_CODES.JSON_INVALID);
  });
});
