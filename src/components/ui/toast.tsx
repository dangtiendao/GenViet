"use client";

import * as React from "react";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastMessage {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

type ToastListener = (toasts: ToastMessage[]) => void;

let listeners: ToastListener[] = [];
let toastQueue: ToastMessage[] = [];

function notify() {
  listeners.forEach((l) => l([...toastQueue]));
}

export const toast = {
  show(message: string, type: ToastType = "info", title?: string, duration = 4000) {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastMessage = { id, type, title, message, duration };
    toastQueue = [...toastQueue, newToast];
    notify();

    if (duration > 0) {
      setTimeout(() => {
        toast.dismiss(id);
      }, duration);
    }
    return id;
  },
  success(message: string, title?: string, duration = 4000) {
    return toast.show(message, "success", title, duration);
  },
  error(message: string, title?: string, duration = 5000) {
    return toast.show(message, "error", title, duration);
  },
  warning(message: string, title?: string, duration = 4000) {
    return toast.show(message, "warning", title, duration);
  },
  info(message: string, title?: string, duration = 4000) {
    return toast.show(message, "info", title, duration);
  },
  dismiss(id: string) {
    toastQueue = toastQueue.filter((t) => t.id !== id);
    notify();
  },
};

export function Toaster() {
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);

  React.useEffect(() => {
    listeners.push(setToasts);
    return () => {
      listeners = listeners.filter((l) => l !== setToasts);
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="safe-area-bottom pointer-events-none fixed right-4 bottom-4 z-50 flex w-full max-w-sm flex-col space-y-2 p-4 sm:p-0"
    >
      {toasts.map((t) => {
        const isError = t.type === "error";
        const isSuccess = t.type === "success";
        const isWarning = t.type === "warning";

        return (
          <div
            key={t.id}
            role="status"
            className={cn(
              "pointer-events-auto flex items-start space-x-3 rounded-lg border bg-white p-4 shadow-lg transition-all duration-300",
              isSuccess && "border-emerald-500 bg-emerald-50/90 text-emerald-900",
              isError && "border-red-500 bg-red-50/90 text-red-900",
              isWarning && "border-amber-500 bg-amber-50/90 text-amber-900",
              !isSuccess && !isError && !isWarning && "border-neutral-300 bg-white text-neutral-900"
            )}
          >
            <div className="shrink-0 pt-0.5">
              {isSuccess && (
                <CheckCircle2 className="h-5 w-5 text-emerald-700" aria-hidden="true" />
              )}
              {isError && <AlertCircle className="h-5 w-5 text-red-700" aria-hidden="true" />}
              {isWarning && <AlertTriangle className="h-5 w-5 text-amber-700" aria-hidden="true" />}
              {!isSuccess && !isError && !isWarning && (
                <Info className="h-5 w-5 text-blue-700" aria-hidden="true" />
              )}
            </div>

            <div className="flex-1 text-sm">
              {t.title && <h4 className="font-semibold">{t.title}</h4>}
              <p className="mt-0.5 leading-snug">{t.message}</p>
            </div>

            <button
              type="button"
              onClick={() => toast.dismiss(t.id)}
              className="flex min-h-[32px] min-w-[32px] shrink-0 items-center justify-center rounded p-1 text-neutral-500 hover:bg-neutral-200/50 hover:text-neutral-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              aria-label="Đóng thông báo"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
