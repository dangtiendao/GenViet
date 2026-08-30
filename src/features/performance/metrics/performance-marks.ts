/**
 * Tiện ích đo lường thời gian thực thi bằng Web Performance User Timing API
 */
export class PerformanceTracker {
  /**
   * Đặt dấu mốc bắt đầu đo
   */
  static start(markName: string): void {
    if (typeof performance !== "undefined" && typeof performance.mark === "function") {
      try {
        performance.mark(`${markName}-start`);
      } catch {
        // Safe fallback
      }
    }
  }

  /**
   * Kết thúc và tính toán thời gian đo (ms)
   */
  static end(markName: string): number | null {
    if (
      typeof performance !== "undefined" &&
      typeof performance.mark === "function" &&
      typeof performance.measure === "function"
    ) {
      try {
        performance.mark(`${markName}-end`);
        performance.measure(markName, `${markName}-start`, `${markName}-end`);
        const entries = performance.getEntriesByName(markName);
        const lastEntry = entries[entries.length - 1];
        const duration = lastEntry ? lastEntry.duration : null;

        // Xóa entries để tránh rò rỉ bộ nhớ
        performance.clearMarks(`${markName}-start`);
        performance.clearMarks(`${markName}-end`);
        performance.clearMeasures(markName);

        return duration;
      } catch {
        return null;
      }
    }
    return null;
  }
}
