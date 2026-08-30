"use client";

import * as React from "react";
import Link from "next/link";
import { useActionState } from "react";
import { createFamilyTreeAction } from "../actions/family-tree.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { AlertCircle } from "lucide-react";

export function FamilyTreeForm() {
  const [state, formAction, isPending] = useActionState(createFamilyTreeAction, null);
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [clientError, setClientError] = React.useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const trimmed = name.trim();
    if (!trimmed) {
      e.preventDefault();
      setClientError("Tên cây gia phả không được để trống.");
      return;
    }
    if (trimmed.length > 100) {
      e.preventDefault();
      setClientError("Tên cây gia phả không được vượt quá 100 ký tự.");
      return;
    }
    setClientError(null);
  };

  const errorMessage = clientError || state?.error;

  return (
    <form action={formAction} onSubmit={handleSubmit} className="max-w-xl space-y-6">
      {errorMessage && (
        <div
          role="alert"
          className="flex items-center space-x-2 rounded-lg border border-red-200 bg-red-50 p-4 text-xs text-red-800 sm:text-sm"
        >
          <AlertCircle className="h-5 w-5 shrink-0 text-red-600" aria-hidden="true" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 1. Tên cây gia phả */}
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label htmlFor="tree-name" className="text-sm font-semibold text-neutral-900">
            Tên cây gia phả <span className="text-red-500">*</span>
          </label>
          <span className="font-mono text-xs text-neutral-400">{name.trim().length}/100</span>
        </div>
        <Input
          id="tree-name"
          name="name"
          placeholder="VD: Gia phả Họ Nguyễn Đại Tộc"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (clientError) setClientError(null);
          }}
          disabled={isPending}
          required
          maxLength={100}
          error={!!errorMessage}
          aria-describedby="tree-name-hint"
        />
        <p id="tree-name-hint" className="mt-1 text-xs text-neutral-500">
          Tên đại diện dòng họ, chi nhánh hoặc gia đình (hỗ trợ đầy đủ tiếng Việt).
        </p>
      </div>

      {/* 2. Mô tả */}
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label htmlFor="tree-desc" className="text-sm font-semibold text-neutral-900">
            Mô tả tóm tắt (tùy chọn)
          </label>
          <span className="font-mono text-xs text-neutral-400">
            {description.trim().length}/1000
          </span>
        </div>
        <textarea
          id="tree-desc"
          name="description"
          rows={3}
          placeholder="VD: Chi nhánh gốc tại Nam Định, di cư vào miền Nam năm 1954..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isPending}
          maxLength={1000}
          className="flex w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-base text-neutral-900 placeholder:text-neutral-400 focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
        />
      </div>

      {/* 3. Mức độ riêng tư */}
      <div>
        <label
          htmlFor="tree-privacy"
          className="mb-1.5 block text-sm font-semibold text-neutral-900"
        >
          Mức độ riêng tư
        </label>
        <Select
          id="tree-privacy"
          name="privacyLevel"
          defaultValue="private"
          disabled={isPending}
          options={[
            {
              value: "private",
              label: "Riêng tư (Chỉ thành viên được mời mới có quyền xem)",
            },
            {
              value: "public",
              label: "Công khai (Mọi người có thể tìm kiếm và xem cây)",
            },
          ]}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-end gap-3 border-t pt-4">
        <Button asChild variant="outline" disabled={isPending}>
          <Link href="/trees">Hủy bỏ</Link>
        </Button>

        <Button
          type="submit"
          loading={isPending}
          className="min-w-[120px] bg-emerald-700 text-white hover:bg-emerald-800"
        >
          {isPending ? "Đang tạo..." : "Tạo gia phả"}
        </Button>
      </div>
    </form>
  );
}
