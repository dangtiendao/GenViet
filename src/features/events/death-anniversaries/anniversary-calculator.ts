import { DeathAnniversaryObservance, NextAnniversaryOccurrence } from "./death-anniversary.types";

function formatDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Tính toán ngày diễn ra lễ giỗ tiếp theo (P27-T06)
 */
export function calculateNextAnniversary(
  observance: DeathAnniversaryObservance,
  currentDate: Date = new Date()
): NextAnniversaryOccurrence {
  const currentYear = currentDate.getFullYear();

  if (observance.calendarSystem === "solar") {
    let targetDate = new Date(currentYear, observance.month - 1, observance.day);
    if (targetDate.getTime() < currentDate.getTime()) {
      targetDate = new Date(currentYear + 1, observance.month - 1, observance.day);
    }

    const diffMs = targetDate.getTime() - currentDate.getTime();
    const daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    return {
      solarDate: formatDateString(targetDate),
      lunarDateDescription: `Dương lịch: Ngày ${observance.day} tháng ${observance.month}`,
      daysRemaining,
    };
  }

  // Đối với Âm lịch (prototype approximation): Chuyển đổi tương ứng
  const estimatedTargetDate = new Date(currentYear, observance.month - 1, observance.day);
  if (estimatedTargetDate.getTime() < currentDate.getTime()) {
    estimatedTargetDate.setFullYear(currentYear + 1);
  }

  const diffMs = estimatedTargetDate.getTime() - currentDate.getTime();
  const daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  return {
    solarDate: formatDateString(estimatedTargetDate),
    lunarDateDescription: `Âm lịch: Ngày ${observance.day} tháng ${observance.month} (Năm ${estimatedTargetDate.getFullYear()})`,
    daysRemaining,
  };
}
