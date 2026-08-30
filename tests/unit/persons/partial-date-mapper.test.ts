import { describe, it, expect } from "vitest";
import {
  mapPartialDateToDatabase,
  mapDatabaseToPartialDate,
  formatGenealogyDate,
} from "@/features/persons/utils/partial-date-mapper";

describe("Partial Date Mapper & Invariant INV-002 (P12)", () => {
  describe("mapPartialDateToDatabase", () => {
    it("maps exact date with date string and null year", () => {
      const result = mapPartialDateToDatabase({
        precision: "exact",
        year: 1990,
        month: 5,
        day: 15,
        isEstimated: false,
      });

      expect(result).toEqual({
        date: "1990-05-15",
        year: null,
        precision: "exact",
        isEstimated: false,
      });
    });

    it("maps year-only with year number and null date (INV-002: Cấm tạo ngày giả 01/01)", () => {
      const result = mapPartialDateToDatabase({
        precision: "year",
        year: 1945,
        month: null,
        day: null,
        isEstimated: true,
      });

      expect(result).toEqual({
        date: null,
        year: 1945,
        precision: "year",
        isEstimated: true,
      });
      // Bảo đảm date tuyệt đối không phải là '1945-01-01'
      expect(result.date).toBeNull();
    });

    it("maps unknown date to all nulls", () => {
      const result = mapPartialDateToDatabase({
        precision: "unknown",
        year: null,
        month: null,
        day: null,
        isEstimated: false,
      });

      expect(result).toEqual({
        date: null,
        year: null,
        precision: "unknown",
        isEstimated: false,
      });
    });

    it("handles null / undefined input gracefully", () => {
      expect(mapPartialDateToDatabase(null)).toEqual({
        date: null,
        year: null,
        precision: "unknown",
        isEstimated: false,
      });
    });
  });

  describe("mapDatabaseToPartialDate", () => {
    it("maps database exact date to UI state", () => {
      const state = mapDatabaseToPartialDate("1988-12-25", null, "exact", false);
      expect(state).toEqual({
        precision: "exact",
        year: 1988,
        month: 12,
        day: 25,
        isEstimated: false,
      });
    });

    it("maps database year-only to UI state", () => {
      const state = mapDatabaseToPartialDate(null, 1920, "year", true);
      expect(state).toEqual({
        precision: "year",
        year: 1920,
        month: null,
        day: null,
        isEstimated: true,
      });
    });

    it("maps database unknown precision to UI state", () => {
      const state = mapDatabaseToPartialDate(null, null, "unknown", false);
      expect(state).toEqual({
        precision: "unknown",
        year: null,
        month: null,
        day: null,
        isEstimated: false,
      });
    });
  });

  describe("formatGenealogyDate", () => {
    it("formats exact date in Vietnamese DD/MM/YYYY", () => {
      expect(formatGenealogyDate("1995-09-02", null, "exact", false)).toBe("2/9/1995");
      expect(formatGenealogyDate("1995-09-02", null, "exact", true)).toBe("2/9/1995 (ước tính)");
    });

    it("formats year-only date with prefix", () => {
      expect(formatGenealogyDate(null, 1880, "year", false)).toBe("Năm 1880");
      expect(formatGenealogyDate(null, 1880, "year", true)).toBe("Năm 1880 (ước tính)");
    });

    it("formats unknown date cleanly", () => {
      expect(formatGenealogyDate(null, null, "unknown", false)).toBe("Chưa rõ");
    });
  });
});
