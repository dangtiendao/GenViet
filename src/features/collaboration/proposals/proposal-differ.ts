import { FieldDiff } from "./proposal.types";

/**
 * Tính toán chênh lệch trường dữ liệu có kiểm tra phiên bản (P27-T03)
 */
export function computeFieldDiffs(
  originalObj: Record<string, any>,
  updatedObj: Record<string, any>,
  allowedFields: string[]
): FieldDiff[] {
  const diffs: FieldDiff[] = [];

  for (const field of allowedFields) {
    const oldVal = originalObj[field];
    const newVal = updatedObj[field];

    if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
      diffs.push({
        fieldName: field,
        oldValue: oldVal,
        newValue: newVal,
      });
    }
  }

  return diffs;
}

/**
 * Kiểm tra xem phiên bản thực thể hiện tại có bị xung đột (Stale Version) so với thời điểm tạo đề xuất không
 */
export function isProposalStale(baseVersion: number, currentEntityVersion: number): boolean {
  return currentEntityVersion > baseVersion;
}
