"use client";

import React, { useState, useTransition } from "react";
import { RotateCcw, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { restoreRelationshipRecoveryAction } from "../actions/recovery.actions";
import type { TrashItemDto } from "../types/recovery.types";

export interface RestoreRelationshipDialogProps {
  treeId: string;
  item: TrashItemDto;
}

export function RestoreRelationshipDialog({ treeId, item }: RestoreRelationshipDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleRestore = () => {
    setErrorMessage(null);
    startTransition(async () => {
      const res = await restoreRelationshipRecoveryAction({
        treeId,
        relationshipId: item.id,
        expectedVersion: item.version,
      });

      if (!res.success) {
        setErrorMessage(res.error || "Khôi phục quan hệ thất bại.");
        return;
      }

      setIsOpen(false);
    });
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="h-8 text-xs text-emerald-700 hover:text-emerald-800"
      >
        <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
        Khôi phục
      </Button>

      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Khôi phục quan hệ phả hệ"
        description={`Khôi phục liên kết "${item.displayName}" vào cây gia phả.`}
      >
        <div className="space-y-4 pt-2">
          {errorMessage && (
            <div className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <p className="text-xs text-neutral-600">
            Hệ thống sẽ tự động kiểm tra đảm bảo không tạo chu trình tổ tiên - hậu duệ và cả hai
            nhân vật liên quan đều đang hoạt động.
          </p>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(false)}
              disabled={isPending}
            >
              Hủy
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleRestore}
              disabled={isPending}
              className="bg-emerald-700 text-white hover:bg-emerald-800"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Đang khôi phục...
                </>
              ) : (
                "Xác nhận khôi phục"
              )}
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
