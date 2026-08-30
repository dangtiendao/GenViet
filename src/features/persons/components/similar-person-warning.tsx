"use client";

import * as React from "react";
import { AlertTriangle, UserCheck } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { SimilarPersonCandidate } from "../types/person.types";

export interface SimilarPersonWarningDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  candidates: SimilarPersonCandidate[];
  isPending?: boolean;
}

export function SimilarPersonWarningDialog({
  isOpen,
  onClose,
  onConfirm,
  candidates,
  isPending,
}: SimilarPersonWarningDialogProps) {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Cảnh báo: Hồ sơ nhân vật tương tự"
      description="Hệ thống phát hiện các nhân vật có thông tin tương tự đã tồn tại trong cây gia phả này."
    >
      <div className="space-y-4">
        <div className="flex items-start space-x-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" aria-hidden="true" />
          <p>
            Để tránh tạo trùng lặp hồ sơ gia phả, vui lòng kiểm tra danh sách nhân vật dưới đây
            trước khi tiếp tục.
          </p>
        </div>

        <div className="max-h-52 divide-y divide-neutral-100 overflow-y-auto rounded-lg border border-neutral-200 bg-white">
          {candidates.map((c) => (
            <div key={c.id} className="flex items-center justify-between p-3 text-xs">
              <div>
                <div className="flex items-center font-semibold text-neutral-900">
                  <UserCheck className="mr-1.5 h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                  {c.fullName}
                </div>
                <div className="mt-0.5 space-x-2 text-neutral-500">
                  <span>
                    Giới tính:{" "}
                    {c.gender === "male"
                      ? "Nam"
                      : c.gender === "female"
                        ? "Nữ"
                        : c.gender === "other"
                          ? "Khác"
                          : "Chưa rõ"}
                  </span>
                  <span>•</span>
                  <span>{c.birthYear ? `Sinh năm ${c.birthYear}` : "Năm sinh chưa rõ"}</span>
                  {c.hometownText && (
                    <>
                      <span>•</span>
                      <span>Quê quán: {c.hometownText}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-neutral-600">
          Nếu đây là một người khác (ví dụ: trùng tên hoặc cùng thế hệ), bạn vẫn có thể chọn{" "}
          <span className="font-semibold text-neutral-900">"Vẫn tạo nhân vật này"</span>.
        </p>

        <div className="flex flex-wrap items-center justify-end gap-2.5 border-t pt-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
            Quay lại kiểm tra
          </Button>

          <Button
            type="button"
            onClick={onConfirm}
            loading={isPending}
            className="min-w-[140px] bg-amber-600 text-white hover:bg-amber-700"
          >
            Vẫn tạo nhân vật này
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
