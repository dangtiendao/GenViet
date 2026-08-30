import { describe, it, expect } from "vitest";
import { TreeGraphMapper } from "@/features/tree-graph/mappers/tree-graph.mapper";

describe("TreeGraphMapper & Consistency Validator Tests (P14-T01, P14-T07, P14-T08)", () => {
  const treeId = "11111111-1111-4111-a111-111111111111";
  const centerId = "22222222-2222-4222-a222-222222222222";
  const parentId = "33333333-3333-4333-a333-333333333333";
  const orphanId = "99999999-9999-4999-a999-999999999999";

  it("chuyển đổi thành công payload thô hợp lệ sang TreeGraphDto", () => {
    const rawData = {
      schemaVersion: 1,
      treeId,
      centerPersonId: centerId,
      persons: [
        {
          id: centerId,
          fullName: "Nguyễn Văn Trung Tâm",
          gender: "male",
          livingStatus: "living",
          isCenter: true,
        },
        {
          id: parentId,
          fullName: "Nguyễn Văn Cha",
          gender: "male",
          livingStatus: "deceased",
          isCenter: false,
        },
      ],
      parentChildRelationships: [
        {
          id: "r1",
          parentId: parentId,
          childId: centerId,
          parentRole: "father",
          relationshipKind: "biological",
          verificationStatus: "verified",
        },
      ],
      unions: [],
      unionMembers: [],
      expansion: {
        [centerId]: {
          hasMoreAncestors: false,
          hasMoreDescendants: false,
          canAddFather: false,
          canAddMother: true,
          canExpandAncestors: false,
          canExpandDescendants: false,
          hasVerifiedBiologicalFather: true,
          hasVerifiedBiologicalMother: false,
        },
      },
      limits: {
        requestedAncestorDepth: 2,
        requestedDescendantDepth: 2,
        appliedAncestorDepth: 2,
        appliedDescendantDepth: 2,
      },
    };

    const dto = TreeGraphMapper.mapToTreeGraphDto(rawData);

    expect(dto.schemaVersion).toBe(1);
    expect(dto.treeId).toBe(treeId);
    expect(dto.centerPersonId).toBe(centerId);
    expect(dto.persons).toHaveLength(2);
    expect(dto.parentChildRelationships).toHaveLength(1);
    expect(dto.expansion[centerId].canAddFather).toBe(false);
  });

  it("khử trùng lặp Person ID một cách tất định", () => {
    const rawData = {
      treeId,
      centerPersonId: centerId,
      persons: [
        { id: centerId, fullName: "Nguyễn Văn A" },
        { id: centerId, fullName: "Nguyễn Văn A (Trùng)" },
      ],
      parentChildRelationships: [],
      unions: [],
      unionMembers: [],
    };

    const dto = TreeGraphMapper.mapToTreeGraphDto(rawData);
    expect(dto.persons).toHaveLength(1);
    expect(dto.persons[0].id).toBe(centerId);
  });

  it("loại bỏ các cạnh mồ côi (Dangling Relationships) trỏ đến person không có trong slice", () => {
    const rawData = {
      treeId,
      centerPersonId: centerId,
      persons: [{ id: centerId, fullName: "Nguyễn Văn A" }],
      parentChildRelationships: [
        {
          id: "r_orphan",
          parentId: orphanId, // orphanId không nằm trong persons
          childId: centerId,
          parentRole: "father",
        },
      ],
      unions: [],
      unionMembers: [],
    };

    const dto = TreeGraphMapper.mapToTreeGraphDto(rawData);
    expect(dto.parentChildRelationships).toHaveLength(0);
  });

  it("tung lỗi INCONSISTENT nếu Center Person không có trong danh sách persons", () => {
    const rawData = {
      treeId,
      centerPersonId: centerId,
      persons: [{ id: parentId, fullName: "Người Khác" }],
      parentChildRelationships: [],
      unions: [],
      unionMembers: [],
    };

    expect(() => TreeGraphMapper.mapToTreeGraphDto(rawData)).toThrow();
  });
});
