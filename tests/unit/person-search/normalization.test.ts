import { describe, it, expect } from "vitest";
import { normalizeVietnamese } from "@/features/person-search/utils/normalize-vietnamese";

describe("Vietnamese Search Normalization Tests (P16-T01, P16-T02, P16-T03, P16-T19)", () => {
  it("bỏ dấu tiếng Việt cơ bản chính xác", () => {
    expect(normalizeVietnamese("Nguyễn Văn An")).toBe("nguyen van an");
    expect(normalizeVietnamese("Trần Thị Ánh")).toBe("tran thi anh");
    expect(normalizeVietnamese("Hoàng Quốc Việt")).toBe("hoang quoc viet");
  });

  it("quy đổi ký tự 'đ' và 'Đ' thành 'd'", () => {
    expect(normalizeVietnamese("Đặng Tiến Đạo")).toBe("dang tien dao");
    expect(normalizeVietnamese("Đỗ Minh Đức")).toBe("do minh duc");
    expect(normalizeVietnamese("đinh bộ lĩnh")).toBe("dinh bo linh");
  });

  it("thu gọn khoảng trắng đầu/cuối, nhiều khoảng trắng liên tiếp, tab và newline", () => {
    expect(normalizeVietnamese("   Nguyễn   Văn   An   ")).toBe("nguyen van an");
    expect(normalizeVietnamese("Lê\t\tThị\n\nHương")).toBe("le thi huong");
    expect(normalizeVietnamese("   ")).toBe("");
  });

  it("xử lý an toàn giá trị null hoặc undefined", () => {
    expect(normalizeVietnamese(null)).toBe("");
    expect(normalizeVietnamese(undefined)).toBe("");
    expect(normalizeVietnamese("")).toBe("");
  });

  it("xử lý ký tự hoa thường kết hợp (Mixed Case) và dấu thanh tiếng Việt phức tạp", () => {
    expect(normalizeVietnamese("VŨ THỊ HƯỜNG")).toBe("vu thi huong");
    expect(normalizeVietnamese("pHạM nGọC hỒ")).toBe("pham ngoc ho");
    expect(normalizeVietnamese("Lý Thái Tổ")).toBe("ly thai to");
  });
});
