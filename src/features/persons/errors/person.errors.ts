export const PERSON_ERROR_CODES = {
  NOT_FOUND: "PERSON_NOT_FOUND",
  FORBIDDEN: "PERSON_FORBIDDEN",
  TREE_MISMATCH: "PERSON_TREE_MISMATCH",
  NAME_INVALID: "PERSON_NAME_INVALID",
  GENDER_INVALID: "PERSON_GENDER_INVALID",
  LIVING_STATUS_INVALID: "PERSON_LIVING_STATUS_INVALID",
  BIRTH_DATE_INVALID: "PERSON_BIRTH_DATE_INVALID",
  DEATH_DATE_INVALID: "PERSON_DEATH_DATE_INVALID",
  DEATH_BEFORE_BIRTH: "PERSON_DEATH_BEFORE_BIRTH",
  PARTIAL_DATE_INVALID: "PERSON_PARTIAL_DATE_INVALID",
  SIMILAR_PROFILE_WARNING: "PERSON_SIMILAR_PROFILE_WARNING",
  CREATE_FAILED: "PERSON_CREATE_FAILED",
  VERSION_CONFLICT: "PERSON_VERSION_CONFLICT",
  UPDATE_FAILED: "PERSON_UPDATE_FAILED",
  ALREADY_DELETED: "PERSON_ALREADY_DELETED",
  SOFT_DELETE_FAILED: "PERSON_SOFT_DELETE_FAILED",
  RESTORE_FORBIDDEN: "PERSON_RESTORE_FORBIDDEN",
  RESTORE_CONFLICT: "PERSON_RESTORE_CONFLICT",
  RESTORE_FAILED: "PERSON_RESTORE_FAILED",
  DEFAULT_REFERENCE_CONFLICT: "PERSON_DEFAULT_REFERENCE_CONFLICT",
  GENERATION_ANCHOR_CONFLICT: "PERSON_GENERATION_ANCHOR_CONFLICT",
  UNKNOWN_ERROR: "PERSON_UNKNOWN_ERROR",
} as const;

export type PersonErrorCode = (typeof PERSON_ERROR_CODES)[keyof typeof PERSON_ERROR_CODES];

export const PERSON_ERROR_MESSAGES: Record<PersonErrorCode, string> = {
  PERSON_NOT_FOUND: "Không tìm thấy hồ sơ nhân vật hoặc bạn không có quyền truy cập.",
  PERSON_FORBIDDEN: "Bạn không có quyền thực hiện thao tác này trên hồ sơ nhân vật.",
  PERSON_TREE_MISMATCH: "Nhân vật không thuộc cây gia phả hiện tại.",
  PERSON_NAME_INVALID: "Họ và tên nhân vật không hợp lệ hoặc để trống.",
  PERSON_GENDER_INVALID: "Giới tính được chọn không hợp lệ.",
  PERSON_LIVING_STATUS_INVALID: "Trạng thái sống không hợp lệ.",
  PERSON_BIRTH_DATE_INVALID: "Ngày hoặc năm sinh không hợp lệ.",
  PERSON_DEATH_DATE_INVALID: "Ngày hoặc năm mất không hợp lệ.",
  PERSON_DEATH_BEFORE_BIRTH: "Ngày/năm mất không thể diễn ra trước ngày/năm sinh.",
  PERSON_PARTIAL_DATE_INVALID: "Định dạng ngày tháng không nhất quán với mức độ chính xác đã chọn.",
  PERSON_SIMILAR_PROFILE_WARNING: "Đã tìm thấy hồ sơ nhân vật tương tự trong cây gia phả.",
  PERSON_CREATE_FAILED: "Không thể thêm nhân vật mới. Vui lòng thử lại sau.",
  PERSON_VERSION_CONFLICT:
    "Hồ sơ đã bị thay đổi bởi người khác. Vui lòng tải lại trang và thử lại.",
  PERSON_UPDATE_FAILED: "Không thể cập nhật hồ sơ nhân vật. Vui lòng thử lại.",
  PERSON_ALREADY_DELETED: "Hồ sơ nhân vật này đã bị xóa trước đó.",
  PERSON_SOFT_DELETE_FAILED: "Không thể xóa hồ sơ nhân vật. Vui lòng thử lại.",
  PERSON_RESTORE_FORBIDDEN: "Bạn không có quyền khôi phục nhân vật này.",
  PERSON_RESTORE_CONFLICT: "Không thể khôi phục do xung đột dữ liệu phiên bản.",
  PERSON_RESTORE_FAILED: "Không thể khôi phục hồ sơ nhân vật. Vui lòng thử lại.",
  PERSON_DEFAULT_REFERENCE_CONFLICT: "Không thể xóa nhân vật đang được đặt làm mặc định.",
  PERSON_GENERATION_ANCHOR_CONFLICT:
    "Nhân vật này đang được chọn làm Mốc số đời (Đời 1) của cây gia phả. Vui lòng gỡ mốc trong Cài đặt cây trước khi xóa.",
  PERSON_UNKNOWN_ERROR: "Đã xảy ra lỗi không xác định. Vui lòng thử lại.",
};

export class PersonError extends Error {
  readonly code: PersonErrorCode;
  readonly isUserFacing: boolean;

  constructor(code: PersonErrorCode, customMessage?: string) {
    const message =
      customMessage || PERSON_ERROR_MESSAGES[code] || PERSON_ERROR_MESSAGES.PERSON_UNKNOWN_ERROR;
    super(message);
    this.name = "PersonError";
    this.code = code;
    this.isUserFacing = true;
  }
}
