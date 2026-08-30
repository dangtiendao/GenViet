import { describe, it, expect, vi } from "vitest";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { PersonDetail } from "@/features/persons/components/person-detail";
import { PersonRelationshipList } from "@/features/persons/components/person-relationship-list";
import { SimilarPersonWarningDialog } from "@/features/persons/components/similar-person-warning";
import type { PersonDetail as PersonDetailType } from "@/features/persons/types/person.types";

const mockPersonDetail: PersonDetailType = {
  id: "p1111111-1111-4111-a111-111111111111",
  treeId: "t1111111-1111-4111-a111-111111111111",
  fullName: "Nguyễn Văn An",
  normalizedName: "nguyễn văn an",
  gender: "male",
  livingStatus: "living",
  birthDate: "1980-05-20",
  birthYear: null,
  birthDatePrecision: "exact",
  birthIsEstimated: false,
  deathDate: null,
  deathYear: null,
  deathDatePrecision: "unknown",
  deathIsEstimated: false,
  birthPlaceText: "Hà Nội",
  deathPlaceText: null,
  hometownText: "Nam Định",
  burialPlaceText: null,
  occupationText: "Kỹ sư phần mềm",
  biography: "Tiểu sử chi tiết của nhân vật.",
  verificationStatus: "verified",
  avatarPath: null,
  createdBy: "u1111111-1111-4111-a111-111111111111",
  updatedBy: "u1111111-1111-4111-a111-111111111111",
  deletedBy: null,
  createdAt: "2026-08-30T00:00:00.000Z",
  updatedAt: "2026-08-30T00:00:00.000Z",
  deletedAt: null,
  version: 2,
  isOwner: true,
  canEdit: true,
  relationships: {
    parents: [
      {
        id: "rel-1",
        parentRole: "father",
        relationshipKind: "biological",
        verificationStatus: "verified",
        parent: {
          id: "parent-1",
          fullName: "Nguyễn Văn Ba",
          gender: "male",
          livingStatus: "deceased",
          birthYear: 1950,
          deathYear: 2020,
        },
      },
    ],
    children: [
      {
        id: "rel-2",
        parentRole: "father",
        relationshipKind: "biological",
        verificationStatus: "verified",
        child: {
          id: "child-1",
          fullName: "Nguyễn Văn Con",
          gender: "male",
          livingStatus: "living",
          birthYear: 2010,
          deathYear: null,
        },
      },
    ],
    spouses: [
      {
        id: "rel-3",
        unionId: "u-1",
        role: "spouse",
        unionStatus: "active",
        spouse: {
          id: "spouse-1",
          fullName: "Trần Thị Mai",
          gender: "female",
          livingStatus: "living",
          birthYear: 1982,
          deathYear: null,
        },
      },
    ],
  },
};

describe("Person UI Components (P12)", () => {
  it("renders PersonDetail with full information and relationship badges", () => {
    const html = renderToStaticMarkup(<PersonDetail person={mockPersonDetail} />);

    expect(html).toContain("Nguyễn Văn An");
    expect(html).toContain("Kỹ sư phần mềm");
    expect(html).toContain("Nam Định");
    expect(html).toContain("Tiểu sử chi tiết của nhân vật.");
    expect(html).toContain("Phiên bản: v2");

    // Check relationship links
    expect(html).toContain("Nguyễn Văn Ba");
    expect(html).toContain("Trần Thị Mai");
    expect(html).toContain("Nguyễn Văn Con");
  });

  it("renders PersonRelationshipList empty state when no relations exist", () => {
    const html = renderToStaticMarkup(
      <PersonRelationshipList
        treeId="t1"
        personId="p1"
        relationships={{ parents: [], children: [], spouses: [] }}
      />
    );

    expect(html).toContain("Chưa có liên kết quan hệ");
  });

  it("renders SimilarPersonWarningDialog with candidates list", () => {
    const candidates = [
      {
        id: "c1",
        fullName: "Nguyễn Văn An",
        gender: "male" as const,
        livingStatus: "living" as const,
        birthYear: 1980,
        deathYear: null,
        hometownText: "Hà Nội",
      },
    ];

    const html = renderToStaticMarkup(
      <SimilarPersonWarningDialog
        isOpen={true}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        candidates={candidates}
      />
    );

    expect(html).toContain("Cảnh báo: Hồ sơ nhân vật tương tự");
    expect(html).toContain("Vẫn tạo nhân vật này");
  });
});
