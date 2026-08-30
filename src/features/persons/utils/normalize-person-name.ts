import { normalizeVietnamese } from "@/features/person-search/utils/normalize-vietnamese";

/**
 * Chuẩn hóa tên nhân vật (lower-case, không dấu, đ->d, trim và thu gọn nhiều khoảng trắng liên tiếp)
 * Tương thích 100% với hàm SQL `_system.normalize_person_name` trong PostgreSQL.
 */
export function normalizePersonName(name?: string | null): string {
  return normalizeVietnamese(name);
}
