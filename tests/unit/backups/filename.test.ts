import { describe, it, expect } from "vitest";
import { generateSafeBackupFilename } from "@/features/backups/utils/backup-filename";

describe("Backup Filename Generator", () => {
  it("khử dấu tiếng Việt và ký tự đặc biệt thành công", () => {
    const filename = generateSafeBackupFilename("Dòng Họ Nguyễn Phúc (Cành 1) / 2026");
    expect(filename).toMatch(/^genviet-dong-ho-nguyen-phuc-canh-1-2026-\d{8}-\d{6}\.json$/);
  });

  it("chống Header Injection và CRLF", () => {
    const filename = generateSafeBackupFilename("Họ Lê\r\nSet-Cookie: session=123\n");
    expect(filename).not.toContain("\r");
    expect(filename).not.toContain("\n");
    expect(filename).toMatch(/^genviet-ho-le-set-cookie-session-123-\d{8}-\d{6}\.json$/);
  });
});
