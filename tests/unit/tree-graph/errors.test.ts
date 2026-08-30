import { describe, it, expect } from "vitest";
import {
  TREE_GRAPH_ERROR_CODES,
  TREE_GRAPH_ERROR_TAXONOMY,
  TreeGraphDomainError,
} from "@/features/tree-graph/errors/tree-graph.errors";

describe("TreeGraph Error Taxonomy Tests (P14-T01)", () => {
  it("phân loại đúng mã lỗi FORBIDDEN với HTTP Status 403", () => {
    const errorDetail = TREE_GRAPH_ERROR_TAXONOMY[TREE_GRAPH_ERROR_CODES.FORBIDDEN];
    expect(errorDetail.httpStatus).toBe(403);
    expect(errorDetail.message).toContain("không có quyền xem");
  });

  it("phân loại đúng mã lỗi DEPTH_EXCEEDED với HTTP Status 400", () => {
    const errorDetail = TREE_GRAPH_ERROR_TAXONOMY[TREE_GRAPH_ERROR_CODES.DEPTH_EXCEEDED];
    expect(errorDetail.httpStatus).toBe(400);
    expect(errorDetail.message).toContain("tối đa 5 tầng");
  });

  it("khởi tạo TreeGraphDomainError với đầy đủ metadata", () => {
    const err = new TreeGraphDomainError(TREE_GRAPH_ERROR_CODES.TREE_MISMATCH);
    expect(err.code).toBe(TREE_GRAPH_ERROR_CODES.TREE_MISMATCH);
    expect(err.httpStatus).toBe(400);
    expect(err.message).toContain("không thuộc về cây gia phả");
  });
});
