"use client";

import * as React from "react";
import { useActionState } from "react";
import { softDeleteFamilyTreeAction } from "../actions/family-tree.actions";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertTriangle, AlertCircle } from "lucide-react";

export interface DeleteFamilyTreeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  treeId: string;
  treeName: string;
  version: number;
}

export function DeleteFamilyTreeDialog({
  isOpen,
  onClose,
  treeId,
  treeName,
  version,
}: DeleteFamilyTreeDialogProps) {
  const [state, formAction, isPending] = useActionState(softDeleteFamilyTreeAction, null);
  const [confirmationName, setConfirmationName] = React.useState("");

  const isMatched = confirmationName.trim() === treeName.trim();

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Xác nhận xóa cây gia phả"
      description="Thao tác này sẽ chuyển cây gia phả vào thùng rác."
    >
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="treeId" value={treeId} />
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
        <div className="space-y-2 rounded-lg border border-amber-200 bg-amber-50/70 p-4 text-xs text-amber-900">
          <div className="flex items-center space-x-2 font-semibold">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-700" aria-hidden="true" />
            <span>Tác động của việc xóa mềm:</span>
          </div>
          <ul className="list-inside list-disc space-y-1 pl-1 text-neutral-700">
            <li>Cây gia phả sẽ không còn hiển thị trong danh sách thông thường.</li>
            <li>Dữ liệu các nhân vật và quan hệ vẫn được giữ nguyên vẹn.</li>
            <li>Chủ sở hữu có thể khôi phục lại cây từ Thùng rác bất kỳ lúc nào.</li>
          </ul>
        </div>

        <div>
          <label
            htmlFor="delete-confirm-name"
            className="mb-1.5 block text-xs font-semibold text-neutral-800"
          >
            Nhập chính xác tên cây gia phả{" "}
            <span className="font-mono font-bold text-red-600">"{treeName}"</span> để xác nhận:
          </label>
          <Input
            id="delete-confirm-name"
            name="confirmationName"
            value={confirmationName}
            onChange={(e) => setConfirmationName(e.target.value)}
            placeholder={treeName}
            disabled={isPending}
            autoComplete="off"
          />
        </div>

        <div className="flex items-center justify-end space-x-3 border-t pt-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
            Hủy bỏ
          </Button>

          <Button
            type="submit"
            variant="destructive"
            loading={isPending}
            disabled={!isMatched || isPending}
            className="min-w-[120px] bg-red-600 text-white hover:bg-red-700"
          >
            {isPending ? "Đang xóa..." : "Xác nhận xóa"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
