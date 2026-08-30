"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { PartialDateInput, type PartialDateValue } from "@/components/forms/partial-date-input";
import type { GenderType, LivingStatusType, VerificationStatusType } from "../types/person.types";

export interface PersonFormData {
  fullName: string;
  gender: GenderType;
  livingStatus: LivingStatusType;
  birthDateValue: PartialDateValue;
  deathDateValue: PartialDateValue;
  birthPlaceText: string;
  deathPlaceText: string;
  hometownText: string;
  burialPlaceText: string;
  occupationText: string;
  biography: string;
  verificationStatus: VerificationStatusType;
}

export interface PersonFormFieldsProps {
  data: PersonFormData;
  onChange: (updates: Partial<PersonFormData>) => void;
  disabled?: boolean;
  showFullFields?: boolean;
  errors?: Record<string, string>;
}

export function PersonFormFields({
  data,
  onChange,
  disabled = false,
  showFullFields = true,
  errors = {},
}: PersonFormFieldsProps) {
  const isLiving = data.livingStatus === "living";

  const birthDateStr =
    data.birthDateValue.precision === "exact" &&
    data.birthDateValue.year &&
    data.birthDateValue.month &&
    data.birthDateValue.day
      ? `${String(data.birthDateValue.year).padStart(4, "0")}-${String(data.birthDateValue.month).padStart(2, "0")}-${String(data.birthDateValue.day).padStart(2, "0")}`
      : "";

  const deathDateStr =
    data.deathDateValue.precision === "exact" &&
    data.deathDateValue.year &&
    data.deathDateValue.month &&
    data.deathDateValue.day
      ? `${String(data.deathDateValue.year).padStart(4, "0")}-${String(data.deathDateValue.month).padStart(2, "0")}-${String(data.deathDateValue.day).padStart(2, "0")}`
      : "";

  return (
    <div className="space-y-6">
      {/* 1. THÔNG TIN CƠ BẢN */}
      <div className="space-y-4">
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="person-full-name" className="text-sm font-semibold text-neutral-900">
              Họ và tên nhân vật <span className="text-red-500">*</span>
            </label>
            <span className="font-mono text-xs text-neutral-400">
              {data.fullName.trim().length}/100
            </span>
          </div>
          <Input
            id="person-full-name"
            name="fullName"
            placeholder="VD: Nguyễn Văn An"
            value={data.fullName}
            onChange={(e) => onChange({ fullName: e.target.value })}
            disabled={disabled}
            required
            maxLength={100}
            error={!!errors.fullName}
            aria-describedby="person-name-hint"
          />
          <p id="person-name-hint" className="mt-1 text-xs text-neutral-500">
            Họ tên đầy đủ có dấu (hệ thống sẽ tự động tạo normalized name để tra cứu).
          </p>
          {errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Giới tính */}
          <div>
            <label
              htmlFor="person-gender"
              className="mb-1 block text-xs font-semibold text-neutral-800"
            >
              Giới tính
            </label>
            <Select
              id="person-gender"
              name="gender"
              value={data.gender}
              onChange={(e) => onChange({ gender: e.target.value as GenderType })}
              disabled={disabled}
              options={[
                { value: "male", label: "Nam" },
                { value: "female", label: "Nữ" },
                { value: "other", label: "Khác" },
                { value: "unknown", label: "Chưa rõ" },
              ]}
            />
          </div>

          {/* Trạng thái sống */}
          <div>
            <label
              htmlFor="person-living-status"
              className="mb-1 block text-xs font-semibold text-neutral-800"
            >
              Trạng thái sống
            </label>
            <Select
              id="person-living-status"
              name="livingStatus"
              value={data.livingStatus}
              onChange={(e) => {
                const nextStatus = e.target.value as LivingStatusType;
                onChange({
                  livingStatus: nextStatus,
                  ...(nextStatus === "living"
                    ? {
                        deathDateValue: {
                          precision: "unknown",
                          year: null,
                          month: null,
                          day: null,
                          isEstimated: false,
                        },
                      }
                    : {}),
                });
              }}
              disabled={disabled}
              options={[
                { value: "living", label: "Còn sống" },
                { value: "deceased", label: "Đã mất" },
                { value: "unknown", label: "Chưa rõ" },
              ]}
            />
          </div>
        </div>
      </div>

      {/* 2. NGÀY SINH & NGÀY MẤT */}
      <div className="space-y-4 pt-2">
        {/* Ngày sinh */}
        <PartialDateInput
          label="Thông tin ngày sinh"
          value={data.birthDateValue}
          onChange={(val) => onChange({ birthDateValue: val })}
          disabled={disabled}
          error={errors.birthDate || errors.birthYear}
          aria-describedby="birth-date-hint"
        />

        {/* Hidden inputs to pass birth date data to Server Actions */}
        <input type="hidden" name="birthPrecision" value={data.birthDateValue.precision} />
        <input type="hidden" name="birthDate" value={birthDateStr} />
        <input
          type="hidden"
          name="birthYear"
          value={data.birthDateValue.year ? String(data.birthDateValue.year) : ""}
        />
        <input
          type="hidden"
          name="birthIsEstimated"
          value={String(data.birthDateValue.isEstimated)}
        />

        {/* Ngày mất (chỉ hiển thị khi đã mất hoặc chưa rõ) */}
        {!isLiving && (
          <div className="pt-2">
            <PartialDateInput
              label="Thông tin ngày mất"
              value={data.deathDateValue}
              onChange={(val) => onChange({ deathDateValue: val })}
              disabled={disabled}
              error={errors.deathDate || errors.deathYear}
              aria-describedby="death-date-hint"
            />

            {/* Hidden inputs to pass death date data to Server Actions */}
            <input type="hidden" name="deathPrecision" value={data.deathDateValue.precision} />
            <input type="hidden" name="deathDate" value={deathDateStr} />
            <input
              type="hidden"
              name="deathYear"
              value={data.deathDateValue.year ? String(data.deathDateValue.year) : ""}
            />
            <input
              type="hidden"
              name="deathIsEstimated"
              value={String(data.deathDateValue.isEstimated)}
            />
          </div>
        )}
      </div>

      {/* 3. THÔNG TIN BỔ SUNG & TIỂU SỬ */}
      {showFullFields && (
        <div className="space-y-4 border-t border-neutral-100 pt-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="person-hometown"
                className="mb-1 block text-xs font-semibold text-neutral-800"
              >
                Quê quán / Nguyên quán
              </label>
              <Input
                id="person-hometown"
                name="hometownText"
                placeholder="VD: Xã Nam Thắng, Huyện Tiền Hải, Thái Bình"
                value={data.hometownText}
                onChange={(e) => onChange({ hometownText: e.target.value })}
                disabled={disabled}
                maxLength={255}
              />
            </div>

            <div>
              <label
                htmlFor="person-occupation"
                className="mb-1 block text-xs font-semibold text-neutral-800"
              >
                Nghề nghiệp / Chức vị
              </label>
              <Input
                id="person-occupation"
                name="occupationText"
                placeholder="VD: Giáo viên, Đỗ Tiến sĩ..."
                value={data.occupationText}
                onChange={(e) => onChange({ occupationText: e.target.value })}
                disabled={disabled}
                maxLength={255}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="person-birth-place"
                className="mb-1 block text-xs font-semibold text-neutral-800"
              >
                Nơi sinh (nếu khác quê quán)
              </label>
              <Input
                id="person-birth-place"
                name="birthPlaceText"
                placeholder="VD: Hà Nội"
                value={data.birthPlaceText}
                onChange={(e) => onChange({ birthPlaceText: e.target.value })}
                disabled={disabled}
                maxLength={255}
              />
            </div>

            {!isLiving && (
              <div>
                <label
                  htmlFor="person-burial-place"
                  className="mb-1 block text-xs font-semibold text-neutral-800"
                >
                  Nơi an táng / Mộ phần
                </label>
                <Input
                  id="person-burial-place"
                  name="burialPlaceText"
                  placeholder="VD: Nghĩa trang dòng họ..."
                  value={data.burialPlaceText}
                  onChange={(e) => onChange({ burialPlaceText: e.target.value })}
                  disabled={disabled}
                  maxLength={255}
                />
              </div>
            )}
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="person-biography" className="text-xs font-semibold text-neutral-800">
                Tiểu sử / Ghi chú phả ký
              </label>
              <span className="font-mono text-xs text-neutral-400">
                {data.biography.trim().length}/5000
              </span>
            </div>
            <textarea
              id="person-biography"
              name="biography"
              rows={4}
              placeholder="Ghi chú về công đức, tiểu sử, sự nghiệp hoặc biến cố quan trọng trong cuộc đời..."
              value={data.biography}
              onChange={(e) => onChange({ biography: e.target.value })}
              disabled={disabled}
              maxLength={5000}
              className="flex w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div>
            <label
              htmlFor="person-verification"
              className="mb-1 block text-xs font-semibold text-neutral-800"
            >
              Trạng thái xác minh tư liệu
            </label>
            <Select
              id="person-verification"
              name="verificationStatus"
              value={data.verificationStatus}
              onChange={(e) =>
                onChange({ verificationStatus: e.target.value as VerificationStatusType })
              }
              disabled={disabled}
              options={[
                { value: "unverified", label: "Chưa xác minh (Dữ liệu truyền miệng/sơ khởi)" },
                { value: "verified", label: "Đã xác minh (Có gia phả/văn bia/giấy tờ)" },
                { value: "disputed", label: "Đang tranh chấp (Tư liệu các nhánh chưa thống nhất)" },
              ]}
            />
          </div>
        </div>
      )}
    </div>
  );
}
