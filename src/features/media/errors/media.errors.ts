export const MEDIA_ERROR_CODES = {
  FILE_REQUIRED: "AVATAR_FILE_REQUIRED",
  MIME_INVALID: "AVATAR_MIME_INVALID",
  FILE_TOO_LARGE: "AVATAR_FILE_TOO_LARGE",
  DIMENSIONS_TOO_LARGE: "AVATAR_DIMENSIONS_TOO_LARGE",
  PIXEL_BUDGET_EXCEEDED: "AVATAR_PIXEL_BUDGET_EXCEEDED",
  DECODE_FAILED: "AVATAR_DECODE_FAILED",
  PROCESSING_FAILED: "AVATAR_PROCESSING_FAILED",
  EXIF_REMOVAL_FAILED: "AVATAR_EXIF_REMOVAL_FAILED",
  THUMBNAIL_FAILED: "AVATAR_THUMBNAIL_FAILED",
  UPLOAD_FORBIDDEN: "AVATAR_UPLOAD_FORBIDDEN",
  UPLOAD_AUTHORIZATION_FAILED: "AVATAR_UPLOAD_AUTHORIZATION_FAILED",
  UPLOAD_FAILED: "AVATAR_UPLOAD_FAILED",
  TEMP_OBJECT_NOT_FOUND: "AVATAR_TEMP_OBJECT_NOT_FOUND",
  FINALIZE_FORBIDDEN: "AVATAR_FINALIZE_FORBIDDEN",
  FINALIZE_FAILED: "AVATAR_FINALIZE_FAILED",
  VERSION_CONFLICT: "AVATAR_VERSION_CONFLICT",
  SIGNED_URL_FORBIDDEN: "AVATAR_SIGNED_URL_FORBIDDEN",
  SIGNED_URL_FAILED: "AVATAR_SIGNED_URL_FAILED",
  DELETE_FORBIDDEN: "AVATAR_DELETE_FORBIDDEN",
  DELETE_FAILED: "AVATAR_DELETE_FAILED",
  ORPHAN_CLEANUP_FAILED: "AVATAR_ORPHAN_CLEANUP_FAILED",
  CROSS_TREE: "AVATAR_CROSS_TREE",
  UNKNOWN_ERROR: "AVATAR_UNKNOWN_ERROR",
} as const;

export type MediaErrorCode = (typeof MEDIA_ERROR_CODES)[keyof typeof MEDIA_ERROR_CODES];

export interface MediaErrorDetail {
  code: MediaErrorCode;
  message: string;
  retryable: boolean;
}

