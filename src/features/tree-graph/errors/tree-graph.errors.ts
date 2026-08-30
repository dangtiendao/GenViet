export const TREE_GRAPH_ERROR_CODES = {
  NOT_FOUND: "TREE_GRAPH_NOT_FOUND",
  FORBIDDEN: "TREE_GRAPH_FORBIDDEN",
  UNAUTHORIZED: "TREE_GRAPH_UNAUTHORIZED",
  CENTER_NOT_FOUND: "TREE_GRAPH_CENTER_NOT_FOUND",
  CENTER_DELETED: "TREE_GRAPH_CENTER_DELETED",
  TREE_MISMATCH: "TREE_GRAPH_TREE_MISMATCH",
  DEPTH_INVALID: "TREE_GRAPH_DEPTH_INVALID",
  DEPTH_EXCEEDED: "TREE_GRAPH_DEPTH_EXCEEDED",
  TOO_LARGE: "TREE_GRAPH_TOO_LARGE",
  INCONSISTENT: "TREE_GRAPH_INCONSISTENT",
  QUERY_FAILED: "TREE_GRAPH_QUERY_FAILED",
  UNKNOWN_ERROR: "TREE_GRAPH_UNKNOWN_ERROR",
} as const;

export type TreeGraphErrorCode =
  (typeof TREE_GRAPH_ERROR_CODES)[keyof typeof TREE_GRAPH_ERROR_CODES];

export interface TreeGraphErrorDetail {
  code: TreeGraphErrorCode;
  message: string;
  httpStatus: number;
}

export const TREE_GRAPH_ERROR_TAXONOMY: Record<TreeGraphErrorCode, TreeGraphErrorDetail> = {
  [TREE_GRAPH_ERROR_CODES.NOT_FOUND]: {
    code: TREE_GRAPH_ERROR_CODES.NOT_FOUND,
    message: "Cây gia phả không tồn tại hoặc đã bị xóa.",
    httpStatus: 404,
  },
  [TREE_GRAPH_ERROR_CODES.FORBIDDEN]: {
    code: TREE_GRAPH_ERROR_CODES.FORBIDDEN,
    message: "Bạn không có quyền xem vùng cây gia phả này.",
    httpStatus: 403,
  },
  [TREE_GRAPH_ERROR_CODES.UNAUTHORIZED]: {
    code: TREE_GRAPH_ERROR_CODES.UNAUTHORIZED,
    message: "Yêu cầu đăng nhập để truy cập đồ thị gia phả.",
    httpStatus: 401,
  },
  [TREE_GRAPH_ERROR_CODES.CENTER_NOT_FOUND]: {
    code: TREE_GRAPH_ERROR_CODES.CENTER_NOT_FOUND,
    message: "Nhân vật trung tâm không tồn tại.",
    httpStatus: 404,
  },
  [TREE_GRAPH_ERROR_CODES.CENTER_DELETED]: {
    code: TREE_GRAPH_ERROR_CODES.CENTER_DELETED,
    message: "Nhân vật trung tâm đã bị xóa khỏi cây gia phả.",
    httpStatus: 404,
  },
  [TREE_GRAPH_ERROR_CODES.TREE_MISMATCH]: {
    code: TREE_GRAPH_ERROR_CODES.TREE_MISMATCH,
    message: "Nhân vật trung tâm không thuộc về cây gia phả được yêu cầu.",
    httpStatus: 400,
  },
  [TREE_GRAPH_ERROR_CODES.DEPTH_INVALID]: {
    code: TREE_GRAPH_ERROR_CODES.DEPTH_INVALID,
    message: "Độ sâu truy vấn không hợp lệ (phải là số nguyên không âm).",
    httpStatus: 400,
  },
  [TREE_GRAPH_ERROR_CODES.DEPTH_EXCEEDED]: {
    code: TREE_GRAPH_ERROR_CODES.DEPTH_EXCEEDED,
    message: "Độ sâu truy vấn vượt quá giới hạn tối đa cho phép (tối đa 5 tầng).",
    httpStatus: 400,
  },
  [TREE_GRAPH_ERROR_CODES.TOO_LARGE]: {
    code: TREE_GRAPH_ERROR_CODES.TOO_LARGE,
    message: "Lát cắt đồ thị vượt quá kích thước xử lý tối đa.",
    httpStatus: 413,
  },
  [TREE_GRAPH_ERROR_CODES.INCONSISTENT]: {
    code: TREE_GRAPH_ERROR_CODES.INCONSISTENT,
    message: "Dữ liệu đồ thị không nhất quán (phát hiện cạnh hoặc liên kết mồ côi).",
    httpStatus: 500,
  },
  [TREE_GRAPH_ERROR_CODES.QUERY_FAILED]: {
    code: TREE_GRAPH_ERROR_CODES.QUERY_FAILED,
    message: "Không thể truy vấn lát cắt đồ thị gia phả.",
    httpStatus: 500,
  },
  [TREE_GRAPH_ERROR_CODES.UNKNOWN_ERROR]: {
    code: TREE_GRAPH_ERROR_CODES.UNKNOWN_ERROR,
    message: "Đã xảy ra lỗi không xác định khi tải vùng cây.",
    httpStatus: 500,
  },
};

export class TreeGraphDomainError extends Error {
  readonly code: TreeGraphErrorCode;
  readonly httpStatus: number;

  constructor(code: TreeGraphErrorCode, customMessage?: string) {
    const detail =
      TREE_GRAPH_ERROR_TAXONOMY[code] || TREE_GRAPH_ERROR_TAXONOMY.TREE_GRAPH_UNKNOWN_ERROR;
    super(customMessage || detail.message);
    this.name = "TreeGraphDomainError";
    this.code = code;
    this.httpStatus = detail.httpStatus;
  }
}
