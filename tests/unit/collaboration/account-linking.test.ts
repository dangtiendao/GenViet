import { describe, it, expect } from "vitest";
import { validateAccountLinkConstraints } from "@/features/collaboration/person-accounts/account-link-service";
import { AccountPersonLink } from "@/features/collaboration/person-accounts/account-link.types";

describe("P27-T04: Account-Person Linkage Constraints Tests", () => {
  it("chặn việc 1 tài khoản liên kết với 2 nhân vật khác nhau trong cùng 1 cây", () => {
    const existingLinks: AccountPersonLink[] = [
      {
        id: "link-1",
        treeId: "tree-1",
        userId: "user-1",
        personId: "person-1",
        status: "verified",
        linkedAt: new Date().toISOString(),
      },
    ];

    const validation = validateAccountLinkConstraints(
      { treeId: "tree-1", userId: "user-1", personId: "person-2" },
      existingLinks
    );

    expect(validation.isValid).toBe(false);
    expect(validation.error).toBeDefined();
  });

  it("cho phép liên kết khi chưa có liên kết nào trong cây", () => {
    const validation = validateAccountLinkConstraints(
      { treeId: "tree-1", userId: "user-2", personId: "person-3" },
      []
    );

    expect(validation.isValid).toBe(true);
  });
});
