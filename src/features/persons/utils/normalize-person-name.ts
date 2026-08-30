/**
 * Chuẩn hóa tên nhân vật (lower-case, trim và thu gọn nhiều khoảng trắng liên tiếp)
 * Tương thích 100% với hàm SQL `_system.normalize_person_name` trong PostgreSQL.
 */
export function normalizePersonName(name?: string | null): string {
  if (!name) return "";
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}
