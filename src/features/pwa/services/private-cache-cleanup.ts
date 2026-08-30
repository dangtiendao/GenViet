import { sendClearPrivateCaches } from "./service-worker-messaging";
import { PWA_CONFIG } from "../config/pwa.config";

/**
 * Xóa toàn bộ cache riêng tư của người dùng tại client và Service Worker khi đăng xuất hoặc chuyển đổi tài khoản
 */
export async function clearAllPrivateCaches(): Promise<void> {
  if (typeof window === "undefined") {
    return;
  }

  try {
    // 1. Gửi thông điệp yêu cầu Service Worker xóa cache private
    await sendClearPrivateCaches();

    // 2. Xóa các cache private trực tiếp từ window.caches nếu có
    if ("caches" in window) {
      const keys = await window.caches.keys();
      await Promise.all(
        keys.map((key) => {
          if (key.startsWith(`${PWA_CONFIG.cachePrefix}private-`)) {
            return window.caches.delete(key);
          }
          return Promise.resolve(false);
        })
      );
    }

    // 3. Dọn dẹp sessionStorage client
    window.sessionStorage.clear();
  } catch (err) {
    // Best-effort cleanup: Ghi nhận log cảnh báo an toàn, không làm gián đoạn luồng logout
    console.warn("[clearAllPrivateCaches] Best-effort cleanup warning:", err);
  }
}
