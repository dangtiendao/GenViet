import React from "react";
import { Filter, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AuditEntityType, AuditActionType, AuditFilterQuery } from "../types/audit.types";

export interface AuditHistoryFiltersProps {
  filters: AuditFilterQuery;
  onChange: (filters: AuditFilterQuery) => void;
  onReset: () => void;
}

export function AuditHistoryFilters({ filters, onChange, onReset }: AuditHistoryFiltersProps) {
  return (
    <div className="space-y-4 rounded-xl border border-neutral-200 bg-white p-4 shadow-2xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-neutral-900">
          <Filter className="h-4 w-4 text-emerald-700" />
          <span>Bộ lọc nhật ký</span>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="h-8 text-xs text-neutral-500 hover:text-neutral-900"
        >
          <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
          Đặt lại
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Entity Type */}
        <div>
          <label htmlFor="entityType" className="mb-1 block text-xs font-medium text-neutral-700">
            Loại đối tượng
          </label>
          <select
            id="entityType"
            value={filters.entityType || ""}
            onChange={(e) =>
              onChange({
                ...filters,
                entityType: (e.target.value as AuditEntityType) || undefined,
              })
            }
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="">Tất cả đối tượng</option>
            <option value="person">Nhân vật</option>
            <option value="parent_child_relationship">Quan hệ Cha/Mẹ - Con</option>
            <option value="union">Quan hệ Hôn nhân</option>
            <option value="family_tree">Cây gia phả</option>
            <option value="person_avatar">Ảnh đại diện</option>
          </select>
        </div>

        {/* Action Type */}
        <div>
          <label htmlFor="actionType" className="mb-1 block text-xs font-medium text-neutral-700">
            Loại thao tác
          </label>
          <select
            id="actionType"
            value={filters.actionType || ""}
            onChange={(e) =>
              onChange({
                ...filters,
                actionType: (e.target.value as AuditActionType) || undefined,
              })
            }
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="">Tất cả thao tác</option>
            <option value="create">Tạo mới</option>
            <option value="update">Cập nhật</option>
            <option value="soft_delete">Xóa vào thùng rác</option>
            <option value="restore">Khôi phục</option>
            <option value="link">Liên kết</option>
            <option value="unlink">Hủy liên kết</option>
            <option value="privacy_change">Đổi quyền riêng tư</option>
          </select>
        </div>

        {/* Date From */}
        <div>
          <label htmlFor="dateFrom" className="mb-1 block text-xs font-medium text-neutral-700">
            Từ ngày
          </label>
          <input
            type="date"
            id="dateFrom"
            value={filters.dateFrom || ""}
            onChange={(e) => onChange({ ...filters, dateFrom: e.target.value || undefined })}
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        {/* Date To */}
        <div>
          <label htmlFor="dateTo" className="mb-1 block text-xs font-medium text-neutral-700">
            Đến ngày
          </label>
          <input
            type="date"
            id="dateTo"
            value={filters.dateTo || ""}
            onChange={(e) => onChange({ ...filters, dateTo: e.target.value || undefined })}
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
