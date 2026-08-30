// GenViet Service Worker v1.0.0 (Phase P20)
// Scope: /
// Cache Policy: Secure App Shell + Offline Fallback, 0% Private Data Caching

const CACHE_VERSION = "v1";
const CACHE_PREFIX = "genviet-";
const SHELL_CACHE_NAME = "genviet-shell-v1";
const OFFLINE_URL = "/offline";

const PRECACHE_ASSETS = [
  OFFLINE_URL,
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/icons/icon-maskable-192x192.png",
  "/icons/icon-maskable-512x512.png",
  "/apple-touch-icon.png",
  "/favicon.ico",
];

// Helper: Kiểm tra URL nhạy cảm / chứa token / signed URL / private API
function isSensitiveUrl(urlStr) {
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

// Helper: Kiểm tra static asset an toàn để cache
function isStaticAsset(url) {
  const path = url.pathname;
  return (
    path.startsWith("/_next/static/") ||
    path.startsWith("/icons/") ||
    path === "/apple-touch-icon.png" ||
    path === "/favicon.ico"
  );
}

// 1. INSTALL LIFECYCLE: Precache App Shell assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE_NAME)
      .then((cache) => {
        return cache.addAll(PRECACHE_ASSETS);
      })
      .catch((err) => {
        console.warn("[SW] Precache failed during install:", err);
      })
  );
});

// 2. ACTIVATE LIFECYCLE: Cleanup old GenViet caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((name) => {
            if (name.startsWith(CACHE_PREFIX) && name !== SHELL_CACHE_NAME) {
              return caches.delete(name);
            }
            return Promise.resolve(false);
          })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

// 3. FETCH LIFECYCLE: Strict Allowlist & Network-First for Navigation
self.addEventListener("fetch", (event) => {
  const request = event.request;

  // Rule 1: Non-GET requests -> Network Only
  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  // Rule 2: Cross-origin requests or sensitive/token requests -> Network Only
  if (url.origin !== self.location.origin || isSensitiveUrl(request.url)) {
    return;
  }

  // Rule 3: Requests with Authorization header -> Network Only
  if (request.headers.has("Authorization")) {
    return;
  }

  // Rule 4: Navigation requests (HTML Pages) -> Network First with Offline Fallback
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match(OFFLINE_URL).then((fallback) => {
          return (
            fallback ||
            new Response("Thiết bị đang ngoại tuyến", {
              status: 503,
              headers: { "Content-Type": "text/html; charset=utf-8" },
            })
          );
        });
      })
    );
    return;
  }

  // Rule 5: Public static build assets -> Cache First with network fill
  if (isStaticAsset(url)) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(SHELL_CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // Default: Network Only for all other queries
});

// 4. MESSAGE LIFECYCLE: skipWaiting, cache cleanup, version query
self.addEventListener("message", (event) => {
  if (!event.data || typeof event.data !== "object") return;

  const { type } = event.data;

  switch (type) {
    case "SKIP_WAITING":
      self.skipWaiting();
      break;

    case "CLEAR_PRIVATE_CACHES":
      // Xóa tất cả các cache private nếu có
      caches
        .keys()
        .then((keys) => {
          return Promise.all(
            keys.map((k) => {
              if (k.startsWith(`${CACHE_PREFIX}private-`)) {
                return caches.delete(k);
              }
              return Promise.resolve(false);
            })
          );
        })
        .then(() => {
          if (event.source && event.source.postMessage) {
            event.source.postMessage({ type: "PRIVATE_CACHES_CLEARED" });
          }
        });
      break;

    case "GET_VERSION":
      if (event.source && event.source.postMessage) {
        event.source.postMessage({
          type: "VERSION_INFO",
          payload: { version: "1.0.0", cacheName: SHELL_CACHE_NAME },
        });
      }
      break;

    default:
      // Unknown messages safely ignored
      break;
  }
});
