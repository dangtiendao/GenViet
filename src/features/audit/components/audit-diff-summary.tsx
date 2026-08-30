import React from "react";
import { ArrowRight } from "lucide-react";
import type { AuditLogDto } from "../types/audit.types";

export interface AuditDiffSummaryProps {
  log: AuditLogDto;
}

const FIELD_LABELS: Record<string, string> = {
  full_name: "Họ và tên",
  gender: "Giới tính",
  living_status: "Trạng thái sống",
  birth_date: "Ngày sinh",
  birth_year: "Năm sinh",
  death_date: "Ngày mất",
  death_year: "Năm mất",
  birth_place_text: "Nơi sinh",
  death_place_text: "Nơi mất",
  hometown_text: "Quê quán",
  burial_place_text: "Nơi an táng",
  occupation_text: "Nghề nghiệp",
  biography: "Tiểu sử",
  verification_status: "Xác minh",
  name: "Tên cây gia phả",
  description: "Mô tả",
  privacy_level: "Quyền riêng tư",
  status: "Trạng thái",
  parent_role: "Vai trò phụ huynh",
  relationship_kind: "Quan hệ huyết thống",
  avatar_path: "Ảnh đại diện",
  deleted_at: "Thời điểm xóa",
  version: "Phiên bản",
};

export function AuditDiffSummary({ log }: AuditDiffSummaryProps) {
  const { actionType, beforeData, afterData, changedFields } = log;

  if (actionType === "create") {
    return (
      <div className="text-xs text-neutral-600">
        <span className="font-medium text-emerald-700">Khởi tạo mới</span> với các thông tin ban
        đầu.
      </div>
    );
  }

  if (actionType === "soft_delete") {
    return <div className="text-xs font-medium text-rose-600">Đã chuyển vào thùng rác.</div>;
  }

  if (actionType === "restore") {
    return (
      <div className="text-xs font-medium text-emerald-700">
        Đã khôi phục thành công từ thùng rác.
      </div>
    );
  }

  if (!changedFields || changedFields.length === 0) {
    return <div className="text-xs text-neutral-400">Không có chi tiết thay đổi.</div>;
  }

  return (
    <div className="space-y-1.5 pt-1">
      {changedFields.map((field) => {
        const label = FIELD_LABELS[field] || field;
        const oldVal = beforeData ? String(beforeData[field] ?? "—") : "—";
        const newVal = afterData ? String(afterData[field] ?? "—") : "—";

        return (
          <div key={field} className="flex flex-wrap items-center gap-1.5 text-xs text-neutral-700">
            <span className="font-medium text-neutral-900">{label}:</span>
            <span className="rounded bg-rose-50 px-1 py-0.5 text-rose-700 line-through">
              {oldVal}
            </span>
            <ArrowRight className="h-3 w-3 text-neutral-400" />
            <span className="rounded bg-emerald-50 px-1 py-0.5 font-medium text-emerald-700">
              {newVal}
            </span>
          </div>
        );
      })}
    </div>
  );
}
