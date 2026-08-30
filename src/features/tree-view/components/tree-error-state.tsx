import React from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TreeViewDomainError } from "../errors/tree-view.errors";

export function TreeErrorState({
  error,
  onRetry,
}: {
  error: TreeViewDomainError;
  onRetry?: () => void;
}) {
  return (
    <div className="flex h-full min-h-[400px] w-full flex-col items-center justify-center p-8 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 shadow-2xs">
        <AlertTriangle className="h-7 w-7" aria-hidden="true" />
      </div>

      <h2 className="mt-4 text-base font-bold text-neutral-900">Không thể hiển thị sơ đồ cây</h2>
      <p className="mt-1.5 max-w-md text-xs leading-relaxed text-neutral-500">{error.message}</p>

      {error.retryable && onRetry && (
        <div className="mt-5">
          <Button type="button" variant="outline" size="sm" onClick={onRetry}>
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
            Thử tải lại
          </Button>
        </div>
      )}
    </div>
  );
}
