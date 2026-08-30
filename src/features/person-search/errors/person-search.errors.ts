export const PERSON_SEARCH_ERROR_CODES = {
  TREE_INVALID: "PERSON_SEARCH_TREE_INVALID",
  FORBIDDEN: "PERSON_SEARCH_FORBIDDEN",
  QUERY_INVALID: "PERSON_SEARCH_QUERY_INVALID",
  QUERY_TOO_SHORT: "PERSON_SEARCH_QUERY_TOO_SHORT",
  BIRTH_YEAR_INVALID: "PERSON_SEARCH_BIRTH_YEAR_INVALID",
  LIVING_STATUS_INVALID: "PERSON_SEARCH_LIVING_STATUS_INVALID",
  FILTER_INVALID: "PERSON_SEARCH_FILTER_INVALID",
  CURSOR_INVALID: "PERSON_SEARCH_CURSOR_INVALID",
  LIMIT_EXCEEDED: "PERSON_SEARCH_LIMIT_EXCEEDED",
  EXTENSION_UNAVAILABLE: "PERSON_SEARCH_EXTENSION_UNAVAILABLE",
  QUERY_FAILED: "PERSON_SEARCH_QUERY_FAILED",
  TIMEOUT: "PERSON_SEARCH_TIMEOUT",
  UNKNOWN_ERROR: "PERSON_SEARCH_UNKNOWN_ERROR",
} as const;

export type PersonSearchErrorCode =
  (typeof PERSON_SEARCH_ERROR_CODES)[keyof typeof PERSON_SEARCH_ERROR_CODES];

export interface PersonSearchErrorDetail {
  code: PersonSearchErrorCode;
  message: string;
  retryable: boolean;
}

export const PERSON_SEARCH_ERROR_TAXONOMY: Record<PersonSearchErrorCode, PersonSearchErrorDetail> =
  {
    [PERSON_SEARCH_ERROR_CODES.TREE_INVALID]: {
      code: PERSON_SEARCH_ERROR_CODES.TREE_INVALID,
      message: "Mã cây gia phả không hợp lệ.",
      retryable: false,
    },
    [PERSON_SEARCH_ERROR_CODES.FORBIDDEN]: {
      code: PERSON_SEARCH_ERROR_CODES.FORBIDDEN,
      message: "Bạn không có quyền tìm kiếm trong cây gia phả này.",
      retryable: false,
    },
    [PERSON_SEARCH_ERROR_CODES.QUERY_INVALID]: {
      code: PERSON_SEARCH_ERROR_CODES.QUERY_INVALID,
      message: "Từ khóa tìm kiếm không hợp lệ.",
      retryable: false,
    },
    [PERSON_SEARCH_ERROR_CODES.QUERY_TOO_SHORT]: {
      code: PERSON_SEARCH_ERROR_CODES.QUERY_TOO_SHORT,
      message: "Từ khóa tìm kiếm quá ngắn.",
      retryable: false,
    },
    [PERSON_SEARCH_ERROR_CODES.BIRTH_YEAR_INVALID]: {
      code: PERSON_SEARCH_ERROR_CODES.BIRTH_YEAR_INVALID,
      message: "Năm sinh tìm kiếm không hợp lệ (100 - 2500).",
      retryable: false,
    },
    [PERSON_SEARCH_ERROR_CODES.LIVING_STATUS_INVALID]: {
      code: PERSON_SEARCH_ERROR_CODES.LIVING_STATUS_INVALID,
      message: "Trạng thái sống không hợp lệ.",
      retryable: false,
    },
    [PERSON_SEARCH_ERROR_CODES.FILTER_INVALID]: {
      code: PERSON_SEARCH_ERROR_CODES.FILTER_INVALID,
      message: "Bộ lọc tìm kiếm không hợp lệ.",
      retryable: false,
    },
    [PERSON_SEARCH_ERROR_CODES.CURSOR_INVALID]: {
      code: PERSON_SEARCH_ERROR_CODES.CURSOR_INVALID,
      message: "Dấu phân trang (cursor) không hợp lệ hoặc đã hết hạn.",
      retryable: true,
    },
    [PERSON_SEARCH_ERROR_CODES.LIMIT_EXCEEDED]: {
      code: PERSON_SEARCH_ERROR_CODES.LIMIT_EXCEEDED,
      message: "Số lượng kết quả yêu cầu vượt quá giới hạn cho phép.",
      retryable: false,
    },
    [PERSON_SEARCH_ERROR_CODES.EXTENSION_UNAVAILABLE]: {
      code: PERSON_SEARCH_ERROR_CODES.EXTENSION_UNAVAILABLE,
      message: "Tiện ích mở rộng tìm kiếm tiếng Việt chưa sẵn sàng trên cơ sở dữ liệu.",
      retryable: true,
    },
    [PERSON_SEARCH_ERROR_CODES.QUERY_FAILED]: {
      code: PERSON_SEARCH_ERROR_CODES.QUERY_FAILED,
      message: "Không thể thực thi tìm kiếm lúc này. Vui lòng thử lại sau.",
      retryable: true,
    },
    [PERSON_SEARCH_ERROR_CODES.TIMEOUT]: {
      code: PERSON_SEARCH_ERROR_CODES.TIMEOUT,
      message: "Thời gian xử lý tìm kiếm quá lâu. Hãy thu hẹp bộ lọc.",
      retryable: true,
    },
    [PERSON_SEARCH_ERROR_CODES.UNKNOWN_ERROR]: {
      code: PERSON_SEARCH_ERROR_CODES.UNKNOWN_ERROR,
      message: "Đã xảy ra lỗi không xác định khi tìm kiếm.",
      retryable: true,
    },
  };

export class PersonSearchDomainError extends Error {
  readonly code: PersonSearchErrorCode;
  readonly retryable: boolean;

  constructor(code: PersonSearchErrorCode, customMessage?: string) {
    const detail =
      PERSON_SEARCH_ERROR_TAXONOMY[code] ||
      PERSON_SEARCH_ERROR_TAXONOMY.PERSON_SEARCH_UNKNOWN_ERROR;
    super(customMessage || detail.message);
    this.name = "PersonSearchDomainError";
    this.code = code;
    this.retryable = detail.retryable;
  }
}
