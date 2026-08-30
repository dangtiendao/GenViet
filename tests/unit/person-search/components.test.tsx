import React from "react";
import { describe, it, expect, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { SearchHighlight } from "@/features/person-search/components/search-highlight";
import { ParentContext } from "@/features/person-search/components/parent-context";
import { PersonSearchResultItemComponent } from "@/features/person-search/components/person-search-result-item";
import { PersonSearchFiltersComponent } from "@/features/person-search/components/person-search-filters";
import type {
  PersonSearchResultItem,
  ParentSummary,
} from "@/features/person-search/types/person-search.types";

describe("Person Search UI Components Tests (P16-T15, P16-T16, P16-T17, P16-T18)", () => {
  const sampleParents: ParentSummary[] = [
    {
      id: "p-father",
      fullName: "Đặng Văn Bố",
      parentRole: "father",
      relationshipKind: "biological",
      verificationStatus: "verified",
    },
    {
      id: "p-mother",
      fullName: "Trần Thị Mẹ",
      parentRole: "mother",
      relationshipKind: "biological",
      verificationStatus: "verified",
    },
  ];

  const samplePerson: PersonSearchResultItem = {
    id: "p1111111-1111-4111-a111-111111111111",
    treeId: "t1111111-1111-4111-a111-111111111111",
    fullName: "Đặng Tiến Đạo",
    normalizedName: "dang tien dao",
    gender: "male",
    livingStatus: "living",
    birthDate: null,
    birthYear: 1980,
    birthDatePrecision: "year",
    birthIsEstimated: false,
    deathDate: null,
    deathYear: null,
    deathDatePrecision: "unknown",
    deathIsEstimated: false,
    hometownText: "Hải Phòng",
    occupationText: "Kỹ sư",
    verificationStatus: "verified",
    parents: sampleParents,
    matchTier: 1,
    similarityScore: 1.0,
  };

  it("render SearchHighlight với thẻ mark chuẩn HTML5", () => {
    const html = renderToStaticMarkup(<SearchHighlight text="Đặng Tiến Đạo" query="dang" />);
    expect(html).toContain("<mark");
    expect(html).toContain("Đặng");
  });

  it("render ParentContext với thông tin Cha và Mẹ", () => {
    const html = renderToStaticMarkup(<ParentContext parents={sampleParents} />);
    expect(html).toContain("Cha:");
    expect(html).toContain("Đặng Văn Bố");
    expect(html).toContain("Mẹ:");
    expect(html).toContain("Trần Thị Mẹ");
  });

  it("render fallback khi không có thông tin cha mẹ", () => {
    const html = renderToStaticMarkup(<ParentContext parents={[]} />);
    expect(html).toContain("Chưa có thông tin cha mẹ");
  });

  it("render PersonSearchResultItem với nút 'Xem hồ sơ' và 'Xem trên cây'", () => {
    const html = renderToStaticMarkup(
      <PersonSearchResultItemComponent person={samplePerson} searchQuery="dang" />
    );
    expect(html).toContain("Đặng Tiến Đạo");
    expect(html).toContain("Hải Phòng");
    expect(html).toContain("Xem hồ sơ");
    expect(html).toContain("Xem trên cây");
    expect(html).toContain(`href="/trees/${samplePerson.treeId}/people/${samplePerson.id}"`);
    expect(html).toContain(
      `href="/trees/${samplePerson.treeId}/tree?centerPersonId=${samplePerson.id}"`
    );
  });

  it("render PersonSearchFiltersComponent với các trường lựa chọn", () => {
    const html = renderToStaticMarkup(
      <PersonSearchFiltersComponent
        filters={{
          query: "",
          birthYear: 1980,
          livingStatus: "living",
          missingInformation: "none",
        }}
        onFilterChange={vi.fn()}
        onResetFilters={vi.fn()}
      />
    );
    expect(html).toContain("Trạng thái:");
    expect(html).toContain("Năm sinh:");
    expect(html).toContain("Hồ sơ thiếu:");
    expect(html).toContain("Đặt lại bộ lọc");
  });
});
