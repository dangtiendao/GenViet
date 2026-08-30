import {
  BACKUP_CURRENT_SCHEMA_VERSION,
  BACKUP_SUPPORTED_SCHEMA_VERSIONS,
  type BackupImportPreviewDto,
} from "../types/backup.types";

export interface VersionDetectionResult {
  schemaVersion: number | null;
  status: BackupImportPreviewDto["versionStatus"];
  isSupported: boolean;
  message: string;
}

export function detectSchemaVersion(rawJson: unknown): VersionDetectionResult {
  if (!rawJson || typeof rawJson !== "object" || Array.isArray(rawJson)) {
    return {
      schemaVersion: null,
      status: "invalid",
      isSupported: false,
      message: "Dữ liệu tệp sao lưu không phải là một đối tượng JSON hợp lệ.",
    };
  }

  const obj = rawJson as Record<string, unknown>;

  if (!("schemaVersion" in obj) || obj.schemaVersion === undefined || obj.schemaVersion === null) {
    return {
      schemaVersion: null,
      status: "missing",
      isSupported: false,
      message: "Tệp sao lưu thiếu trường bắt buộc 'schemaVersion'.",
    };
  }

  const version = obj.schemaVersion;

  if (typeof version !== "number" || !Number.isInteger(version)) {
    return {
      schemaVersion: null,
      status: "invalid",
      isSupported: false,
      message: "Giá trị 'schemaVersion' phải là một số nguyên.",
    };
  }

  if (version === BACKUP_CURRENT_SCHEMA_VERSION) {
    return {
      schemaVersion: version,
      status: "current",
      isSupported: true,
      message: `Phiên bản schema hiện tại (${version}) được hỗ trợ đầy đủ.`,
    };
  }

  if (version > BACKUP_CURRENT_SCHEMA_VERSION) {
    return {
      schemaVersion: version,
      status: "future",
      isSupported: false,
      message: `Tệp sao lưu thuộc phiên bản mới hơn (${version}). Ứng dụng hiện tại chỉ hỗ trợ phiên bản tối đa ${BACKUP_CURRENT_SCHEMA_VERSION}. Vui lòng cập nhật ứng dụng.`,
    };
  }

  if ((BACKUP_SUPPORTED_SCHEMA_VERSIONS as readonly number[]).includes(version)) {
    return {
      schemaVersion: version,
      status: "supported_old",
      isSupported: true,
      message: `Phiên bản schema cũ (${version}) được hỗ trợ chuyển đổi tự động.`,
    };
  }

  return {
    schemaVersion: version,
    status: "unsupported_old",
    isSupported: false,
    message: `Phiên bản schema (${version}) đã cũ và không còn được hỗ trợ.`,
  };
}
