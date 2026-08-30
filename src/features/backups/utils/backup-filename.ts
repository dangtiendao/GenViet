/**
 * Tạo tên file an toàn cho bản sao lưu JSON (chống Header / CRLF Injection)
 */
export function generateSafeBackupFilename(treeName: string, date: Date = new Date()): string {
  // 1. Khử dấu và ký tự đặc biệt, chỉ giữ chữ cái, số, dấu gạch ngang
  const sanitizedName =
    treeName
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 50) || "tree";

  // 2. Định dạng timestamp UTC: YYYYMMDD-HHmmss
  const pad = (n: number) => String(n).padStart(2, "0");
  const timestamp = `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}-${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}`;

  return `genviet-${sanitizedName}-${timestamp}.json`;
}
