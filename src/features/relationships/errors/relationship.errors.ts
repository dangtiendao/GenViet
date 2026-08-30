export const RELATIONSHIP_ERROR_CODES = {
  NOT_FOUND: "RELATIONSHIP_NOT_FOUND",
  FORBIDDEN: "RELATIONSHIP_FORBIDDEN",
  TREE_MISMATCH: "RELATIONSHIP_TREE_MISMATCH",
  SELF_LINK: "RELATIONSHIP_SELF_LINK",
  DUPLICATE: "RELATIONSHIP_DUPLICATE",
  CYCLE: "RELATIONSHIP_CYCLE",
  INVALID_KIND: "RELATIONSHIP_INVALID_KIND",
  INVALID_ROLE: "RELATIONSHIP_INVALID_ROLE",
  INVALID_VERIFICATION: "RELATIONSHIP_INVALID_VERIFICATION",
  EXISTING_VERIFIED_FATHER: "RELATIONSHIP_EXISTING_VERIFIED_FATHER",
  EXISTING_VERIFIED_MOTHER: "RELATIONSHIP_EXISTING_VERIFIED_MOTHER",
  WARNING_CONFIRMATION_REQUIRED: "RELATIONSHIP_WARNING_CONFIRMATION_REQUIRED",
  CREATE_FAILED: "RELATIONSHIP_CREATE_FAILED",
  VERSION_CONFLICT: "RELATIONSHIP_VERSION_CONFLICT",
  SOFT_DELETE_FAILED: "RELATIONSHIP_SOFT_DELETE_FAILED",
  REPLACE_FAILED: "RELATIONSHIP_REPLACE_FAILED",
  UNION_SELF_LINK: "UNION_SELF_LINK",
  UNION_DUPLICATE: "UNION_DUPLICATE",
  UNION_OVERLAP_WARNING: "UNION_OVERLAP_WARNING",
  UNION_INVALID_STATUS: "UNION_INVALID_STATUS",
  UNION_CREATE_FAILED: "UNION_CREATE_FAILED",
  UNION_END_FAILED: "UNION_END_FAILED",
  UNION_MEMBER_INVALID: "UNION_MEMBER_INVALID",
  RELATED_PERSON_CREATE_FAILED: "RELATED_PERSON_CREATE_FAILED",
  AUDIT_FAILED: "RELATIONSHIP_AUDIT_FAILED",
  UNKNOWN_ERROR: "RELATIONSHIP_UNKNOWN_ERROR",
} as const;

export type RelationshipErrorCode =
  (typeof RELATIONSHIP_ERROR_CODES)[keyof typeof RELATIONSHIP_ERROR_CODES];

export interface RelationshipErrorDetail {
  code: RelationshipErrorCode;
  message: string;
  severity: "blocking" | "warning" | "info";
  retryable: boolean;
  canConfirm: boolean;
}

