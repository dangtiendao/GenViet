export const AUDIT_ERROR_CODES = {
  NOT_FOUND: "AUDIT_NOT_FOUND",
  FORBIDDEN: "AUDIT_FORBIDDEN",
  ENTITY_TYPE_INVALID: "AUDIT_ENTITY_TYPE_INVALID",
  ACTION_TYPE_INVALID: "AUDIT_ACTION_TYPE_INVALID",
  PAYLOAD_INVALID: "AUDIT_PAYLOAD_INVALID",
  PAYLOAD_TOO_LARGE: "AUDIT_PAYLOAD_TOO_LARGE",
  REDACTION_FAILED: "AUDIT_REDACTION_FAILED",
  WRITE_FAILED: "AUDIT_WRITE_FAILED",
  QUERY_INVALID: "AUDIT_QUERY_INVALID",
  CURSOR_INVALID: "AUDIT_CURSOR_INVALID",
  QUERY_FAILED: "AUDIT_QUERY_FAILED",
  IMMUTABLE: "AUDIT_IMMUTABLE",
  UNKNOWN_ERROR: "AUDIT_UNKNOWN_ERROR",
} as const;

export type AuditErrorCode = (typeof AUDIT_ERROR_CODES)[keyof typeof AUDIT_ERROR_CODES];

export class AuditDomainError extends Error {
  readonly code: AuditErrorCode;
  readonly status: number;

  constructor(code: AuditErrorCode, message: string, status: number = 400) {
    super(message);
    this.name = "AuditDomainError";
    this.code = code;
    this.status = status;
  }
}
