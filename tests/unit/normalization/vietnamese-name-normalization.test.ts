import { describe, it, expect } from "vitest";
import { normalizeVietnamese } from "@/features/person-search/utils/normalize-vietnamese";

describe("P22-T01: Chuẩn hóa tên tiếng Việt (Vietnamese Name Normalization)", () => {
  it("chuyển chữ hoa thành chữ thường và loại bỏ toàn bộ dấu thanh/dấu phụ", () => {
    expect(normalizeVietnamese("Nguyễn Văn An")).toBe("nguyen van an");
    expect(normalizeVietnamese("TRẦN THỊ ÁNH")).toBe("tran thi anh");
    expect(normalizeVietnamese("Lê Hoàng Đức")).toBe("le hoang duc");
  });

  it("chuyển đổi chính xác chữ 'đ' và 'Đ' thành 'd'", () => {
    expect(normalizeVietnamese("Đặng Tiến Đạo")).toBe("dang tien dao");
    expect(normalizeVietnamese("Đỗ Đình Đồng")).toBe("do dinh dong");
    expect(normalizeVietnamese("đinh đức")).toBe("dinh duc");
  });

  it("cắt khoảng trắng đầu/cuối và thu gọn nhiều khoảng trắng liên tiếp/tab/newline", () => {
    expect(normalizeVietnamese("   Nguyễn    Văn   An   ")).toBe("nguyen van an");
    expect(normalizeVietnamese("\tTrần\n\tThị\tÁnh\n")).toBe("tran thi anh");
  });

  it("xử lý đồng nhất cả Unicode NFD (tổ hợp) và NFC (dựng sẵn)", () => {
    // NFD: "H" + "o" + "a" + Combining Acute Accent
    const nfd = "Ho\u0300a";
    // NFC: "Hòa"
    const nfc = "H\u00F2a";

    expect(normalizeVietnamese(nfd)).toBe("hoa");
    expect(normalizeVietnamese(nfc)).toBe("hoa");
    expect(normalizeVietnamese(nfd)).toBe(normalizeVietnamese(nfc));
  });

  it("xử lý chuỗi rỗng hoặc chỉ chứa khoảng trắng một cách an toàn", () => {
    expect(normalizeVietnamese("")).toBe("");
    expect(normalizeVietnamese("   ")).toBe("");
  });
});
