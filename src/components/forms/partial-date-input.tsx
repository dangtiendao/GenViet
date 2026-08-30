"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export type DatePrecision = "unknown" | "year" | "month" | "exact";

export interface PartialDateValue {
  precision: DatePrecision;
  year: number | null;
  month: number | null;
  day: number | null;
  isEstimated: boolean;
}

export interface PartialDateInputProps {
  label: string;
  value: PartialDateValue;
  onChange: (newValue: PartialDateValue) => void;
  disabled?: boolean;
  error?: string;
  className?: string;
  description?: string;
}

const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
  value: String(i + 1),
  label: `Tháng ${i + 1}`,
}));

const PRECISION_OPTIONS = [
  { value: "exact", label: "Biết ngày đầy đủ (Ngày / Tháng / Năm)" },
  { value: "month", label: "Chỉ biết Tháng và Năm" },
  { value: "year", label: "Chỉ biết Năm" },
  { value: "unknown", label: "Không rõ ngày tháng năm" },
];

export function PartialDateInput({
  label,
  value,
  onChange,
  disabled = false,
  error,
  className,
  description,
}: PartialDateInputProps) {
  const handlePrecisionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPrecision = e.target.value as DatePrecision;
    let nextYear = value.year;
    let nextMonth = value.month;
    let nextDay = value.day;

    if (newPrecision === "unknown") {
      nextYear = null;
      nextMonth = null;
      nextDay = null;
    } else if (newPrecision === "year") {
      nextMonth = null;
      nextDay = null;
    } else if (newPrecision === "month") {
      nextDay = null;
    }

    onChange({
      ...value,
      precision: newPrecision,
      year: nextYear,
      month: nextMonth,
      day: nextDay,
    });
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.trim();
    const parsed = raw === "" ? null : parseInt(raw, 10);
    onChange({
      ...value,
      year: isNaN(parsed as number) ? null : parsed,
    });
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const raw = e.target.value;
    const parsed = raw === "" ? null : parseInt(raw, 10);
    onChange({
      ...value,
      month: isNaN(parsed as number) ? null : parsed,
    });
  };

  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.trim();
    const parsed = raw === "" ? null : parseInt(raw, 10);
    onChange({
      ...value,
      day: isNaN(parsed as number) ? null : parsed,
    });
  };

  const handleEstimatedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...value,
      isEstimated: e.target.checked,
    });
  };

  return (
    <fieldset
      className={cn(
        "space-y-3 rounded-lg border border-neutral-200 bg-neutral-50/50 p-4",
        className
      )}
      disabled={disabled}
      aria-describedby={error ? `${label}-error` : description ? `${label}-desc` : undefined}
    >
      <legend className="px-1 text-sm font-semibold text-neutral-900">{label}</legend>

      {description && (
        <p id={`${label}-desc`} className="text-xs text-neutral-500">
          {description}
        </p>
      )}

      {/* 1. Mức độ chính xác ngày */}
      <div>
        <label
          htmlFor={`${label}-precision`}
          className="mb-1 block text-xs font-medium text-neutral-700"
        >
          Độ chính xác dữ liệu
        </label>
        <Select
          id={`${label}-precision`}
          value={value.precision}
          onChange={handlePrecisionChange}
          options={PRECISION_OPTIONS}
          disabled={disabled}
        />
      </div>

      {/* 2. Các ô nhập liệu tương ứng */}
      {value.precision !== "unknown" && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {value.precision === "exact" && (
            <div>
              <label
                htmlFor={`${label}-day`}
                className="mb-1 block text-xs font-medium text-neutral-700"
              >
                Ngày (1 - 31)
              </label>
              <Input
                id={`${label}-day`}
                type="number"
                min={1}
                max={31}
                placeholder="Ngày"
                value={value.day ?? ""}
                onChange={handleDayChange}
                disabled={disabled}
                error={!!error}
              />
            </div>
          )}

          {(value.precision === "exact" || value.precision === "month") && (
            <div>
              <label
                htmlFor={`${label}-month`}
                className="mb-1 block text-xs font-medium text-neutral-700"
              >
                Tháng
              </label>
              <Select
                id={`${label}-month`}
                value={value.month ? String(value.month) : ""}
                onChange={handleMonthChange}
                placeholder="-- Chọn tháng --"
                options={MONTH_OPTIONS}
                disabled={disabled}
                error={!!error}
              />
            </div>
          )}

          <div>
            <label
              htmlFor={`${label}-year`}
              className="mb-1 block text-xs font-medium text-neutral-700"
            >
              Năm (Dương lịch)
            </label>
            <Input
              id={`${label}-year`}
              type="number"
              min={100}
              max={2100}
              placeholder="VD: 1945"
              value={value.year ?? ""}
              onChange={handleYearChange}
              disabled={disabled}
              error={!!error}
            />
          </div>
        </div>
      )}

      {/* 3. Checkbox Ước tính */}
      {value.precision !== "unknown" && (
        <div className="flex items-center space-x-2 pt-1">
          <input
            type="checkbox"
            id={`${label}-estimated`}
            checked={value.isEstimated}
            onChange={handleEstimatedChange}
            disabled={disabled}
            className="h-4 w-4 rounded border-neutral-300 text-emerald-700 focus:ring-emerald-600"
          />
          <label htmlFor={`${label}-estimated`} className="text-xs text-neutral-700 select-none">
            Ngày/năm ước tính (chưa hoàn toàn xác thực)
          </label>
        </div>
      )}

      {error && (
        <p id={`${label}-error`} className="text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
}
