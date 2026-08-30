import { describe, it, expect } from "vitest";
import { createPersonSchema } from "@/features/persons/schemas/person.schema";
import {
  mapPartialDateToDatabase,
  formatGenealogyDate,
} from "@/features/persons/utils/partial-date-mapper";

describe("P22-T02: Kiểm thử xác thực ngày tháng (Date Validation)", () => {
  const treeId = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";

  it("chấp nhận ngày sinh chính xác (exact date) hợp lệ", () => {
    const res = createPersonSchema.safeParse({
      treeId,
      fullName: "Nguyễn Văn A",
      gender: "male",
      livingStatus: "living",
      birthDate: "1990-05-15",
      birthPrecision: "exact",
    });
    expect(res.success).toBe(true);
  });

  it("chấp nhận ngày sinh chỉ có năm (year-only)", () => {
    const res = createPersonSchema.safeParse({
      treeId,
      fullName: "Nguyễn Văn B",
      gender: "male",
      livingStatus: "living",
      birthYear: 1950,
      birthPrecision: "year",
    });
    expect(res.success).toBe(true);
  });

  it("chấp nhận ngày sinh không xác định (unknown)", () => {
    const res = createPersonSchema.safeParse({
      treeId,
      fullName: "Nguyễn Văn C",
      gender: "other",
      livingStatus: "unknown",
      birthDate: null,
      birthPrecision: "unknown",
    });
    expect(res.success).toBe(true);
  });

  it("mapPartialDateToDatabase không tạo ngày giả 01/01 khi chỉ có năm (INV-002)", () => {
    const result = mapPartialDateToDatabase({
      precision: "year",
      year: 1950,
      month: null,
      day: null,
      isEstimated: false,
    });
    expect(result.date).toBeNull();
    expect(result.year).toBe(1950);
    expect(result.precision).toBe("year");
  });

  it("từ chối ngày mất trước ngày sinh (death before birth)", () => {
    const res = createPersonSchema.safeParse({
      treeId,
      fullName: "Cụ Tổ",
      gender: "male",
      livingStatus: "deceased",
      birthDate: "1900-01-01",
      birthPrecision: "exact",
      deathDate: "1850-01-01",
      deathPrecision: "exact",
    });

    expect(res.success).toBe(false);
  });

  it("formatGenealogyDate hiển thị đúng theo từng mức độ chính xác", () => {
    expect(formatGenealogyDate("1990-05-15", null, "exact", false)).toBe("15/5/1990");
    expect(formatGenealogyDate(null, 1950, "year", false)).toBe("Năm 1950");
    expect(formatGenealogyDate(null, null, "unknown", false)).toBe("Chưa rõ");
  });
});
