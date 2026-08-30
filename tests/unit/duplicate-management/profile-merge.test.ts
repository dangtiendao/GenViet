import { describe, it, expect } from "vitest";
import {
  buildMergePreview,
  executeMergeTransaction,
} from "@/features/duplicate-management/merge/merge-engine";

describe("P27-T16: Auditable Profile Merge Tests", () => {
  it("tạo bản xem trước gộp hồ sơ an toàn và phát hiện trường hợp tự gộp chính mình", () => {
    const p1 = { id: "p1", fullName: "Nguyễn Văn A", notes: "Ghi chú 1" };
    const p2 = { id: "p2", fullName: "Nguyễn Văn A (trùng)", notes: "Ghi chú 2" };

    const preview = buildMergePreview(p1, p2, {
      treeId: "tree-1",
      survivorPersonId: "p1",
      duplicatePersonId: "p2",
      survivorBaseVersion: 1,
      duplicateBaseVersion: 1,
      fieldResolutions: [{ fieldName: "notes", chosenValue: "Ghi chú 2", sourcePersonId: "p2" }],
    });

    expect(preview.isSafe).toBe(true);
    expect(preview.resolvedPersonData.notes).toBe("Ghi chú 2");
  });

  it("thực thi giao dịch gộp hồ sơ trả về ID người giữ lại và ID người bị xóa mềm kèm audit", () => {
    const preview = {
      survivorPersonId: "p1",
      duplicatePersonId: "p2",
      resolvedPersonData: { id: "p1", fullName: "Nguyễn Văn A" },
      relationshipsToTransferCount: 2,
      eventsToTransferCount: 1,
      mediaToTransferCount: 1,
      isSafe: true,
      warnings: [],
    };

    const result = executeMergeTransaction(preview, "audit-event-123");
    expect(result.success).toBe(true);
    expect(result.mergedPersonId).toBe("p1");
    expect(result.tombstonedPersonId).toBe("p2");
    expect(result.auditEventId).toBe("audit-event-123");
  });
});
