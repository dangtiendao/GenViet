"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { PartialDateInput, type PartialDateValue } from "@/components/forms/partial-date-input";
import { endUnionAction } from "../actions/relationship.actions";
import { mapPartialDateToDatabase } from "@/features/persons/utils/partial-date-mapper";

export function EndUnionDialog({
  isOpen,
  onClose,
  treeId,
  personId,
  unionId,
  partnerName,
  expectedVersion,
}: {
  isOpen: boolean;
  onClose: () => void;
  treeId: string;
  personId: string;
  unionId: string;
  partnerName: string;
  expectedVersion: number;
}) {
  const [newStatus, setNewStatus] = useState<"divorced" | "widowed" | "separated" | "former">(
    "divorced"
  );
  const [endDateVal, setEndDateVal] = useState<PartialDateValue>({
    precision: "unknown",
    year: null,
    month: null,
    day: null,
    isEstimated: false,
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleEndUnion = () => {
    setErrorMessage(null);
    startTransition(async () => {
      const mappedEnd = mapPartialDateToDatabase(endDateVal);
      const res = await endUnionAction(treeId, personId, {
        unionId,
        expectedVersion,
        newStatus,
        endDate: mappedEnd.date,
        endYear: mappedEnd.year,
        endDatePrecision: mappedEnd.precision,
      });

      if (res.success) {
        onClose();
      } else {
        setErrorMessage(res.message || "Không thể kết thúc hôn nhân.");
      }
    });
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Kết thúc quan hệ hôn nhân"
      description={`Cập nhật trạng thái kết thúc hôn nhân với "${partnerName}". Lịch sử hôn nhân và liên kết con cái vẫn được bảo toàn nguyên vẹn.`}
    >
      <div className="space-y-4 py-1">
        <div>
          <label className="text-xs font-medium text-neutral-700">Trạng thái mới *</label>
          <Select
            value={newStatus}
            onChange={(e) =>
              setNewStatus(e.target.value as "divorced" | "widowed" | "separated" | "former")
            }
            className="mt-1"
          >
            <option value="divorced">Ly hôn (Divorced)</option>
            <option value="widowed">Góa (Widowed)</option>
            <option value="separated">Ly thân (Separated)</option>
            <option value="former">Trước đây (Former)</option>
          </Select>
        </div>

        <PartialDateInput
          label="Ngày / Năm kết thúc (Tùy chọn)"
          value={endDateVal}
          onChange={setEndDateVal}
        />

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
            onClick={handleEndUnion}
            disabled={isPending}
            className="bg-rose-700 hover:bg-rose-800"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang lưu...
              </>
            ) : (
              "Lưu thay đổi"
            )}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
