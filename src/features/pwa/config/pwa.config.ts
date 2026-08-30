export const PWA_CONFIG = {
  version: "1.0.0",
  cachePrefix: "genviet-",
  shellCacheName: "genviet-shell-v1",
  offlineUrl: "/offline",
  precacheUrls: [
    "/offline",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png",
    "/icons/icon-maskable-192x192.png",
    "/icons/icon-maskable-512x512.png",
    "/apple-touch-icon.png",
    "/favicon.ico",
  ],
} as const;

/**
 * Kiểm tra xem URL có chứa token, mật khẩu hoặc signed URL bí mật hay không
 */
export function isSensitiveUrl(urlStr: string): boolean {
  const lower = urlStr.toLowerCase();
  return (
    lower.includes("token=") ||
    lower.includes("access_token=") ||
    lower.includes("refresh_token=") ||
    lower.includes("apikey=") ||
    lower.includes("signature=") ||
    lower.includes("signed_url") ||
    lower.includes("signedurl") ||
    lower.includes("/auth/v1/") ||
    lower.includes("/auth/callback") ||
    lower.includes("/auth/confirm") ||
    lower.includes("/api/trees/") ||
    lower.includes("/backup")
  );
}

/**
 * Kiểm tra xem request có phải là static asset an toàn để cache không
 */
export function isStaticAssetUrl(urlStr: string): boolean {
  const url = new URL(urlStr, "http://localhost");
  const path = url.pathname;

  return (
    path.startsWith("/_next/static/") ||
    path.startsWith("/icons/") ||
    path === "/apple-touch-icon.png" ||
    path === "/favicon.ico" ||
    path === "/manifest.webmanifest"
  );
}
