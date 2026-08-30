import { describe, it, expect } from "vitest";
import {
  computeFieldDiffs,
  isProposalStale,
} from "@/features/collaboration/proposals/proposal-differ";

describe("P27-T03: Edit Proposals & Concurrency Tests", () => {
  it("tính toán chính xác các trường dữ liệu có thay đổi", () => {
    const original = { fullName: "Nguyễn Văn A", gender: "male", birthYear: 1980 };
    const updated = { fullName: "Nguyễn Văn A", gender: "male", birthYear: 1985 };

    const diffs = computeFieldDiffs(original, updated, ["fullName", "gender", "birthYear"]);
    expect(diffs).toHaveLength(1);
    expect(diffs[0].fieldName).toBe("birthYear");
    expect(diffs[0].oldValue).toBe(1980);
    expect(diffs[0].newValue).toBe(1985);
  });

  it("phát hiện xung đột phiên bản cũ (Stale Version)", () => {
    expect(isProposalStale(1, 2)).toBe(true); // Đã bị sửa đổi ở phiên bản 2
    expect(isProposalStale(1, 1)).toBe(false); // Phiên bản khớp
  });
});
