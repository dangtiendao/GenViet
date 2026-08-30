"use client";

import * as React from "react";
import { useActionState } from "react";
import { softDeletePersonAction } from "../actions/person.actions";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, AlertCircle, Trash2 } from "lucide-react";

export interface DeletePersonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  treeId: string;
  personId: string;
  personName: string;
  version: number;
}

export function DeletePersonDialog({
  isOpen,
  onClose,
  treeId,
  personId,
  personName,
  version,
}: DeletePersonDialogProps) {
  const [state, formAction, isPending] = useActionState(softDeletePersonAction, null);

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Xác nhận xóa hồ sơ nhân vật"
      description={`Bạn có chắc chắn muốn xóa hồ sơ của nhân vật "${personName}"?`}
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

        {/* Impact Summary */}
        <div className="space-y-2 rounded-lg border border-amber-200 bg-amber-50/70 p-3.5 text-xs text-amber-900">
          <div className="flex items-center space-x-1.5 font-semibold">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-700" aria-hidden="true" />
            <span>Tác động của việc xóa mềm:</span>
          </div>
          <ul className="list-inside list-disc space-y-1 pl-1 text-neutral-700">
            <li>Nhân vật sẽ bị ẩn khỏi danh sách và sơ đồ cây phả hệ.</li>
            <li>
              Các quan hệ gia đình (cha mẹ, con cái, vợ chồng) vẫn được bảo toàn nguyên vẹn trong
              CSDL.
            </li>
            <li>Người quản trị có thể khôi phục lại nhân vật từ Thùng rác bất cứ lúc nào.</li>
          </ul>
        </div>

        <div className="flex items-center justify-end space-x-3 border-t pt-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
            Hủy bỏ
          </Button>

          <Button
            type="submit"
            variant="destructive"
            loading={isPending}
            className="min-w-[120px] bg-red-600 text-white hover:bg-red-700"
          >
            <Trash2 className="mr-1.5 h-4 w-4" aria-hidden="true" />
            {isPending ? "Đang xóa..." : "Xác nhận xóa"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
