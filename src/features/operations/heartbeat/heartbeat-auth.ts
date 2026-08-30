/**
 * So sánh an toàn thời gian thực (timing-safe) giữa hai chuỗi sử dụng Web Crypto SHA-256 digest
 * Hoạt động tương thích chuẩn trên cả Node.js runtime, Edge runtime, Deno và Cloudflare Workers.
 */
export async function timingSafeStringEqual(a: string, b: string): Promise<boolean> {
  if (!a || !b) {
    return false;
  }

  const encoder = new TextEncoder();
  const aBuf = encoder.encode(a);
  const bBuf = encoder.encode(b);

  // Băm SHA-256 cả hai chuỗi để đưa về độ dài cố định 32 bytes (256 bits)
  const aDigest = new Uint8Array(await globalThis.crypto.subtle.digest("SHA-256", aBuf));
  const bDigest = new Uint8Array(await globalThis.crypto.subtle.digest("SHA-256", bBuf));

  let mismatch = aBuf.length === bBuf.length ? 0 : 1;

  for (let i = 0; i < 32; i++) {
    mismatch |= aDigest[i] ^ bDigest[i];
  }

  return mismatch === 0;
}

/**
 * Trích xuất token từ Authorization header (Bearer scheme) hoặc x-heartbeat-secret header
 */
export function extractSecretFromHeaders(
  authHeader: string | null,
  customHeader: string | null
): string | null {
  if (authHeader) {
    const parts = authHeader.trim().split(/\s+/);
    if (parts.length === 2 && parts[0].toLowerCase() === "bearer") {
      return parts[1];
    }
  }

  if (customHeader) {
    return customHeader.trim();
  }

  return null;
}

/**
 * Xác minh tính hợp lệ của heartbeat secret
 */
export async function verifyHeartbeatSecret(
  authHeader: string | null,
  customHeader: string | null,
  expectedSecret: string | undefined
): Promise<boolean> {
  if (!expectedSecret || expectedSecret.trim().length === 0) {
    return false;
  }

  const clientSecret = extractSecretFromHeaders(authHeader, customHeader);
  if (!clientSecret || clientSecret.length === 0) {
    return false;
  }

  return timingSafeStringEqual(clientSecret, expectedSecret.trim());
}
