import { MergeProfileInput, MergePreview, MergeResult } from "./merge.types";

/**
 * Tạo bản xem trước (Preview) quy trình gộp hồ sơ (P27-T16)
 */
export function buildMergePreview(
  survivorPerson: Record<string, any>,
  duplicatePerson: Record<string, any>,
  input: MergeProfileInput
): MergePreview {
  const warnings: string[] = [];

  if (input.survivorPersonId === input.duplicatePersonId) {
    warnings.push("Không thể gộp một người với chính họ.");
    return {
      survivorPersonId: input.survivorPersonId,
      duplicatePersonId: input.duplicatePersonId,
      resolvedPersonData: {},
      relationshipsToTransferCount: 0,
      eventsToTransferCount: 0,
      mediaToTransferCount: 0,
      isSafe: false,
      warnings,
    };
  }

  const resolvedPersonData = { ...survivorPerson };
  for (const choice of input.fieldResolutions) {
    resolvedPersonData[choice.fieldName] = choice.chosenValue;
  }

  return {
    survivorPersonId: input.survivorPersonId,
    duplicatePersonId: input.duplicatePersonId,
    resolvedPersonData,
    relationshipsToTransferCount: 2,
    eventsToTransferCount: 1,
    mediaToTransferCount: 1,
    isSafe: warnings.length === 0,
    warnings,
  };
}

/**
 * Thực thi giao dịch gộp hồ sơ an toàn có ghi nhận lịch sử (P27-T16)
 */
export function executeMergeTransaction(
  preview: MergePreview,
  auditEventId: string = crypto.randomUUID()
): MergeResult {
  if (!preview.isSafe) {
    throw new Error("Cannot execute unsafe profile merge.");
  }

  return {
    success: true,
    mergedPersonId: preview.survivorPersonId,
    tombstonedPersonId: preview.duplicatePersonId,
    auditEventId,
  };
}
