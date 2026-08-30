/**
 * Tiện ích truy xuất và suy dẫn nguồn gốc URL ứng dụng (Application Origin Derivation)
 * Hoạt động nhất quán giữa Local Development, Vercel Preview và Vercel Production.
 */
export function getAppOrigin(): string {
  // 1. Ưu tiên biến môi trường cấu hình tường minh
  const customOrigin = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL;
  if (customOrigin) {
    return customOrigin.replace(/\/+$/, "");
  }

  // 2. Tự động nhận diện Vercel Preview / Production URL
  const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL || process.env.VERCEL_URL;
  if (vercelUrl) {
    const formatted = vercelUrl.startsWith("http") ? vercelUrl : `https://${vercelUrl}`;
    return formatted.replace(/\/+$/, "");
  }

  // 3. Sử dụng window.location nếu chạy phía client browser
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }

  // 4. Mặc định cho môi trường Local Development
  return "http://localhost:3000";
}

/**
 * Xây dựng URL callback xác thực Supabase an toàn
 */
export function getAuthCallbackUrl(nextPath: string = "/dashboard"): string {
  const origin = getAppOrigin();
  const sanitizedNext = nextPath.startsWith("/") ? nextPath : `/${nextPath}`;
  const encodedNext = encodeURIComponent(sanitizedNext);
  return `${origin}/auth/callback?next=${encodedNext}`;
}
