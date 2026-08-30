"use client";

import * as React from "react";
import { useActionState } from "react";
import { restoreFamilyTreeAction } from "../actions/family-tree.actions";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RotateCcw, AlertCircle } from "lucide-react";

export interface RestoreFamilyTreeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  treeId: string;
  treeName: string;
}

export function RestoreFamilyTreeDialog({
  isOpen,
  onClose,
  treeId,
  treeName,
}: RestoreFamilyTreeDialogProps) {
  const [state, formAction, isPending] = useActionState(restoreFamilyTreeAction, null);

  React.useEffect(() => {
    if (state?.success) {
      onClose();
    }
  }, [state, onClose]);

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Khôi phục cây gia phả"
      description={`Bạn có chắc chắn muốn khôi phục cây gia phả "${treeName}" trở lại hoạt động?`}
    >
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="treeId" value={treeId} />

        {state?.error && (
          <div
            role="alert"
            className="flex items-center space-x-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-800"
          >
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />
            <span>{state.error}</span>
          </div>
        )}

        <p className="text-xs text-neutral-600">
          Cây gia phả sẽ xuất hiện trở lại trong danh sách chính và các thành viên được cấp quyền có
          thể tiếp tục truy cập.
        </p>

        <div className="flex items-center justify-end space-x-3 border-t pt-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
            Hủy bỏ
          </Button>

          <Button
            type="submit"
            loading={isPending}
            className="min-w-[120px] bg-emerald-700 text-white hover:bg-emerald-800"
          >
            <RotateCcw className="mr-1.5 h-4 w-4" aria-hidden="true" />
            {isPending ? "Đang khôi phục..." : "Khôi phục"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
