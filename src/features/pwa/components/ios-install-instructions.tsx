"use client";

import React from "react";
import { Share, PlusSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface IosInstallInstructionsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function IosInstallInstructions({ isOpen, onClose }: IosInstallInstructionsProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ios-install-title"
      className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/50 p-4 backdrop-blur-xs"
    >
      <div className="relative w-full max-w-sm space-y-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
          aria-label="Đóng hướng dẫn cài đặt"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="space-y-1">
          <h3 id="ios-install-title" className="text-base font-bold text-neutral-900">
            Cài Đặt GenViet Trên iPhone / iPad
          </h3>
          <p className="text-xs text-neutral-500">
            Thêm GenViet vào Màn hình chính để sử dụng như một ứng dụng độc lập với trải nghiệm mượt
            mà.
          </p>
        </div>

        <div className="space-y-3 rounded-xl border border-neutral-100 bg-neutral-50 p-4 text-xs text-neutral-700">
          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-bold text-emerald-800">
              1
            </div>
            <div className="space-y-0.5">
              <span>
                Chạm vào nút <strong>Chia sẻ</strong> trên thanh công cụ Safari:
              </span>
              <div className="flex items-center gap-1.5 pt-0.5 font-medium text-emerald-700">
                <Share className="h-4 w-4" />
                <span>Biểu tượng hình vuông có mũi tên hướng lên</span>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-bold text-emerald-800">
              2
            </div>
            <div className="space-y-0.5">
              <span>Cuộn xuống và chọn:</span>
              <div className="flex items-center gap-1.5 pt-0.5 font-medium text-emerald-700">
                <PlusSquare className="h-4 w-4" />
                <span>Thêm vào Màn hình chính (Add to Home Screen)</span>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-bold text-emerald-800">
              3
            </div>
            <p>
              Chạm vào nút <strong>Thêm</strong> ở góc trên bên phải để xác nhận hoàn tất.
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <Button
            type="button"
            size="sm"
            onClick={onClose}
            className="h-9 w-full bg-emerald-700 text-xs text-white hover:bg-emerald-800"
          >
            Đã hiểu
          </Button>
        </div>
      </div>
    </div>
  );
}