export const RELATIONSHIP_ERROR_TAXONOMY: Record<RelationshipErrorCode, RelationshipErrorDetail> = {
  [RELATIONSHIP_ERROR_CODES.NOT_FOUND]: {
    code: RELATIONSHIP_ERROR_CODES.NOT_FOUND,
    message: "Không tìm thấy thông tin quan hệ hoặc nhân vật yêu cầu.",
    severity: "blocking",
    retryable: false,
    canConfirm: false,
  },
  [RELATIONSHIP_ERROR_CODES.FORBIDDEN]: {
    code: RELATIONSHIP_ERROR_CODES.FORBIDDEN,
    message: "Bạn không có quyền chỉnh sửa hoặc thêm quan hệ trong cây gia phả này.",
    severity: "blocking",
    retryable: false,
    canConfirm: false,
  },
  [RELATIONSHIP_ERROR_CODES.TREE_MISMATCH]: {
    code: RELATIONSHIP_ERROR_CODES.TREE_MISMATCH,
    message: "Các nhân vật được liên kết phải thuộc cùng một cây gia phả.",
    severity: "blocking",
    retryable: false,
    canConfirm: false,
  },
  [RELATIONSHIP_ERROR_CODES.SELF_LINK]: {
    code: RELATIONSHIP_ERROR_CODES.SELF_LINK,
    message: "Một nhân vật không thể tự làm cha, mẹ hoặc con của chính mình.",
    severity: "blocking",
    retryable: false,
    canConfirm: false,
  },
  [RELATIONSHIP_ERROR_CODES.DUPLICATE]: {
    code: RELATIONSHIP_ERROR_CODES.DUPLICATE,
    message: "Quan hệ này đã tồn tại trong cây gia phả.",
    severity: "blocking",
    retryable: false,
    canConfirm: false,
  },
  [RELATIONSHIP_ERROR_CODES.CYCLE]: {
    code: RELATIONSHIP_ERROR_CODES.CYCLE,
    message:
      "Không thể tạo quan hệ vì tạo ra chu trình thế hệ (hậu duệ làm tổ tiên của chính mình).",
    severity: "blocking",
    retryable: false,
    canConfirm: false,
  },
  [RELATIONSHIP_ERROR_CODES.INVALID_KIND]: {
    code: RELATIONSHIP_ERROR_CODES.INVALID_KIND,
    message: "Loại quan hệ phả hệ không hợp lệ.",
    severity: "blocking",
    retryable: false,
    canConfirm: false,
  },
  [RELATIONSHIP_ERROR_CODES.INVALID_ROLE]: {
    code: RELATIONSHIP_ERROR_CODES.INVALID_ROLE,
    message: "Vai trò cha mẹ không hợp lệ.",
    severity: "blocking",
    retryable: false,
    canConfirm: false,
  },
  [RELATIONSHIP_ERROR_CODES.INVALID_VERIFICATION]: {
    code: RELATIONSHIP_ERROR_CODES.INVALID_VERIFICATION,
    message: "Trạng thái xác minh không hợp lệ.",
    severity: "blocking",
    retryable: false,
    canConfirm: false,
  },
  [RELATIONSHIP_ERROR_CODES.EXISTING_VERIFIED_FATHER]: {
    code: RELATIONSHIP_ERROR_CODES.EXISTING_VERIFIED_FATHER,
    message: "Nhân vật này đã có cha ruột được xác minh.",
    severity: "warning",
    retryable: true,
    canConfirm: true,
  },
  [RELATIONSHIP_ERROR_CODES.EXISTING_VERIFIED_MOTHER]: {
    code: RELATIONSHIP_ERROR_CODES.EXISTING_VERIFIED_MOTHER,
    message: "Nhân vật này đã có mẹ ruột được xác minh.",
    severity: "warning",
    retryable: true,
    canConfirm: true,
  },
  [RELATIONSHIP_ERROR_CODES.WARNING_CONFIRMATION_REQUIRED]: {
    code: RELATIONSHIP_ERROR_CODES.WARNING_CONFIRMATION_REQUIRED,
    message: "Vui lòng xác nhận các cảnh báo trước khi lưu quan hệ.",
    severity: "warning",
    retryable: true,
    canConfirm: true,
  },
  [RELATIONSHIP_ERROR_CODES.CREATE_FAILED]: {
    code: RELATIONSHIP_ERROR_CODES.CREATE_FAILED,
    message: "Không thể tạo quan hệ gia phả. Vui lòng thử lại.",
    severity: "blocking",
    retryable: true,
    canConfirm: false,
  },
  [RELATIONSHIP_ERROR_CODES.VERSION_CONFLICT]: {
    code: RELATIONSHIP_ERROR_CODES.VERSION_CONFLICT,
    message: "Dữ liệu quan hệ đã bị thay đổi bởi người khác. Vui lòng tải lại trang.",
    severity: "blocking",
    retryable: true,
    canConfirm: false,
  },
  [RELATIONSHIP_ERROR_CODES.SOFT_DELETE_FAILED]: {
    code: RELATIONSHIP_ERROR_CODES.SOFT_DELETE_FAILED,
    message: "Không thể xóa quan hệ phả hệ. Vui lòng thử lại.",
    severity: "blocking",
    retryable: true,
    canConfirm: false,
  },
  [RELATIONSHIP_ERROR_CODES.REPLACE_FAILED]: {
    code: RELATIONSHIP_ERROR_CODES.REPLACE_FAILED,
    message: "Không thể thay thế quan hệ phả hệ. Vui lòng thử lại.",
    severity: "blocking",
    retryable: true,
    canConfirm: false,
  },
  [RELATIONSHIP_ERROR_CODES.UNION_SELF_LINK]: {
    code: RELATIONSHIP_ERROR_CODES.UNION_SELF_LINK,
    message: "Một nhân vật không thể tự kết hôn với chính mình.",
    severity: "blocking",
    retryable: false,
    canConfirm: false,
  },
  [RELATIONSHIP_ERROR_CODES.UNION_DUPLICATE]: {
    code: RELATIONSHIP_ERROR_CODES.UNION_DUPLICATE,
    message: "Quan hệ hôn nhân giữa hai người này đã tồn tại.",
    severity: "blocking",
    retryable: false,
    canConfirm: false,
  },
  [RELATIONSHIP_ERROR_CODES.UNION_OVERLAP_WARNING]: {
    code: RELATIONSHIP_ERROR_CODES.UNION_OVERLAP_WARNING,
    message: "Phát hiện quan hệ hôn nhân đang diễn ra cùng thời điểm.",
    severity: "warning",
    retryable: true,
    canConfirm: true,
  },
  [RELATIONSHIP_ERROR_CODES.UNION_INVALID_STATUS]: {
    code: RELATIONSHIP_ERROR_CODES.UNION_INVALID_STATUS,
    message: "Trạng thái hôn nhân không hợp lệ.",
    severity: "blocking",
    retryable: false,
    canConfirm: false,
  },
  [RELATIONSHIP_ERROR_CODES.UNION_CREATE_FAILED]: {
    code: RELATIONSHIP_ERROR_CODES.UNION_CREATE_FAILED,
    message: "Không thể tạo quan hệ hôn nhân. Vui lòng thử lại.",
    severity: "blocking",
    retryable: true,
    canConfirm: false,
  },
  [RELATIONSHIP_ERROR_CODES.UNION_END_FAILED]: {
    code: RELATIONSHIP_ERROR_CODES.UNION_END_FAILED,
    message: "Không thể cập nhật kết thúc hôn nhân. Vui lòng thử lại.",
    severity: "blocking",
    retryable: true,
    canConfirm: false,
  },
  [RELATIONSHIP_ERROR_CODES.UNION_MEMBER_INVALID]: {
    code: RELATIONSHIP_ERROR_CODES.UNION_MEMBER_INVALID,
    message: "Thành viên hôn nhân không hợp lệ.",
    severity: "blocking",
    retryable: false,
    canConfirm: false,
  },
  [RELATIONSHIP_ERROR_CODES.RELATED_PERSON_CREATE_FAILED]: {
    code: RELATIONSHIP_ERROR_CODES.RELATED_PERSON_CREATE_FAILED,
    message: "Không thể tạo hồ sơ người thân mới. Thao tác đã được hủy toàn bộ an toàn.",
    severity: "blocking",
    retryable: true,
    canConfirm: false,
  },
  [RELATIONSHIP_ERROR_CODES.AUDIT_FAILED]: {
    code: RELATIONSHIP_ERROR_CODES.AUDIT_FAILED,
    message: "Không thể ghi nhận nhật ký thao tác quan hệ.",
    severity: "blocking",
    retryable: true,
    canConfirm: false,
  },
  [RELATIONSHIP_ERROR_CODES.UNKNOWN_ERROR]: {
    code: RELATIONSHIP_ERROR_CODES.UNKNOWN_ERROR,
    message: "Đã xảy ra lỗi không xác định khi xử lý quan hệ gia phả.",
    severity: "blocking",
    retryable: true,
    canConfirm: false,
  },
};

export class RelationshipDomainError extends Error {
  readonly code: RelationshipErrorCode;
  readonly severity: "blocking" | "warning" | "info";
  readonly retryable: boolean;
  readonly canConfirm: boolean;

  constructor(code: RelationshipErrorCode, customMessage?: string) {
    const detail =
      RELATIONSHIP_ERROR_TAXONOMY[code] || RELATIONSHIP_ERROR_TAXONOMY.RELATIONSHIP_UNKNOWN_ERROR;
    super(customMessage || detail.message);
    this.name = "RelationshipDomainError";
    this.code = code;
    this.severity = detail.severity;
    this.retryable = detail.retryable;
    this.canConfirm = detail.canConfirm;
  }
}
