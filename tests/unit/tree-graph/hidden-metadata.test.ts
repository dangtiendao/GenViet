import { describe, it, expect } from "vitest";
import { TreeGraphMapper } from "@/features/tree-graph/mappers/tree-graph.mapper";

describe("Hidden Descendant Metadata & DTO Mapper Tests (P28-T08 -> P28-T10, P28-T29)", () => {
  const treeId = "11111111-1111-4111-a111-111111111111";
  const centerId = "22222222-2222-4222-a222-222222222222";
  const femaleId = "33333333-3333-4333-a333-333333333333";

  it("ánh xạ chính xác hasHiddenDescendants và truncationReason từ raw RPC payload", () => {
    const rawPayload = {
      schemaVersion: 1,
      treeId,
      centerPersonId: centerId,
      descendantTraversalMode: "PATERNAL_LINE",
      persons: [
        {
          id: centerId,
          fullName: "Nguyễn Văn A (Nam)",
          gender: "male",
          livingStatus: "living",
          isCenter: true,
        },
        {
          id: femaleId,
          fullName: "Nguyễn Thị B (Nữ)",
          gender: "female",
          livingStatus: "living",
          isCenter: false,
        },
      ],
      parentChildRelationships: [
        {
          id: "r1",
          parentId: centerId,
          childId: femaleId,
          parentRole: "father",
          relationshipKind: "biological",
          verificationStatus: "verified",
        },
      ],
      unions: [],
      unionMembers: [],
      expansion: {
        [femaleId]: {
          hasMoreAncestors: false,
          hasMoreDescendants: true,
          hasHiddenDescendants: true,
          descendantsTruncated: true,
          truncationReason: "PATERNAL_LINE",
          canExpandDescendants: false,
        },
      },
      limits: {
        requestedAncestorDepth: 2,
        requestedDescendantDepth: 2,
        appliedAncestorDepth: 2,
        appliedDescendantDepth: 2,
        maxAncestorDepth: 5,
        maxDescendantDepth: 5,
        maxPersonsBudget: 250,
        maxRelationshipsBudget: 500,
        maxUnionsBudget: 150,
        returnedPersonCount: 2,
        returnedRelationshipCount: 1,
        returnedUnionCount: 0,
        truncated: false,
      },
      truncated: false,
    };

    const dto = TreeGraphMapper.mapToTreeGraphDto(rawPayload);

    expect(dto.descendantTraversalMode).toBe("PATERNAL_LINE");
    expect(dto.expansion[femaleId]).toBeDefined();
    expect(dto.expansion[femaleId].hasHiddenDescendants).toBe(true);
    expect(dto.expansion[femaleId].descendantsTruncated).toBe(true);
    expect(dto.expansion[femaleId].truncationReason).toBe("PATERNAL_LINE");
    expect(dto.expansion[femaleId].canExpandDescendants).toBe(false);
  });

  it("mặc định descendantTraversalMode là PATERNAL_LINE nếu raw payload không có", () => {
    const rawPayload = {
      schemaVersion: 1,
      treeId,
      centerPersonId: centerId,
      persons: [
        {
          id: centerId,
          fullName: "Nguyễn Văn A",
          gender: "male",
          livingStatus: "living",
          isCenter: true,
        },
      ],
      parentChildRelationships: [],
      unions: [],
      unionMembers: [],
      expansion: {},
      limits: {},
    };

    const dto = TreeGraphMapper.mapToTreeGraphDto(rawPayload);
    expect(dto.descendantTraversalMode).toBe("PATERNAL_LINE");
  });
});
