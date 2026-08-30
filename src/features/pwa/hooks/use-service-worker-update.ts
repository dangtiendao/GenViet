"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { sendSkipWaiting } from "../services/service-worker-messaging";
import type { PwaUpdateState } from "../types/pwa.types";

export function useServiceWorkerUpdate(): PwaUpdateState & {
  applyUpdate: () => Promise<void>;
  dismissUpdate: () => void;
} {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const refreshingRef = useRef<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    navigator.serviceWorker.getRegistration().then((registration) => {
      if (!registration) return;

      // Nếu đã có worker đang waiting
      if (registration.waiting) {
        setWaitingWorker(registration.waiting);
        setIsUpdateAvailable(true);
      }

      // Lắng nghe khi có worker mới đang cài đặt
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        if (!newWorker) return;

        newWorker.addEventListener("statechange", () => {
          if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
            setWaitingWorker(newWorker);
            setIsUpdateAvailable(true);
          }
        });
      });
    });

    // Lắng nghe khi controller thay đổi để reload trang đúng 1 lần
    const handleControllerChange = () => {
      if (refreshingRef.current) return;
      refreshingRef.current = true;
      window.location.reload();
    };

    navigator.serviceWorker.addEventListener("controllerchange", handleControllerChange);

    return () => {
      navigator.serviceWorker.removeEventListener("controllerchange", handleControllerChange);
    };
  }, []);

  const applyUpdate = useCallback(async () => {
    setIsUpdating(true);
    await sendSkipWaiting();
  }, []);

  const dismissUpdate = useCallback(() => {
    setIsUpdateAvailable(false);
  }, []);

  return {
    isUpdateAvailable,
    isUpdating,
    waitingWorker,
    applyUpdate,
    dismissUpdate,
  };
}
