import { describe, it, expect } from "vitest";
import {
  PublicTreeError,
  PUBLIC_TREE_ERROR_CODES,
} from "@/features/public-trees/errors/public-tree.errors";

describe("P30-T13, P30-T18: Public Tree Error Taxonomy Tests", () => {
  it("khởi tạo PublicTreeError với mã lỗi và HTTP status tương ứng", () => {
    const notFoundErr = new PublicTreeError(PUBLIC_TREE_ERROR_CODES.NOT_AVAILABLE);
    expect(notFoundErr.code).toBe("PUBLIC_TREE_NOT_AVAILABLE");
    expect(notFoundErr.httpStatus).toBe(404);
    expect(notFoundErr.message).toContain("không tồn tại");

    const forbiddenErr = new PublicTreeError(PUBLIC_TREE_ERROR_CODES.PUBLISH_FORBIDDEN);
    expect(forbiddenErr.code).toBe("PUBLIC_TREE_PUBLISH_FORBIDDEN");
    expect(forbiddenErr.httpStatus).toBe(403);

    const conflictErr = new PublicTreeError(PUBLIC_TREE_ERROR_CODES.SLUG_CONFLICT);
    expect(conflictErr.code).toBe("PUBLIC_TREE_SLUG_CONFLICT");
    expect(conflictErr.httpStatus).toBe(409);
  });
});
