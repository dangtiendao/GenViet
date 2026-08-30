"use client";

import * as React from "react";
import { createPortal } from "react-dom";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
}

const sizeClasses: Record<string, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
};

export function Dialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  className,
  size = "lg",
}: DialogProps) {
  const [mounted, setMounted] = React.useState(false);
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (isOpen) {
      previouslyFocusedElement.current = document.activeElement as HTMLElement;
      document.body.style.overflow = "hidden";

      // Focus close button or first focusable element inside dialog
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable && focusable.length > 0) {
        focusable[0]?.focus();
      }

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          e.preventDefault();
          onClose();
        }
        // Focus trap
        if (e.key === "Tab" && dialogRef.current) {
          const focusableEls = dialogRef.current.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          );
          if (focusableEls.length > 0) {
            const first = focusableEls[0];
            const last = focusableEls[focusableEls.length - 1];
            if (e.shiftKey && document.activeElement === first) {
              e.preventDefault();
              last?.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
              e.preventDefault();
              first?.focus();
            }
          }
        }
      };

      window.addEventListener("keydown", handleKeyDown, true);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown, true);
        previouslyFocusedElement.current?.focus();
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const content = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby={description ? "dialog-desc" : undefined}
        className={cn(
          "relative flex max-h-[90dvh] w-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl transition-all duration-200",
          sizeClasses[size] || "max-w-lg",
          className
        )}
      >
        {/* Header Cố định (Fixed Header) */}
        <div className="flex shrink-0 items-start justify-between border-b border-neutral-100 px-6 py-4.5 sm:px-7">
          <div className="pr-6">
            <h2 id="dialog-title" className="text-lg font-bold text-neutral-900 sm:text-xl">
              {title}
            </h2>
            {description && (
              <p id="dialog-desc" className="mt-1 text-xs text-neutral-500 sm:text-sm">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
            aria-label="Đóng hộp thoại"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Body Cuộn (Scrollable Body) */}
        <div className="flex-1 overflow-y-auto px-6 py-5 sm:px-7">{children}</div>

        {/* Footer Cố định (Fixed Footer) */}
        {footer && (
          <div className="flex shrink-0 items-center justify-end gap-3 border-t border-neutral-100 bg-neutral-50/60 px-6 py-4 sm:px-7">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  if (typeof document !== "undefined" && mounted) {
    return createPortal(content, document.body);
  }

  return content;
}
