import { describe, it, expect } from "vitest";
import {
  HIDDEN_REASON_PRIORITIES,
  type PublicHiddenReason,
} from "@/features/public-trees/contracts/public-hidden-reason";

describe("P30-T33: Public Hidden Reasons & Priority Resolution", () => {
  it("đảm bảo PRIVACY luôn có độ ưu tiên cao nhất (Priority 1) so với các lý do duyệt khác", () => {
    expect(HIDDEN_REASON_PRIORITIES.PRIVACY).toBe(1);
    expect(HIDDEN_REASON_PRIORITIES.PRIVACY).toBeLessThan(HIDDEN_REASON_PRIORITIES.PATERNAL_LINE);
    expect(HIDDEN_REASON_PRIORITIES.PRIVACY).toBeLessThan(HIDDEN_REASON_PRIORITIES.DEPTH_LIMIT);
  });

  it("sắp xếp thứ tự ưu tiên đúng: PRIVACY < PATERNAL_LINE < DEPTH_LIMIT", () => {
    const reasons: NonNullable<PublicHiddenReason>[] = ["DEPTH_LIMIT", "PRIVACY", "PATERNAL_LINE"];
    const sorted = [...reasons].sort(
      (a, b) => HIDDEN_REASON_PRIORITIES[a] - HIDDEN_REASON_PRIORITIES[b]
    );

    expect(sorted[0]).toBe("PRIVACY");
    expect(sorted[1]).toBe("PATERNAL_LINE");
    expect(sorted[2]).toBe("DEPTH_LIMIT");
  });
});
