import { describe, it, expect } from "vitest";
import { findShortestKinshipPath } from "@/features/kinship/relationship-path/relationship-path-engine";
import { findDuplicateCandidates } from "@/features/duplicate-management/detection/duplicate-detector";
import {
  buildMergePreview,
  executeMergeTransaction,
} from "@/features/duplicate-management/merge/merge-engine";
import { backupDocumentSchema } from "@/features/backups/schemas/backup-document.schema";
import { parseGedcomText } from "@/features/imports/gedcom/gedcom-parser";

describe("Full Domain Graph Preservation Tests (P28-T42 -> P28-T48)", () => {
  it("Kinship Path Engine tìm đường quan hệ qua nhánh nữ thành công (không bị cắt bởi PATERNAL_LINE)", () => {
    // A (Nam) -> B (Nữ) -> C (Nam)
    const persons = {
      pA: { id: "pA", fullName: "Ông Ngoại A", gender: "male" },
      pB: { id: "pB", fullName: "Mẹ B (Nữ)", gender: "female" },
      pC: { id: "pC", fullName: "Cháu Ngoại C", gender: "male" },
    };

    const edges = [
      { fromId: "pA", toId: "pB", type: "parent" as const },
      { fromId: "pB", toId: "pC", type: "parent" as const },
    ];

    const result = findShortestKinshipPath("pA", "pC", persons, edges);

    expect(result.found).toBe(true);
    expect(result.distance).toBe(2);
    expect(result.steps.length).toBe(2);
    expect(result.steps[0].fromPersonId).toBe("pA");
    expect(result.steps[1].fromPersonId).toBe("pB");
  });

  it("Duplicate Detection phát hiện hồ sơ trùng qua cả nhánh nữ", () => {
    const candidates = [
      {
        id: "p1",
        fullName: "Nguyễn Thị Mai",
        normalizedName: "nguyen thi mai",
        gender: "female",
        birthYear: 1985,
      },
      {
        id: "p2",
        fullName: "Nguyễn Thị Mai",
        normalizedName: "nguyen thi mai",
        gender: "female",
        birthYear: 1985,
      },
    ];

    const matches = findDuplicateCandidates(candidates, 40);
    expect(matches.length).toBeGreaterThan(0);
    expect(matches[0].scoreResult.score).toBeGreaterThanOrEqual(40);
  });

  it("Merge Engine xử lý trọn vẹn hợp nhất hồ sơ thuộc nhánh nữ", () => {
    const survivor = {
      id: "target-1",
      fullName: "Nguyễn Thị Hoa",
      gender: "female",
      birthYear: 1990,
      biography: "Gốc",
    };
    const duplicate = {
      id: "source-2",
      fullName: "Nguyễn Thị Hoa (Trùng)",
      gender: "female",
      birthYear: 1990,
      biography: "Bổ sung",
    };

    const preview = buildMergePreview(survivor, duplicate, {
      treeId: "11111111-1111-4111-a111-111111111111",
      survivorPersonId: "target-1",
      duplicatePersonId: "source-2",
      survivorBaseVersion: 1,
      duplicateBaseVersion: 1,
      fieldResolutions: [
        { fieldName: "biography", chosenValue: "Bổ sung", sourcePersonId: "source-2" },
      ],
    });

    expect(preview.isSafe).toBe(true);
    expect(preview.resolvedPersonData.biography).toBe("Bổ sung");

    const result = executeMergeTransaction(preview);
    expect(result.success).toBe(true);
    expect(result.mergedPersonId).toBe("target-1");
  });

  it("JSON Backup Schema validation xác nhận cấu trúc bảo toàn dữ liệu nhánh nữ", () => {
    const backupDoc = {
      schemaVersion: 1,
      exportedAt: new Date().toISOString(),
      generator: {
        name: "GenViet",
        version: "0.1.0",
      },
      tree: {
        sourceId: "11111111-1111-4111-a111-111111111111",
        name: "Cây Gia Phả",
        description: null,
        privacyLevel: "private" as const,
      },
      persons: [
        {
          sourceId: "22222222-2222-4222-a222-222222222222",
          fullName: "Cụ Tổ",
          gender: "male" as const,
          livingStatus: "deceased" as const,
          birthYear: 1920,
          birthDatePrecision: "year" as const,
          birthIsEstimated: false,
          verificationStatus: "verified" as const,
        },
        {
          sourceId: "33333333-3333-4333-a333-333333333333",
          fullName: "Con Gái (Nữ)",
          gender: "female" as const,
          livingStatus: "living" as const,
          birthYear: 1955,
          birthDatePrecision: "year" as const,
          birthIsEstimated: false,
          verificationStatus: "verified" as const,
        },
        {
          sourceId: "44444444-4444-4444-a444-444444444444",
          fullName: "Cháu Ngoại (Nam)",
          gender: "male" as const,
          livingStatus: "living" as const,
          birthYear: 1980,
          birthDatePrecision: "year" as const,
          birthIsEstimated: false,
          verificationStatus: "verified" as const,
        },
      ],
      parentChildRelationships: [
        {
          sourceId: "55555555-5555-4555-a555-555555555555",
          parentId: "22222222-2222-4222-a222-222222222222",
          childId: "33333333-3333-4333-a333-333333333333",
          parentRole: "father" as const,
          relationshipKind: "biological" as const,
          verificationStatus: "verified" as const,
        },
        {
          sourceId: "66666666-6666-4666-a666-666666666666",
          parentId: "33333333-3333-4333-a333-333333333333",
          childId: "44444444-4444-4444-a444-444444444444",
          parentRole: "mother" as const,
          relationshipKind: "biological" as const,
          verificationStatus: "verified" as const,
        },
      ],
      unions: [],
      unionMembers: [],
      mediaMetadata: [],
      manifest: {
        personCount: 3,
        relationshipCount: 2,
        unionCount: 0,
        mediaCount: 0,
      },
    };

    const parsed = backupDocumentSchema.parse(backupDoc);
    expect(parsed.persons.length).toBe(3);
    expect(parsed.parentChildRelationships.length).toBe(2);
  });

  it("GEDCOM parser phân tích đầy đủ gia đình qua nhánh nữ", () => {
    const gedcomRaw = `
0 HEAD
1 CHAR UTF-8
0 @I1@ INDI
1 NAME Cụ Tổ /Nguyễn/
1 SEX M
1 FAMS @F1@
0 @I2@ INDI
1 NAME Con Gái /Nguyễn/
1 SEX F
1 FAMC @F1@
1 FAMS @F2@
0 @I3@ INDI
1 NAME Cháu Ngoại /Trần/
1 SEX M
1 FAMC @F2@
0 @F1@ FAM
1 HUSB @I1@
1 CHIL @I2@
0 @F2@ FAM
1 WIFE @I2@
1 CHIL @I3@
0 TRLR
`;

    const parsed = parseGedcomText(gedcomRaw);
    expect(parsed.individuals.length).toBe(3);
    expect(parsed.families.length).toBe(2);
  });
});
