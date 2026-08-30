import React from "react";
import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { VirtualizedPersonList } from "@/features/person-search/components/virtualized-person-list";
import type { PersonSearchResultItem } from "@/features/person-search/types/person-search.types";

describe("P23-T16: Danh sách tìm kiếm ảo hóa (Search List Virtualization)", () => {
  const generateMockResults = (count: number): PersonSearchResultItem[] => {
    return Array.from({ length: count }, (_, i) => ({
      id: `person-${i}`,
      treeId: "tree-1",
      treeName: "Gia Phả Họ Nguyễn",
      fullName: `Nguyễn Văn ${i}`,
      normalizedName: `nguyen van ${i}`,
      gender: "male",
      livingStatus: "living",
      birthDate: "1990-01-01",
      birthYear: 1990,
      birthDatePrecision: "exact",
      birthIsEstimated: false,
      deathDate: null,
      deathYear: null,
      deathDatePrecision: "unknown",
      deathIsEstimated: false,
      birthPlaceText: null,
      deathPlaceText: null,
      hometownText: null,
      burialPlaceText: null,
      occupationText: null,
      biography: null,
      avatarPath: null,
      verificationStatus: "verified",
      createdAt: "2026-08-30T10:00:00Z",
      updatedAt: "2026-08-30T10:00:00Z",
      parents: [],
      spouses: [],
      matchTier: 1,
      similarityScore: 1.0,
      matchSnippet: `Nguyễn Văn ${i}`,
    }));
  };

  it("chỉ render một lượng nhỏ DOM nodes cho danh sách 500 kết quả", () => {
    const results = generateMockResults(500);

    const html = renderToStaticMarkup(
      <VirtualizedPersonList
        results={results}
        containerHeight={600}
        itemHeight={180}
        overscan={2}
      />
    );

    // Kiểm tra số lượng kết quả xuất hiện trong HTML tĩnh (8 items * ~4 text references = ~32 occurrences, thay vì 2000)
    const matches = html.match(/Nguyễn Văn \d+/g) || [];
    expect(matches.length).toBeLessThan(60);
    expect(matches.length).toBeGreaterThan(0);
  });
});
