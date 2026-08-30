import { describe, it, expect } from "vitest";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { RelationshipPreviewCard } from "@/features/relationships/components/relationship-preview";
import { RelationshipActionMenu } from "@/features/relationships/components/relationship-action-menu";
import { buildRelationshipPreview } from "@/features/relationships/utils/relationship-preview";

describe("Relationship UI Components", () => {
  it("render RelationshipPreviewCard với preview và cảnh báo", () => {
    const preview = buildRelationshipPreview({
      subjectPersonName: "Nguyễn Văn A",
      relatedPersonName: "Nguyễn Văn B",
      actionType: "add_father",
      relationshipKind: "biological",
      parentRole: "father",
      verificationStatus: "verified",
    });

    const html = renderToStaticMarkup(
      <RelationshipPreviewCard preview={preview} warningMessage="Cảnh báo cha ruột đã tồn tại" />
    );

    expect(html).toContain("Xem trước quan hệ");
    expect(html).toContain("Nguyễn Văn A");
    expect(html).toContain("Nguyễn Văn B");
    expect(html).toContain("Cảnh báo cha ruột đã tồn tại");
  });

  it("render RelationshipActionMenu cho writer", () => {
    const html = renderToStaticMarkup(
      <RelationshipActionMenu
        treeId="11111111-1111-1111-1111-111111111111"
        personId="22222222-2222-2222-2222-222222222222"
        personName="Nguyễn Văn A"
        canWrite={true}
      />
    );

    expect(html).toContain("Thêm người thân");
  });

  it("ẩn RelationshipActionMenu khi canWrite là false", () => {
    const html = renderToStaticMarkup(
      <RelationshipActionMenu
        treeId="11111111-1111-1111-1111-111111111111"
        personId="22222222-2222-2222-2222-222222222222"
        personName="Nguyễn Văn A"
        canWrite={false}
      />
    );

    expect(html).toBe("");
  });
});
