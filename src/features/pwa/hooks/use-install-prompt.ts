"use client";

import { useState, useEffect, useCallback } from "react";
import { useDisplayMode } from "./use-display-mode";
import type { BeforeInstallPromptEvent, PwaInstallState } from "../types/pwa.types";

export function useInstallPrompt(): PwaInstallState & {
  promptInstall: () => Promise<boolean>;
} {
  const { isStandalone } = useDisplayMode();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [isIos, setIsIos] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const promptInstall = useCallback(async (): Promise<boolean> => {
    if (!deferredPrompt) {
      return false;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      return outcome === "accepted";
    } catch (err) {
      console.warn("[useInstallPrompt] Error prompting install:", err);
      return false;
    }
  }, [deferredPrompt]);

  return {
    isInstallable: !!deferredPrompt && !isStandalone && !isInstalled,
    isInstalled: isInstalled || isStandalone,
    isStandalone,
    isIos: isIos && !isStandalone,
    promptInstall,
  };
}
