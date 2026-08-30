export const FAMILY_TREE_ERROR_CODES = {
  NOT_FOUND: "FAMILY_TREE_NOT_FOUND",
  FORBIDDEN: "FAMILY_TREE_FORBIDDEN",
  NAME_INVALID: "FAMILY_TREE_NAME_INVALID",
  CREATE_FAILED: "FAMILY_TREE_CREATE_FAILED",
  VERSION_CONFLICT: "FAMILY_TREE_VERSION_CONFLICT",
  UPDATE_FAILED: "FAMILY_TREE_UPDATE_FAILED",
  PRIVACY_INVALID: "FAMILY_TREE_PRIVACY_INVALID",
  GENERATION_ANCHOR_INVALID: "FAMILY_TREE_GENERATION_ANCHOR_INVALID",
  SOFT_DELETE_FAILED: "FAMILY_TREE_SOFT_DELETE_FAILED",
  ALREADY_DELETED: "FAMILY_TREE_ALREADY_DELETED",
  RESTORE_FORBIDDEN: "FAMILY_TREE_RESTORE_FORBIDDEN",
  RESTORE_FAILED: "FAMILY_TREE_RESTORE_FAILED",
  CONFIRMATION_MISMATCH: "FAMILY_TREE_CONFIRMATION_MISMATCH",
  UNKNOWN_ERROR: "FAMILY_TREE_UNKNOWN_ERROR",
} as const;

export type FamilyTreeErrorCode =
  (typeof FAMILY_TREE_ERROR_CODES)[keyof typeof FAMILY_TREE_ERROR_CODES];

export const FAMILY_TREE_ERROR_MESSAGES: Record<FamilyTreeErrorCode, string> = {
  FAMILY_TREE_NOT_FOUND: "Không tìm thấy cây gia phả hoặc bạn không có quyền truy cập.",
  FAMILY_TREE_FORBIDDEN: "Bạn không có quyền thực hiện thao tác này trên cây gia phả.",
  FAMILY_TREE_NAME_INVALID: "Tên cây gia phả không hợp lệ hoặc để trống.",
  FAMILY_TREE_CREATE_FAILED: "Không thể tạo cây gia phả. Vui lòng thử lại sau.",
  FAMILY_TREE_VERSION_CONFLICT:
    "Dữ liệu đã bị thay đổi bởi người dùng khác. Vui lòng tải lại trang và thử lại.",
  FAMILY_TREE_UPDATE_FAILED: "Không thể cập nhật thông tin cây gia phả. Vui lòng thử lại.",
  FAMILY_TREE_PRIVACY_INVALID: "Mức độ riêng tư không hợp lệ.",
  FAMILY_TREE_GENERATION_ANCHOR_INVALID:
    "Nhân vật được chọn làm mốc số đời không thuộc cây gia phả này.",
  FAMILY_TREE_SOFT_DELETE_FAILED: "Không thể xóa cây gia phả. Vui lòng thử lại.",
  FAMILY_TREE_ALREADY_DELETED: "Cây gia phả này đã bị xóa trước đó.",
  FAMILY_TREE_RESTORE_FORBIDDEN: "Chỉ chủ sở hữu (Owner) mới có quyền khôi phục cây gia phả này.",
  FAMILY_TREE_RESTORE_FAILED: "Không thể khôi phục cây gia phả. Vui lòng thử lại.",
  FAMILY_TREE_CONFIRMATION_MISMATCH: "Tên cây gia phả xác nhận không khớp.",
  FAMILY_TREE_UNKNOWN_ERROR: "Đã xảy ra lỗi không xác định. Vui lòng thử lại.",
};

export class FamilyTreeError extends Error {
  readonly code: FamilyTreeErrorCode;
  readonly isUserFacing: boolean;

  constructor(code: FamilyTreeErrorCode, customMessage?: string) {
    const message =
      customMessage ||
      FAMILY_TREE_ERROR_MESSAGES[code] ||
      FAMILY_TREE_ERROR_MESSAGES.FAMILY_TREE_UNKNOWN_ERROR;
    super(message);
    this.name = "FamilyTreeError";
    this.code = code;
    this.isUserFacing = true;
  }
}
