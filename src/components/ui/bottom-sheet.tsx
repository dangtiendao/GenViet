"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function BottomSheet({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
}: BottomSheetProps) {
  const sheetRef = React.useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      previouslyFocusedElement.current = document.activeElement as HTMLElement;
      document.body.style.overflow = "hidden";

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleKeyDown);

      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
        previouslyFocusedElement.current?.focus();
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-xs md:hidden"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="bottom-sheet-title"
        aria-describedby={description ? "bottom-sheet-desc" : undefined}
        className={cn(
          "safe-area-bottom relative flex max-h-[85dvh] w-full flex-col rounded-t-2xl bg-white p-5 pb-8 shadow-2xl transition-transform duration-300 ease-out",
          className
        )}
      >
        {/* Visual Grab Handle */}
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-neutral-300" aria-hidden="true" />

        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h2 id="bottom-sheet-title" className="text-base font-semibold text-neutral-900">
              {title}
            </h2>
            {description && (
              <p id="bottom-sheet-desc" className="text-xs text-neutral-500">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            aria-label="Đóng bảng thao tác"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pt-4">{children}</div>
      </div>
    </div>
  );
}
