import type { DatePrecisionType } from "../types/person.types";
import type { PartialDateValue } from "@/components/forms/partial-date-input";

export interface DatabaseDateFields {
  date: string | null;
  year: number | null;
  precision: DatePrecisionType;
  isEstimated: boolean;
}

/**
 * Ánh xạ từ UI PartialDateValue sang các cột cơ sở dữ liệu (PostgreSQL columns)
 * Tuân thủ 100% Invariant INV-002: Tuyệt đối không sinh ngày giả 01/01 khi chỉ biết năm.
 */
export function mapPartialDateToDatabase(input?: PartialDateValue | null): DatabaseDateFields {
  if (!input || input.precision === "unknown") {
    return {
      date: null,
      year: null,
      precision: "unknown",
      isEstimated: false,
    };
  }

  if (input.precision === "exact" && input.year && input.month && input.day) {
    const yyyy = String(input.year).padStart(4, "0");
    const mm = String(input.month).padStart(2, "0");
    const dd = String(input.day).padStart(2, "0");
    const dateStr = `${yyyy}-${mm}-${dd}`;

    return {
      date: dateStr,
      year: null,
      precision: "exact",
      isEstimated: Boolean(input.isEstimated),
    };
  }

  if (
    (input.precision === "year" || input.precision === "month") &&
    input.year !== null &&
    input.year !== undefined
  ) {
    const yearNum = Number(input.year);
    if (!isNaN(yearNum) && yearNum >= 100 && yearNum <= 2500) {
      return {
        date: null,
        year: yearNum,
        precision: "year",
        isEstimated: Boolean(input.isEstimated),
      };
    }
  }

  return {
    date: null,
    year: null,
    precision: "unknown",
    isEstimated: false,
  };
}

/**
 * Ánh xạ từ các cột cơ sở dữ liệu sang UI PartialDateValue cho form
 */
export function mapDatabaseToPartialDate(
  date: string | null,
  year: number | null,
  precision: DatePrecisionType,
  isEstimated: boolean
): PartialDateValue {
  if (precision === "exact" && date) {
    const parts = date.split("-");
    if (parts.length === 3) {
      const [y, m, d] = parts.map((num) => parseInt(num, 10));
      return {
        precision: "exact",
        year: y || null,
        month: m || null,
        day: d || null,
        isEstimated: Boolean(isEstimated),
      };
    }
  }

  if (precision === "year" && year !== null && year !== undefined) {
    return {
      precision: "year",
      year: Number(year),
      month: null,
      day: null,
      isEstimated: Boolean(isEstimated),
    };
  }

  return {
    precision: "unknown",
    year: null,
    month: null,
    day: null,
    isEstimated: false,
  };
}

/**
 * Định dạng hiển thị ngày phả hệ thân thiện và chuẩn xác
 */
export function formatGenealogyDate(
  date: string | null,
  year: number | null,
  precision: DatePrecisionType,
  isEstimated: boolean
): string {
  const estimatedSuffix = isEstimated ? " (ước tính)" : "";

  if (precision === "exact" && date) {
    const [y, m, d] = date.split("-");
    if (y && m && d) {
      return `${parseInt(d, 10)}/${parseInt(m, 10)}/${y}${estimatedSuffix}`;
    }
    return `${date}${estimatedSuffix}`;
  }

  if (precision === "year" && year !== null && year !== undefined) {
    return `Năm ${year}${estimatedSuffix}`;
  }

  return "Chưa rõ";
}
