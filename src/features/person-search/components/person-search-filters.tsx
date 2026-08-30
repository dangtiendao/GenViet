"use client";

import React from "react";
import { Filter, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type {
  LivingStatusFilter,
  MissingInformationFilter,
  PersonSearchFilters,
} from "../types/person-search.types";

export interface PersonSearchFiltersProps {
  filters: PersonSearchFilters;
  onFilterChange: (newFilters: Partial<PersonSearchFilters>) => void;
  onResetFilters: () => void;
}

export function PersonSearchFiltersComponent({
  filters,
  onFilterChange,
  onResetFilters,
}: PersonSearchFiltersProps) {
  const hasActiveFilter = Boolean(
    filters.birthYear ||
    (filters.livingStatus && filters.livingStatus !== "all") ||
    (filters.missingInformation && filters.missingInformation !== "none")
  );

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50/70 p-3 text-xs">
      <div className="flex items-center gap-1.5 font-semibold text-neutral-700">
        <Filter className="h-4 w-4 text-emerald-700" aria-hidden="true" />
        <span>Bộ lọc:</span>
      </div>

      {/* 1. Lọc Trạng thái sống */}
      <div className="flex items-center gap-1">
        <label htmlFor="filter-living-status" className="font-medium text-neutral-500">
          Trạng thái:
        </label>
        <select
          id="filter-living-status"
          value={filters.livingStatus || "all"}
          onChange={(e) =>
            onFilterChange({
              livingStatus: e.target.value as LivingStatusFilter,
            })
          }
          className="h-8 rounded-lg border border-neutral-300 bg-white px-2.5 text-xs text-neutral-800 focus:border-emerald-500 focus:outline-hidden"
        >
          <option value="all">Tất cả</option>
          <option value="living">Còn sống</option>
          <option value="deceased">Đã mất</option>
          <option value="unknown">Chưa rõ</option>
        </select>
      </div>

      {/* 2. Lọc Năm sinh */}
      <div className="flex items-center gap-1">
        <label htmlFor="filter-birth-year" className="font-medium text-neutral-500">
          Năm sinh:
        </label>
        <Input
          id="filter-birth-year"
          type="number"
          min={100}
          max={2500}
          placeholder="VD: 1980"
          value={filters.birthYear ?? ""}
          onChange={(e) => {
            const val = e.target.value ? parseInt(e.target.value, 10) : null;
            onFilterChange({ birthYear: val });
          }}
          className="h-8 w-24 px-2 text-xs"
        />
      </div>

      {/* 3. Lọc Thông tin thiếu */}
      <div className="flex items-center gap-1">
        <label htmlFor="filter-missing-info" className="font-medium text-neutral-500">
          Hồ sơ thiếu:
        </label>
        <select
          id="filter-missing-info"
          value={filters.missingInformation || "none"}
          onChange={(e) =>
            onFilterChange({
              missingInformation: e.target.value as MissingInformationFilter,
            })
          }
          className="h-8 rounded-lg border border-neutral-300 bg-white px-2.5 text-xs text-neutral-800 focus:border-emerald-500 focus:outline-hidden"
        >
          <option value="none">Không lọc</option>
          <option value="missing_birth">Thiếu năm sinh</option>
          <option value="missing_death_for_deceased">Đã mất thiếu năm mất</option>
          <option value="missing_hometown">Thiếu quê quán</option>
          <option value="missing_any_core">Thiếu thông tin cốt lõi</option>
        </select>
      </div>

      {/* Nút xóa bộ lọc */}
      {hasActiveFilter && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onResetFilters}
          className="ml-auto h-8 text-xs text-neutral-600 hover:text-neutral-900"
        >
          <RotateCcw className="mr-1 h-3.5 w-3.5" />
          Đặt lại bộ lọc
        </Button>
      )}
    </div>
  );
}
