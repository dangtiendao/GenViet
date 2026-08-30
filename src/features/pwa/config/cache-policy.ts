export type CacheStrategy =
  "Precache" | "CacheFirst" | "NetworkFirst" | "NetworkOnly" | "StaleWhileRevalidate";

export interface CachePolicyItem {
  requestClass: string;
  pattern: string;
  sensitivity: "public" | "private" | "critical_auth";
  method: "GET" | "ALL" | "NON_GET";
  strategy: CacheStrategy;
  cacheName?: string;
  cleanupEvent?: string;
  reason: string;
}

export const CACHE_POLICY_MATRIX: CachePolicyItem[] = [
  {
    requestClass: "Offline Fallback HTML",
    pattern: "/offline",
    sensitivity: "public",
    method: "GET",
    strategy: "Precache",
    cacheName: "genviet-shell-v1",
    cleanupEvent: "SW Update",
    reason: "Hiển thị trang thông báo ngoại tuyến khi không có mạng",
  },
  {
    requestClass: "PWA Icons & Manifest",
    pattern: "/icons/*, /manifest.webmanifest, /apple-touch-icon.png, /favicon.ico",
    sensitivity: "public",
    method: "GET",
    strategy: "Precache",
    cacheName: "genviet-shell-v1",
    cleanupEvent: "SW Update",
    reason: "Nhận diện thương hiệu và splash screen khi cài đặt",
  },
  {
    requestClass: "Next.js Static Build Assets (JS/CSS with hash)",
    pattern: "/_next/static/*",
    sensitivity: "public",
    method: "GET",
    strategy: "CacheFirst",
    cacheName: "genviet-shell-v1",
    cleanupEvent: "SW Update",
    reason: "Tăng tốc tải giao diện với các tệp build tĩnh có content hash bất biến",
  },
  {
    requestClass: "App Navigation Routes",
    pattern: "/* (mode: navigate)",
    sensitivity: "private",
    method: "GET",
    strategy: "NetworkFirst",
    cacheName: "None (Fallback to /offline)",
    cleanupEvent: "Logout / Account Switch",
    reason: "Luôn lấy HTML mới nhất từ server, không bao giờ cache HTML chứa dữ liệu riêng tư",
  },
  {
    requestClass: "Supabase Auth & Session Endpoints",
    pattern: "/auth/*, /auth/v1/*",
    sensitivity: "critical_auth",
    method: "ALL",
    strategy: "NetworkOnly",
    reason: "Tuyệt đối không lưu token, session hay cookies trong Cache Storage",
  },
  {
    requestClass: "Family Tree Graph API",
    pattern: "/api/trees/[treeId]/graph",
    sensitivity: "private",
    method: "GET",
    strategy: "NetworkOnly",
    reason: "Dữ liệu cây gia phả riêng tư, bảo vệ bởi RLS và Cache-Control: private, no-cache",
  },
  {
    requestClass: "Person Search API",
    pattern: "/search, /api/search",
    sensitivity: "private",
    method: "GET",
    strategy: "NetworkOnly",
    reason: "Kết quả tìm kiếm thành viên dòng họ riêng tư",
  },
  {
    requestClass: "Audit History",
    pattern: "*/history",
    sensitivity: "private",
    method: "GET",
    strategy: "NetworkOnly",
    reason: "Nhật ký biến động dữ liệu nhạy cảm",
  },
  {
    requestClass: "Storage Avatar Signed URLs",
    pattern: "*token=*, *signature=*, *signed_url*",
    sensitivity: "private",
    method: "GET",
    strategy: "NetworkOnly",
    reason: "Bearer token có hạn, không persistent-cache, offline dùng avatar placeholder",
  },
  {
    requestClass: "Backup Export & Import",
    pattern: "/api/trees/[treeId]/backup, /trees/import",
    sensitivity: "private",
    method: "ALL",
    strategy: "NetworkOnly",
    reason: "Dữ liệu xuất nhập sao lưu toàn bộ dòng họ, Cache-Control: no-store",
  },
  {
    requestClass: "Mutation Requests (POST/PUT/PATCH/DELETE)",
    pattern: "All mutations",
    sensitivity: "private",
    method: "NON_GET",
    strategy: "NetworkOnly",
    reason:
      "Chỉnh sửa dữ liệu bắt buộc cần kết nối server trực tiếp, không hỗ trợ offline mutation",
  },
];
