import crypto from "crypto";

/**
 * Quản lý token lời mời an toàn (P27-T02)
 * Tuyệt đối không lưu token thô trong Database. Chỉ lưu mã băm SHA-256.
 */

export interface GeneratedInvitationToken {
  rawToken: string;
  tokenHash: string;
  expiresAt: Date;
}

export function generateInvitationToken(expiresInDays: number = 7): GeneratedInvitationToken {
  // Sinh 32 bytes ngẫu nhiên có entropy cao
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashInvitationToken(rawToken);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + expiresInDays);

  return {
    rawToken,
    tokenHash,
    expiresAt,
  };
}

export function hashInvitationToken(rawToken: string): string {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}

export function isInvitationExpired(expiresAt: Date | string): boolean {
  const expiryTime = new Date(expiresAt).getTime();
  return Date.now() > expiryTime;
}
