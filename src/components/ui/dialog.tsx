"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function Dialog({ isOpen, onClose, title, description, children, className }: DialogProps) {
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = React.useRef<HTMLElement | null>(null);

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
          "relative max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-xl border border-neutral-200 bg-white p-6 shadow-2xl transition-all duration-200",
          className
        )}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
          aria-label="Đóng hộp thoại"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="mb-4 pr-8">
          <h2 id="dialog-title" className="text-lg font-semibold text-neutral-900">
            {title}
          </h2>
          {description && (
            <p id="dialog-desc" className="mt-1 text-sm text-neutral-600">
              {description}
            </p>
          )}
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
}