export const MEDIA_ERROR_TAXONOMY: Record<MediaErrorCode, MediaErrorDetail> = {
  [MEDIA_ERROR_CODES.FILE_REQUIRED]: {
    code: MEDIA_ERROR_CODES.FILE_REQUIRED,
    message: "Vui lòng chọn tệp ảnh để tải lên.",
    retryable: false,
  },
  [MEDIA_ERROR_CODES.MIME_INVALID]: {
    code: MEDIA_ERROR_CODES.MIME_INVALID,
    message: "Định dạng tệp không được hỗ trợ. Vui lòng chọn ảnh JPEG, PNG hoặc WebP.",
    retryable: false,
  },
  [MEDIA_ERROR_CODES.FILE_TOO_LARGE]: {
    code: MEDIA_ERROR_CODES.FILE_TOO_LARGE,
    message: "Dung lượng ảnh vượt quá giới hạn 10 MB.",
    retryable: false,
  },
  [MEDIA_ERROR_CODES.DIMENSIONS_TOO_LARGE]: {
    code: MEDIA_ERROR_CODES.DIMENSIONS_TOO_LARGE,
    message: "Kích thước ảnh quá lớn (tối đa 8.000 x 8.000 pixel).",
    retryable: false,
  },
  [MEDIA_ERROR_CODES.PIXEL_BUDGET_EXCEEDED]: {
    code: MEDIA_ERROR_CODES.PIXEL_BUDGET_EXCEEDED,
    message: "Tổng số điểm ảnh vượt quá ngân sách an toàn (tối đa 40 Megapixels).",
    retryable: false,
  },
  [MEDIA_ERROR_CODES.DECODE_FAILED]: {
    code: MEDIA_ERROR_CODES.DECODE_FAILED,
    message: "Không thể giải mã tệp tin hình ảnh hoặc tệp bị hỏng.",
    retryable: false,
  },
  [MEDIA_ERROR_CODES.PROCESSING_FAILED]: {
    code: MEDIA_ERROR_CODES.PROCESSING_FAILED,
    message: "Quá trình nén và xử lý hình ảnh thất bại.",
    retryable: true,
  },
  [MEDIA_ERROR_CODES.EXIF_REMOVAL_FAILED]: {
    code: MEDIA_ERROR_CODES.EXIF_REMOVAL_FAILED,
    message: "Không thể xóa siêu dữ liệu EXIF nhạy cảm.",
    retryable: true,
  },
  [MEDIA_ERROR_CODES.THUMBNAIL_FAILED]: {
    code: MEDIA_ERROR_CODES.THUMBNAIL_FAILED,
    message: "Không thể tạo ảnh thu nhỏ (thumbnail).",
    retryable: true,
  },
  [MEDIA_ERROR_CODES.UPLOAD_FORBIDDEN]: {
    code: MEDIA_ERROR_CODES.UPLOAD_FORBIDDEN,
    message: "Bạn không có quyền tải ảnh lên cho nhân vật trong cây gia phả này.",
    retryable: false,
  },
  [MEDIA_ERROR_CODES.UPLOAD_AUTHORIZATION_FAILED]: {
    code: MEDIA_ERROR_CODES.UPLOAD_AUTHORIZATION_FAILED,
    message: "Cấp quyền tải ảnh lên thất bại. Vui lòng thử lại.",
    retryable: true,
  },
  [MEDIA_ERROR_CODES.UPLOAD_FAILED]: {
    code: MEDIA_ERROR_CODES.UPLOAD_FAILED,
    message: "Tải tệp tin lên máy chủ lưu trữ thất bại.",
    retryable: true,
  },
  [MEDIA_ERROR_CODES.TEMP_OBJECT_NOT_FOUND]: {
    code: MEDIA_ERROR_CODES.TEMP_OBJECT_NOT_FOUND,
    message: "Không tìm thấy tệp ảnh tạm thời đã tải lên.",
    retryable: true,
  },
  [MEDIA_ERROR_CODES.FINALIZE_FORBIDDEN]: {
    code: MEDIA_ERROR_CODES.FINALIZE_FORBIDDEN,
    message: "Bạn không có quyền hoàn tất cập nhật ảnh đại diện.",
    retryable: false,
  },
  [MEDIA_ERROR_CODES.FINALIZE_FAILED]: {
    code: MEDIA_ERROR_CODES.FINALIZE_FAILED,
    message: "Không thể lưu thông tin ảnh đại diện vào cơ sở dữ liệu.",
    retryable: true,
  },
  [MEDIA_ERROR_CODES.VERSION_CONFLICT]: {
    code: MEDIA_ERROR_CODES.VERSION_CONFLICT,
    message: "Hồ sơ nhân vật đã bị thay đổi bởi người khác. Vui lòng tải lại trang.",
    retryable: true,
  },
  [MEDIA_ERROR_CODES.SIGNED_URL_FORBIDDEN]: {
    code: MEDIA_ERROR_CODES.SIGNED_URL_FORBIDDEN,
    message: "Bạn không có quyền xem ảnh đại diện của nhân vật này.",
    retryable: false,
  },
  [MEDIA_ERROR_CODES.SIGNED_URL_FAILED]: {
    code: MEDIA_ERROR_CODES.SIGNED_URL_FAILED,
    message: "Không thể tạo đường dẫn truy cập ảnh bảo mật.",
    retryable: true,
  },
  [MEDIA_ERROR_CODES.DELETE_FORBIDDEN]: {
    code: MEDIA_ERROR_CODES.DELETE_FORBIDDEN,
    message: "Bạn không có quyền xóa ảnh đại diện này.",
    retryable: false,
  },
  [MEDIA_ERROR_CODES.DELETE_FAILED]: {
    code: MEDIA_ERROR_CODES.DELETE_FAILED,
    message: "Xóa ảnh đại diện thất bại.",
    retryable: true,
  },
  [MEDIA_ERROR_CODES.ORPHAN_CLEANUP_FAILED]: {
    code: MEDIA_ERROR_CODES.ORPHAN_CLEANUP_FAILED,
    message: "Quá trình quét và dọn dẹp file mồ côi gặp sự cố.",
    retryable: true,
  },
  [MEDIA_ERROR_CODES.CROSS_TREE]: {
    code: MEDIA_ERROR_CODES.CROSS_TREE,
    message: "Vi phạm ranh giới bảo mật: Không thể thao tác ảnh của cây gia phả khác.",
    retryable: false,
  },
  [MEDIA_ERROR_CODES.UNKNOWN_ERROR]: {
    code: MEDIA_ERROR_CODES.UNKNOWN_ERROR,
    message: "Đã xảy ra lỗi không xác định trong quá trình xử lý ảnh.",
    retryable: true,
  },
};

export class MediaDomainError extends Error {
  readonly code: MediaErrorCode;
  readonly retryable: boolean;

  constructor(code: MediaErrorCode, customMessage?: string) {
    const detail = MEDIA_ERROR_TAXONOMY[code] || MEDIA_ERROR_TAXONOMY.AVATAR_UNKNOWN_ERROR;
    super(customMessage || detail.message);
    this.name = "MediaDomainError";
    this.code = code;
    this.retryable = detail.retryable;
  }
}
