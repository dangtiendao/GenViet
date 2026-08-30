import { describe, it, expect } from "vitest";
import {
  vietnameseLunarAdapter,
  getCanChiYear,
} from "@/features/events/lunar-calendar/vietnamese-lunar-calculator";

describe("P27-T07: Vietnamese Lunar Calendar Adapter Tests", () => {
  it("tính chính xác Can Chi cho các năm tiêu chuẩn", () => {
    expect(getCanChiYear(2024)).toBe("Giáp Thìn");
    expect(getCanChiYear(2025)).toBe("Ất Tỵ");
    expect(getCanChiYear(2026)).toBe("Bính Ngọ");
  });

  it("chuyển đổi ngày dương sang âm trong dải năm hỗ trợ", () => {
    const lunar = vietnameseLunarAdapter.solarToLunar(new Date(2026, 7, 30));
    expect(lunar.lunarYear).toBe(2026);
    expect(lunar.canChiYear).toBe("Bính Ngọ");
  });

  it("từ chối năm nằm ngoài dải hỗ trợ 1900 - 2100", () => {
    expect(() => vietnameseLunarAdapter.solarToLunar(new Date(1850, 1, 1))).toThrow();
  });
});
