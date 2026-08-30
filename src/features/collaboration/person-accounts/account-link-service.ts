import { AccountPersonLink, CreateAccountLinkInput } from "./account-link.types";

/**
 * Quản lý liên kết giữa Tài khoản người dùng (Auth User) và Nhân vật phả hệ (Person Node) (P27-T04)
 * Tuyệt đối không đồng nhất hai thực thể:
 * 1. User Account đại diện cho thực thể xác thực và phiên làm việc.
 * 2. Person Node đại diện cho một nhân vật lịch sử trong cây gia phả.
 * 3. Việc liên kết không tự động nâng cấp quyền hạn của User thành Owner.
 */

export function validateAccountLinkConstraints(
  input: CreateAccountLinkInput,
  existingLinks: AccountPersonLink[]
): { isValid: boolean; error?: string } {
  // Kiểm tra xem User này đã liên kết với Person nào khác trong cùng một cây chưa
  const existingInTree = existingLinks.find(
    (l) => l.treeId === input.treeId && l.userId === input.userId && l.status === "verified"
  );

  if (existingInTree && existingInTree.personId !== input.personId) {
    return {
      isValid: false,
      error: "User is already linked to another person node in this family tree.",
    };
  }

  return { isValid: true };
}
