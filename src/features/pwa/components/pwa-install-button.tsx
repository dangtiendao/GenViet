"use client";

import React, { useState } from "react";
import { Download, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInstallPrompt } from "../hooks/use-install-prompt";
import { IosInstallInstructions } from "./ios-install-instructions";

export interface PwaInstallButtonProps {
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

export function PwaInstallButton({
  className = "",
  variant = "outline",
  size = "sm",
}: PwaInstallButtonProps) {
  const { isInstallable, isIos, isInstalled, promptInstall } = useInstallPrompt();
  const [showIosModal, setShowIosModal] = useState(false);

  // Không hiển thị nếu đã cài đặt hoặc không hỗ trợ
  if (isInstalled || (!isInstallable && !isIos)) {
    return null;
  }

  const handleClick = async () => {
    if (isIos) {
      setShowIosModal(true);
    } else {
      await promptInstall();
    }
  };

  return (
    <>
      <Button
        type="button"
        variant={variant}
        size={size}
        onClick={handleClick}
        className={`flex items-center gap-1.5 border-emerald-300 text-xs text-emerald-800 hover:bg-emerald-50 ${className}`}
        aria-label="Cài đặt ứng dụng GenViet vào thiết bị"
      >
        {isIos ? (
          <Smartphone className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Download className="h-4 w-4" aria-hidden="true" />
        )}
        <span>Cài đặt ứng dụng</span>
      </Button>

      {showIosModal && (
        <IosInstallInstructions isOpen={showIosModal} onClose={() => setShowIosModal(false)} />
      )}
    </>
  );
}
