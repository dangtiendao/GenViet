import { describe, it, expect } from "vitest";
import {
  RELATIONSHIP_ERROR_CODES,
  RELATIONSHIP_ERROR_TAXONOMY,
  RelationshipDomainError,
} from "@/features/relationships/errors/relationship.errors";

describe("Relationship Error Taxonomy & Domain Error", () => {
  it("phân loại đúng mã lỗi CYCLE là blocking error", () => {
    const errorDetail = RELATIONSHIP_ERROR_TAXONOMY[RELATIONSHIP_ERROR_CODES.CYCLE];
    expect(errorDetail.severity).toBe("blocking");
    expect(errorDetail.canConfirm).toBe(false);
    expect(errorDetail.message).toContain("chu trình thế hệ");
  });

  it("phân loại đúng mã lỗi EXISTING_VERIFIED_FATHER là warning", () => {
    const errorDetail =
      RELATIONSHIP_ERROR_TAXONOMY[RELATIONSHIP_ERROR_CODES.EXISTING_VERIFIED_FATHER];
    expect(errorDetail.severity).toBe("warning");
    expect(errorDetail.canConfirm).toBe(true);
  });

  it("khởi tạo RelationshipDomainError với đầy đủ metadata", () => {
    const err = new RelationshipDomainError(RELATIONSHIP_ERROR_CODES.SELF_LINK);
    expect(err.code).toBe(RELATIONSHIP_ERROR_CODES.SELF_LINK);
    expect(err.severity).toBe("blocking");
    expect(err.message).toContain("không thể tự làm cha");
  });
});
