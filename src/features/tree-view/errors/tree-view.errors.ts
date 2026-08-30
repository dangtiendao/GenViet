export const TREE_VIEW_ERROR_CODES = {
  GRAPH_LOAD_FAILED: "TREE_VIEW_GRAPH_LOAD_FAILED",
  GRAPH_TOO_LARGE: "TREE_VIEW_GRAPH_TOO_LARGE",
  GRAPH_TRUNCATED: "TREE_VIEW_GRAPH_TRUNCATED",
  LAYOUT_FAILED: "TREE_VIEW_LAYOUT_FAILED",
  LAYOUT_TIMEOUT: "TREE_VIEW_LAYOUT_TIMEOUT",
  LAYOUT_STALE: "TREE_VIEW_LAYOUT_STALE",
  CENTER_NOT_FOUND: "TREE_VIEW_CENTER_NOT_FOUND",
  CENTER_FORBIDDEN: "TREE_VIEW_CENTER_FORBIDDEN",
  FULLSCREEN_UNAVAILABLE: "TREE_VIEW_FULLSCREEN_UNAVAILABLE",
  AVATAR_FAILED: "TREE_VIEW_AVATAR_FAILED",
  UNKNOWN_ERROR: "TREE_VIEW_UNKNOWN_ERROR",
} as const;

export type TreeViewErrorCode = (typeof TREE_VIEW_ERROR_CODES)[keyof typeof TREE_VIEW_ERROR_CODES];

export interface TreeViewErrorDetail {
  code: TreeViewErrorCode;
  message: string;
  retryable: boolean;
}

export const TREE_VIEW_ERROR_TAXONOMY: Record<TreeViewErrorCode, TreeViewErrorDetail> = {
  [TREE_VIEW_ERROR_CODES.GRAPH_LOAD_FAILED]: {
    code: TREE_VIEW_ERROR_CODES.GRAPH_LOAD_FAILED,
    message: "Không thể tải dữ liệu sơ đồ cây gia phả. Vui lòng thử lại.",
    retryable: true,
  },
  [TREE_VIEW_ERROR_CODES.GRAPH_TOO_LARGE]: {
    code: TREE_VIEW_ERROR_CODES.GRAPH_TOO_LARGE,
    message: "Sơ đồ cây vượt quá kích thước hiển thị an toàn. Hãy giảm bớt độ sâu xem cây.",
    retryable: false,
  },
  [TREE_VIEW_ERROR_CODES.GRAPH_TRUNCATED]: {
    code: TREE_VIEW_ERROR_CODES.GRAPH_TRUNCATED,
    message: "Sơ đồ cây đã được cắt bớt một số nhánh do đạt giới hạn ngân sách hiển thị.",
    retryable: false,
  },
  [TREE_VIEW_ERROR_CODES.LAYOUT_FAILED]: {
    code: TREE_VIEW_ERROR_CODES.LAYOUT_FAILED,
    message: "Không thể tính toán bố cục không gian cây gia phả.",
    retryable: true,
  },
  [TREE_VIEW_ERROR_CODES.LAYOUT_TIMEOUT]: {
    code: TREE_VIEW_ERROR_CODES.LAYOUT_TIMEOUT,
    message: "Thời gian tính toán bố cục cây quá lâu. Đang chuyển sang chế độ hiển thị đơn giản.",
    retryable: true,
  },
  [TREE_VIEW_ERROR_CODES.LAYOUT_STALE]: {
    code: TREE_VIEW_ERROR_CODES.LAYOUT_STALE,
    message: "Kết quả bố cục không đồng bộ với phiên hiện tại.",
    retryable: false,
  },
  [TREE_VIEW_ERROR_CODES.CENTER_NOT_FOUND]: {
    code: TREE_VIEW_ERROR_CODES.CENTER_NOT_FOUND,
    message: "Nhân vật trung tâm được chọn không tồn tại hoặc đã bị xóa.",
    retryable: false,
  },
  [TREE_VIEW_ERROR_CODES.CENTER_FORBIDDEN]: {
    code: TREE_VIEW_ERROR_CODES.CENTER_FORBIDDEN,
    message: "Bạn không có quyền xem thông tin nhân vật này.",
    retryable: false,
  },
  [TREE_VIEW_ERROR_CODES.FULLSCREEN_UNAVAILABLE]: {
    code: TREE_VIEW_ERROR_CODES.FULLSCREEN_UNAVAILABLE,
    message: "Trình duyệt của bạn không hỗ trợ chế độ toàn màn hình.",
    retryable: false,
  },
  [TREE_VIEW_ERROR_CODES.AVATAR_FAILED]: {
    code: TREE_VIEW_ERROR_CODES.AVATAR_FAILED,
    message: "Không thể tải ảnh đại diện.",
    retryable: true,
  },
  [TREE_VIEW_ERROR_CODES.UNKNOWN_ERROR]: {
    code: TREE_VIEW_ERROR_CODES.UNKNOWN_ERROR,
    message: "Đã xảy ra lỗi không xác định trên sơ đồ cây.",
    retryable: true,
  },
};

export class TreeViewDomainError extends Error {
  readonly code: TreeViewErrorCode;
  readonly retryable: boolean;

  constructor(code: TreeViewErrorCode, customMessage?: string) {
    const detail =
      TREE_VIEW_ERROR_TAXONOMY[code] || TREE_VIEW_ERROR_TAXONOMY.TREE_VIEW_UNKNOWN_ERROR;
    super(customMessage || detail.message);
    this.name = "TreeViewDomainError";
    this.code = code;
    this.retryable = detail.retryable;
  }
}
