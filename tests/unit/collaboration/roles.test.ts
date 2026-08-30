import { describe, it, expect } from "vitest";
import { hasPermission, canManageRole } from "@/features/collaboration/roles/permission-matrix";

describe("P27-T01: Roles and Permissions Tests", () => {
  it("Owner có toàn quyền quản trị và chuyển nhượng quyền sở hữu", () => {
    expect(hasPermission("owner", "tree:transfer_ownership")).toBe(true);
    expect(hasPermission("owner", "tree:delete")).toBe(true);
    expect(hasPermission("owner", "person:merge")).toBe(true);
  });

  it("Admin có quyền duyệt đề xuất nhưng không được chuyển nhượng quyền sở hữu cây", () => {
    expect(hasPermission("admin", "proposal:review")).toBe(true);
    expect(hasPermission("admin", "person:merge")).toBe(true);
    expect(hasPermission("admin", "tree:transfer_ownership")).toBe(false);
  });

  it("Contributor chỉ có quyền xem và gửi đề xuất", () => {
    expect(hasPermission("contributor", "proposal:create")).toBe(true);
    expect(hasPermission("contributor", "person:create")).toBe(false);
    expect(hasPermission("contributor", "proposal:review")).toBe(false);
  });

  it("Admin không được gán quyền Owner hoặc hạ quyền Owner", () => {
    expect(canManageRole("admin", "editor")).toBe(true);
    expect(canManageRole("admin", "owner")).toBe(false);
  });
});
