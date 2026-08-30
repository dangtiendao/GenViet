import { describe, it, expect } from "vitest";
import { TreeGraphMapper } from "@/features/tree-graph/mappers/tree-graph.mapper";

describe("P22-T04: Chuyển đổi đồ thị thuần túy (Graph Conversion)", () => {
  const treeId = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";
  const personA = "11111111-1111-4111-a111-111111111111";
  const personB = "22222222-2222-4222-a222-222222222222";
  const personC = "33333333-3333-4333-a333-333333333333";
  const union1 = "44444444-4444-4444-a444-444444444444";

  it("chuyển đổi danh sách raw nodes và edges thành TreeGraphResponseDto chuẩn xác", () => {
    const rawPersons = [
      {
        id: personA,
        fullName: "Cụ Tổ",
        gender: "male",
        livingStatus: "deceased",
        birthYear: 1900,
        birthDatePrecision: "year",
        deathYear: 1970,
        deathDatePrecision: "year",
      },
      {
        id: personB,
        fullName: "Con Trưởng",
        gender: "male",
        livingStatus: "living",
        birthYear: 1930,
        birthDatePrecision: "year",
      },
      {
        id: personC,
        fullName: "Con Dâu",
        gender: "female",
        livingStatus: "living",
        birthYear: 1935,
        birthDatePrecision: "year",
      },
    ];

    const rawUnions = [
      {
        id: union1,
        treeId,
        unionStatus: "active",
      },
    ];

    const rawUnionMembers = [
      { id: "um-1", unionId: union1, personId: personB, role: "spouse" },
      { id: "um-2", unionId: union1, personId: personC, role: "spouse" },
    ];

    const rawRelationships = [
      {
        id: "rel-1",
        treeId,
        parentId: personA,
        childId: personB,
        parentRole: "father",
        relationshipKind: "biological",
        verificationStatus: "verified",
      },
    ];

    const dto = TreeGraphMapper.mapToTreeGraphDto({
      schemaVersion: 1,
      treeId,
      centerPersonId: personA,
      persons: rawPersons,
      unions: rawUnions,
      unionMembers: rawUnionMembers,
      parentChildRelationships: rawRelationships,
      limits: {
        requestedAncestorDepth: 5,
        requestedDescendantDepth: 5,
        appliedAncestorDepth: 5,
        appliedDescendantDepth: 5,
        maxAncestorDepth: 5,
        maxDescendantDepth: 5,
        maxPersonsBudget: 250,
        maxRelationshipsBudget: 500,
        maxUnionsBudget: 150,
        returnedPersonCount: 3,
        returnedRelationshipCount: 1,
        returnedUnionCount: 1,
        truncated: false,
      },
    });

    expect(dto.treeId).toBe(treeId);
    expect(dto.centerPersonId).toBe(personA);
    expect(dto.persons.length).toBe(3);
    expect(dto.unions.length).toBe(1);
    expect(dto.parentChildRelationships.length).toBe(1);

    // Đảm bảo không có dangling relationship (cha hoặc con không tồn tại trong persons)
    const personIds = new Set(dto.persons.map((p) => p.id));
    dto.parentChildRelationships.forEach((rel) => {
      expect(personIds.has(rel.parentId)).toBe(true);
      expect(personIds.has(rel.childId)).toBe(true);
    });
  });
});
