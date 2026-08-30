import * as React from "react";
import { AlertCircle, RotateCcw, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface ErrorStateProps {
  title?: string;
  message: string;
  errorCode?: string;
  onRetry?: () => void;
  onBack?: () => void;
  variant?: "default" | "compact";
  className?: string;
}

export function ErrorState({
  title = "Đã xảy ra lỗi",
  message,
  errorCode,
  onRetry,
  onBack,
  variant = "default",
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50/50 p-8 text-center text-neutral-900",
        variant === "compact" ? "px-4 py-6" : "px-6 py-12",
        className
      )}
    >
      <div
        className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-700"
        aria-hidden="true"
      >
        <AlertCircle className="h-7 w-7" />
      </div>

      <h3 className="text-base font-semibold text-neutral-900 md:text-lg">{title}</h3>
      <p className="mt-1.5 max-w-md text-sm leading-relaxed text-neutral-700">{message}</p>

      {errorCode && (
        <span className="mt-2 inline-block rounded bg-red-100 px-2.5 py-0.5 font-mono text-xs text-red-800">
          Mã lỗi: {errorCode}
        </span>
      )}

      {(onRetry || onBack) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {onRetry && (
            <Button
              onClick={onRetry}
              className="bg-red-600 text-white hover:bg-red-700 active:bg-red-800"
            >
              <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
              Thử lại
            </Button>
          )}
          {onBack && (
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
              Quay lại
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
