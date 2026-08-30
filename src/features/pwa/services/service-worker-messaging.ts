import type { ServiceWorkerMessage } from "../types/pwa.types";

/**
 * Gửi thông điệp an toàn tới Service Worker đang hoạt động hoặc đang chờ
 */
export async function sendServiceWorkerMessage<T = unknown>(
  message: ServiceWorkerMessage
): Promise<T | null> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return null;
  }

  const registration = await navigator.serviceWorker.getRegistration();
  const target =
    registration?.active || registration?.waiting || navigator.serviceWorker.controller;

  if (!target) {
    return null;
  }

  return new Promise((resolve) => {
    const messageChannel = new MessageChannel();
    messageChannel.port1.onmessage = (event) => {
      resolve(event.data);
    };

    target.postMessage(message, [messageChannel.port2]);

    // Timeout phòng trường hợp SW không phản hồi
    setTimeout(() => {
      resolve(null);
    }, 1000);
  });
}

export async function sendSkipWaiting(): Promise<void> {
  await sendServiceWorkerMessage({ type: "SKIP_WAITING" });
}

export async function sendClearPrivateCaches(): Promise<void> {
  await sendServiceWorkerMessage({ type: "CLEAR_PRIVATE_CACHES" });
}
