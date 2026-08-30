import { describe, it, expect } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { FamilyTreeCard } from "@/features/family-trees/components/family-tree-card";
import { FamilyTreeList } from "@/features/family-trees/components/family-tree-list";
import { FamilyTreeEmptyState } from "@/features/family-trees/components/family-tree-empty-state";
import type { FamilyTreeListItem } from "@/features/family-trees/types/family-tree.types";

describe("Family Tree UI Components Tests (P11-T01, P11-T16)", () => {
  const sampleTree: FamilyTreeListItem = {
    id: "11111111-1111-1111-1111-111111111111",
    name: "Gia phả Họ Lê Cổ Am",
    description: "Dòng họ phát tích tại Hải Phòng",
    status: "active",
    privacyLevel: "private",
    role: "owner",
    createdAt: "2026-08-30T00:00:00Z",
    updatedAt: "2026-08-30T00:00:00Z",
    generationAnchorPersonId: null,
  };

  it("should render family tree card with name, description, and owner badge", () => {
    const html = renderToStaticMarkup(<FamilyTreeCard tree={sampleTree} />);
    expect(html).toContain("Gia phả Họ Lê Cổ Am");
    expect(html).toContain("Dòng họ phát tích tại Hải Phòng");
    expect(html).toContain("Chủ sở hữu");
    expect(html).toContain("Riêng tư");
    expect(html).toContain('href="/trees/11111111-1111-1111-1111-111111111111"');
  });

  it("should render family tree list with tree count header and new tree button", () => {
    const html = renderToStaticMarkup(<FamilyTreeList trees={[sampleTree]} />);
    expect(html).toContain("Cây Gia Phả Của Bạn");
    expect(html).toContain("1 cây");
    expect(html).toContain("Tạo cây mới");
    expect(html).toContain("Gia phả Họ Lê Cổ Am");
  });

  it("should render empty state when trees array is empty", () => {
    const html = renderToStaticMarkup(<FamilyTreeEmptyState />);
    expect(html).toContain("Chưa có cây gia phả nào");
    expect(html).toContain("Tạo cây gia phả mới");
  });
});
