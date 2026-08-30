import React from "react";
import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { RestoreRelationshipDialog } from "@/features/recovery/components/restore-relationship-dialog";
import type { TrashItemDto } from "@/features/recovery/types/recovery.types";

describe("Recovery UI Components", () => {
  const sampleTrashItem: TrashItemDto = {
    id: "11111111-1111-4111-a111-111111111111",
    treeId: "22222222-2222-4222-a222-222222222222",
    itemType: "parent_child_relationship",
    itemTypeLabel: "Quan hệ Cha/Mẹ - Con",
    displayName: "Nguyễn Văn Cha (Cha) → Nguyễn Văn Con",
    detailSummary: "Loại quan hệ: Ruột thịt",
    deletedAt: "2026-08-30T09:00:00.000Z",
    deletedBy: "33333333-3333-4333-a333-333333333333",
    version: 1,
    canRestore: true,
  };

  it("render RestoreRelationshipDialog hiển thị nút Khôi phục", () => {
    const html = renderToStaticMarkup(
      <RestoreRelationshipDialog treeId={sampleTrashItem.treeId} item={sampleTrashItem} />
    );
    expect(html).toContain("Khôi phục");
  });
});
