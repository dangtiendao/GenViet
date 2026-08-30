import React from "react";
import { describe, it, expect, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { TreeToolbar } from "@/features/tree-view/components/tree-toolbar";
import type { GraphPersonDto } from "@/features/tree-graph/types/tree-graph.types";

describe("TreeToolbar Component Tests", () => {
  const mockCenterPerson: GraphPersonDto = {
    id: "p1",
    fullName: "Đặng Tiến Vịnh",
    gender: "male",
    livingStatus: "living",
    birthDate: null,
    birthYear: 1950,
    birthDatePrecision: "year",
    birthIsEstimated: false,
    deathDate: null,
    deathYear: null,
    deathDatePrecision: "unknown",
    deathIsEstimated: false,
    verificationStatus: "verified",
    isCenter: true,
  };

  it("render thông tin tâm điểm, độ sâu và nút Xem toàn bộ cây", () => {
    const html = renderToStaticMarkup(
      <TreeToolbar
        treeId="t1"
        centerPerson={mockCenterPerson}
        ancestorDepth={2}
        descendantDepth={2}
        onResetExpansion={vi.fn()}
        onExpandFullTree={vi.fn()}
        onReload={vi.fn()}
      />
    );

    expect(html).toContain("Đặng Tiến Vịnh");
    expect(html).toContain("Tổ tiên: 2 đời");
    expect(html).toContain("Hậu duệ: 2 đời");
    expect(html).toContain("Xem toàn bộ cây");
    expect(html).toContain("Tải lại cây");
    expect(html).toContain("Đặt lại độ sâu");
  });
});
