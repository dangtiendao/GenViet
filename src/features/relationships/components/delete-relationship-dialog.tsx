"use client";

import { useState, useTransition } from "react";
import { Loader2, AlertTriangle } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  softDeleteRelationshipAction,
  softDeleteUnionAction,
} from "../actions/relationship.actions";

export function DeleteRelationshipDialog({
  isOpen,
  onClose,
  treeId,
  personId,
  targetType,
  targetId,
  targetName,
  expectedVersion,
}: {
  isOpen: boolean;
  onClose: () => void;
  treeId: string;
  personId: string;
  targetType: "relationship" | "union";
  targetId: string;
  targetName: string;
  expectedVersion: number;
}) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    setErrorMessage(null);
    startTransition(async () => {
      let res;
      if (targetType === "relationship") {
        res = await softDeleteRelationshipAction(treeId, personId, {
          relationshipId: targetId,
          expectedVersion,
        });
      } else {
        res = await softDeleteUnionAction(treeId, personId, {
          unionId: targetId,
          expectedVersion,
        });
      }

      if (res.success) {
        onClose();
      } else {
        setErrorMessage(res.message || "Không thể xóa quan hệ.");
      }
    });
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={targetType === "relationship" ? "Xóa quan hệ phả hệ" : "Xóa liên kết hôn nhân"}
      description={`Bạn có chắc chắn muốn xóa quan hệ với "${targetName}"?`}
    >
      <div className="space-y-4 py-1">
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-900">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
            <div>
              <span className="font-semibold">Lưu ý an toàn:</span> Thao tác này chỉ gỡ bỏ liên kết
              quan hệ. Hồ sơ cá nhân của <span className="font-medium">{targetName}</span> vẫn tồn
              tại đầy đủ trong cây gia phả.
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
            {errorMessage}
          </div>
        )}

        <div className="flex items-center justify-end gap-2 border-t border-neutral-100 pt-4">
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Hủy
          </Button>
          <Button
            onClick={handleDelete}
            disabled={isPending}
            className="bg-rose-700 hover:bg-rose-800"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xóa...
              </>
            ) : (
              "Xác nhận xóa"
            )}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
