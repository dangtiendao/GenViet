import { BACKUP_ERROR_CODES, BackupDomainError } from "../errors/backup.errors";

const DENYLIST_SECRET_KEYS = new Set([
  "password",
  "current_password",
  "new_password",
  "access_token",
  "refresh_token",
  "token",
  "token_hash",
  "confirmation_token",
  "recovery_token",
  "service_role",
  "secret_key",
  "client_secret",
  "database_url",
  "database_password",
  "authorization",
  "cookie",
  "signed_url",
  "signedurl",
  "signed_upload_url",
  "upload_token",
  "cron_secret",
  "blob",
  "base64",
]);

/**
 * Quét đệ quy object/JSON để phát hiện bất kỳ secret hoặc signed URL nào
 */
export function scanForSecretsAndTokens(data: unknown, path = ""): string[] {
  const violations: string[] = [];

  if (!data || typeof data !== "object") {
    if (typeof data === "string") {
      const lower = data.toLowerCase();
      if (
        lower.includes("bearer ") ||
        lower.includes("x-supabase-") ||
        lower.includes("token=") ||
        lower.includes("apikey=") ||
        lower.includes("signature=")
      ) {
        violations.push(`Giá trị tại "${path}" chứa token hoặc chữ ký URL nhạy cảm`);
      }
    }
    return violations;
  }

  if (Array.isArray(data)) {
    data.forEach((item, index) => {
      violations.push(...scanForSecretsAndTokens(item, `${path}[${index}]`));
    });
    return violations;
  }

  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    const currentPath = path ? `${path}.${key}` : key;
    const lowerKey = key.toLowerCase();

    if (DENYLIST_SECRET_KEYS.has(lowerKey)) {
      violations.push(`Phát hiện khóa nhạy cảm bị cấm: "${currentPath}"`);
    }

    violations.push(...scanForSecretsAndTokens(value, currentPath));
  }

  return violations;
}

/**
 * Đảm bảo dữ liệu backup xuất ra hoàn toàn sạch, không chứa bất kỳ secret nào
 */
export function assertNoSecretsInBackup(data: unknown): void {
  const violations = scanForSecretsAndTokens(data);
  if (violations.length > 0) {
    throw new BackupDomainError(
      BACKUP_ERROR_CODES.SECRET_DETECTED,
      `Phát hiện dữ liệu nhạy cảm trong backup: ${violations[0]}`,
      500
    );
  }
}
