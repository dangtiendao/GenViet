import { describe, it, expect } from "vitest";
import { FamilyTreeService } from "@/features/family-trees/services/family-tree.service";
import { RelationshipService } from "@/features/relationships/services/relationship.service";
import { RELATIONSHIP_ERROR_CODES } from "@/features/relationships/errors/relationship.errors";

describe("P22 Integration Tests (P22-T08 đến P22-T16)", () => {
  const treeId = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";
  const personA = "11111111-1111-4111-a111-111111111111";

  it("P22-T08: Tạo gia phả kiểm tra xác thực tên hợp lệ", async () => {
    await expect(
      FamilyTreeService.createFamilyTree("user-1", {
        name: "",
        description: null,
        privacyLevel: "private",
      })
    ).rejects.toThrow();
  });

  it("P22-T11: Phát hiện chu trình - từ chối khi tạo quan hệ cha con vòng lặp A -> A", async () => {
    await expect(
      RelationshipService.linkExistingParent("user-1", {
        treeId,
        parentId: personA,
        childId: personA,
        parentRole: "father",
        relationshipKind: "biological",
        verificationStatus: "unverified",
        confirmWarnings: false,
      })
    ).rejects.toThrow();
  });

  it("P22-T11: Định nghĩa mã lỗi chu trình CYCLE chuẩn xác", () => {
    expect(RELATIONSHIP_ERROR_CODES.CYCLE).toBe("RELATIONSHIP_CYCLE");
    expect(RELATIONSHIP_ERROR_CODES.SELF_LINK).toBe("RELATIONSHIP_SELF_LINK");
  });
});
