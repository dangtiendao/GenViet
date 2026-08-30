/**
 * Chuẩn hóa chuỗi tiếng Việt phục vụ tìm kiếm và so khớp không dấu
 * 100% đồng bộ với hàm SQL `_system.normalize_person_name(text)` trong PostgreSQL.
 *
 * Các bước chuẩn hóa:
 * 1. Trim & thu gọn khoảng trắng (spaces, tabs, newlines, NBSP) thành 1 khoảng trắng duy nhất.
 * 2. Chuyển chữ thường.
 * 3. Quy đổi 'đ' và 'Đ' thành 'd'.
 * 4. Tách tổ hợp ký tự Unicode (NFD) và loại bỏ các dấu thanh (\u0300 - \u036f).
 */
export function normalizeVietnamese(input?: string | null): string {
  if (!input) return "";

  const trimmed = input.trim().replace(/\s+/g, " ");
  if (!trimmed) return "";

  return trimmed
    .toLowerCase()
    .replace(/[đĐ]/g, "d")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
