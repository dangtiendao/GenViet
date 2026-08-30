import { describe, it, expect } from "vitest";
import {
  FamilyTreeError,
  FAMILY_TREE_ERROR_CODES,
  FAMILY_TREE_ERROR_MESSAGES,
} from "@/features/family-trees/errors/family-tree.errors";

describe("Family Tree Error Taxonomy Tests (P11 / Section 32)", () => {
  it("should create error with default user-safe message for error code", () => {
    const error = new FamilyTreeError(FAMILY_TREE_ERROR_CODES.NOT_FOUND);
    expect(error.code).toBe(FAMILY_TREE_ERROR_CODES.NOT_FOUND);
    expect(error.message).toBe(FAMILY_TREE_ERROR_MESSAGES.FAMILY_TREE_NOT_FOUND);
    expect(error.isUserFacing).toBe(true);
  });

  it("should support custom message while retaining stable error code", () => {
    const customMsg = "Tên cây gia phả không được chứa ký tự đặc biệt lạ.";
    const error = new FamilyTreeError(FAMILY_TREE_ERROR_CODES.NAME_INVALID, customMsg);
    expect(error.code).toBe(FAMILY_TREE_ERROR_CODES.NAME_INVALID);
    expect(error.message).toBe(customMsg);
  });

  it("should have user-safe messages for all error codes in taxonomy", () => {
    Object.values(FAMILY_TREE_ERROR_CODES).forEach((code) => {
      const msg = FAMILY_TREE_ERROR_MESSAGES[code];
      expect(msg).toBeDefined();
      expect(msg.length).toBeGreaterThan(0);
      expect(msg).not.toContain("SQL");
      expect(msg).not.toContain("postgres");
      expect(msg).not.toContain("stack");
    });
  });
});
