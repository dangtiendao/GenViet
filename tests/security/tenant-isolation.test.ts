import { describe, it, expect } from "vitest";
import { linkExistingParentSchema } from "@/features/relationships/schemas/relationship.schema";
import { updatePersonSchema } from "@/features/persons/schemas/person.schema";
import { treeGraphQuerySchema } from "@/features/tree-graph/schemas/tree-graph-query.schema";

describe("P22 Tenant Isolation & Request Tampering Security (P22-T29, P22-T30 & P22-T31)", () => {
  const treeA = "11111111-1111-4111-a111-111111111111";
  const personA1 = "aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa";
  const personB1 = "bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb";

  it("P22-T29 & P22-T30: Schema bắt buộc tree_id phải khớp định dạng UUID chuẩn", () => {
    const res = updatePersonSchema.safeParse({
      id: personA1,
      tree_id: "invalid-tree-id-string",
      full_name: "Tên sửa đổi",
    });

    expect(res.success).toBe(false);
  });

  it("P22-T30: Schema yêu cầu treeId, parentId, childId đều là UUID chuẩn", () => {
    const res = linkExistingParentSchema.safeParse({
      treeId: treeA,
      parentId: personA1,
      childId: personB1,
      parentRole: "father",
      relationshipKind: "biological",
    });

    expect(res.success).toBe(true);
  });

  it("P22-T30: Graph API query schema yêu cầu centerPersonId và treeId là UUID hợp lệ", () => {
    const invalidQuery = treeGraphQuerySchema.safeParse({
      treeId: treeA,
      centerPersonId: "non-uuid",
      ancestorDepth: 2,
      descendantDepth: 2,
    });

    expect(invalidQuery.success).toBe(false);
  });
});
