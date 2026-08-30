"use client";

import * as React from "react";
import { useActionState } from "react";
import { restorePersonAction } from "../actions/person.actions";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RotateCcw, AlertCircle } from "lucide-react";

export interface RestorePersonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  treeId: string;
  personId: string;
  personName: string;
  version: number;
}

export function RestorePersonDialog({
  isOpen,
  onClose,
  treeId,
  personId,
  personName,
  version,
}: RestorePersonDialogProps) {
  const [state, formAction, isPending] = useActionState(restorePersonAction, null);

  React.useEffect(() => {
    if (state?.success) {
      onClose();
    }
  }, [state, onClose]);

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Khôi phục hồ sơ nhân vật"
      description={`Bạn có chắc chắn muốn khôi phục nhân vật "${personName}" trở lại cây gia phả?`}
    >
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="treeId" value={treeId} />
        <input type="hidden" name="personId" value={personId} />
        <input type="hidden" name="expectedVersion" value={version} />

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
          Nhân vật sẽ xuất hiện trở lại trong danh sách và các thành viên được cấp quyền có thể tiếp
          tục tra cứu, quản lý thông tin.
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
