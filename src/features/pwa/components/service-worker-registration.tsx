"use client";

import { useEffect } from "react";

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      process.env.NODE_ENV !== "test"
    ) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js", { scope: "/" })
          .then((registration) => {
            // Check for updates periodically
            registration.update().catch(() => {});
          })
          .catch((err) => {
            console.warn("[SW] Service Worker registration failed:", err);
          });
      });
    }
  }, []);

  return null;
}
