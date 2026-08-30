import { describe, it, expect } from "vitest";
import {
  buildRelationshipPreview,
  getRelationshipKindLabel,
  getParentRoleLabel,
} from "@/features/relationships/utils/relationship-preview";

describe("Relationship Preview Builder", () => {
  it("tạo đúng preview khi thêm cha ruột", () => {
    const preview = buildRelationshipPreview({
      subjectPersonName: "Nguyễn Văn Con",
      relatedPersonName: "Nguyễn Văn Cha",
      actionType: "add_father",
      relationshipKind: "biological",
      parentRole: "father",
      verificationStatus: "verified",
    });

    expect(preview.summaryText).toContain("Nguyễn Văn Cha");
    expect(preview.summaryText).toContain("Cha ruột");
    expect(preview.summaryText).toContain("Nguyễn Văn Con");
  });

  it("tạo đúng preview khi kết đôi vợ chồng", () => {
    const preview = buildRelationshipPreview({
      subjectPersonName: "Lê Văn Chồng",
      relatedPersonName: "Trần Thị Vợ",
      actionType: "add_spouse",
    });

    expect(preview.summaryText).toContain("Lê Văn Chồng");
    expect(preview.summaryText).toContain("Trần Thị Vợ");
    expect(preview.summaryText).toContain("kết đôi (Hôn nhân)");
  });

  it("tạo đúng preview khi thêm con", () => {
    const preview = buildRelationshipPreview({
      subjectPersonName: "Phạm Văn Cha",
      relatedPersonName: "Phạm Văn Con",
      actionType: "add_child",
    });

    expect(preview.summaryText).toContain("Con của «Phạm Văn Cha»");
  });
});
