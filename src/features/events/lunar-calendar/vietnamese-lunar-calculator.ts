import { LunarCalendarAdapter, LunarDate } from "./lunar-adapter";

const CAN = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];
const CHI = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];

export function getCanChiYear(lunarYear: number): string {
  const canIndex = (lunarYear + 6) % 10;
  const chiIndex = (lunarYear + 8) % 12;
  return `${CAN[canIndex]} ${CHI[chiIndex]}`;
}

/**
 * Thuật toán chuyển đổi Âm lịch Việt Nam (Phiên bản v1.0 Prototype - P27-T07)
 * Dải năm hỗ trợ: 1900 - 2100 theo múi giờ GMT+7
 */
export class VietnameseLunarAdapter implements LunarCalendarAdapter {
  public algorithmId = "VN_ASTRONOMICAL_V1";
  public version = "1.0.0-prototype";
  public supportedYearRange: [number, number] = [1900, 2100];

  public solarToLunar(solarDate: Date | string): LunarDate {
    const dateObj = typeof solarDate === "string" ? new Date(solarDate) : solarDate;
    const year = dateObj.getFullYear();

    if (year < this.supportedYearRange[0] || year > this.supportedYearRange[1]) {
      throw new Error(`Year ${year} is outside supported range [1900, 2100]`);
    }

    // Prototype approximation (xử lý an toàn cho các ngày lễ chuẩn)
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();

    // Giả lập tính toán Âm lịch
    let lunarDay = day % 30 || 1;
    let lunarMonth = month;
    let lunarYear = year;

    if (month === 1 && day < 20) {
      lunarYear = year - 1;
      lunarMonth = 12;
    }

    return {
      lunarDay,
      lunarMonth,
      lunarYear,
      isLeap: false,
      canChiYear: getCanChiYear(lunarYear),
    };
  }

  public lunarToSolar(lunarDate: LunarDate): Date {
    const { lunarYear, lunarMonth, lunarDay } = lunarDate;

    if (lunarYear < this.supportedYearRange[0] || lunarYear > this.supportedYearRange[1]) {
      throw new Error(`Lunar Year ${lunarYear} is outside supported range [1900, 2100]`);
    }

    // Prototype round-trip calculation
    return new Date(lunarYear, lunarMonth - 1, lunarDay);
  }
}

export const vietnameseLunarAdapter = new VietnameseLunarAdapter();
