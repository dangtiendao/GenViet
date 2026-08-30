"use client";

import * as React from "react";
import { useActionState } from "react";
import {
  updateFamilyTreeBasicsAction,
  updateFamilyTreePrivacyAction,
  setGenerationAnchorAction,
} from "../actions/family-tree.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import { DeleteFamilyTreeDialog } from "./delete-family-tree-dialog";
import { AlertCircle, Trash2, Anchor, Shield, Info } from "lucide-react";
import type { FamilyTreeSettings, TreePersonOption } from "../types/family-tree.types";

export function FamilyTreeSettingsForm({
  tree,
  people,
}: {
  tree: FamilyTreeSettings;
  people: TreePersonOption[];
}) {
  const [basicsState, basicsAction, isBasicsPending] = useActionState(
    updateFamilyTreeBasicsAction,
    null
  );
  const [privacyState, privacyAction, isPrivacyPending] = useActionState(
    updateFamilyTreePrivacyAction,
    null
  );
  const [anchorState, anchorAction, isAnchorPending] = useActionState(
    setGenerationAnchorAction,
    null
  );

  const [name, setName] = React.useState(tree.name);
  const [description, setDescription] = React.useState(tree.description || "");
  const [privacyLevel, setPrivacyLevel] = React.useState(tree.privacyLevel);
  const [anchorId, setAnchorId] = React.useState(tree.generationAnchorPersonId || "");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  // Toast notifications for success states
  React.useEffect(() => {
    if (basicsState?.success) {
      toast.success("Đã cập nhật thông tin cây gia phả thành công!");
    }
  }, [basicsState]);

  React.useEffect(() => {
    if (privacyState?.success) {
      toast.success("Đã cập nhật mức độ riêng tư thành công!");
    }
  }, [privacyState]);

  React.useEffect(() => {
    if (anchorState?.success) {
      toast.success("Đã cập nhật mốc số đời thành công!");
    }
  }, [anchorState]);

  const isOwner = tree.role === "owner";

  if (!isOwner) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
        Bạn không phải là Chủ sở hữu (Owner) của cây gia phả này nên không có quyền truy cập trang
        cài đặt.
      </div>
    );
  }

  const personOptions = [
    { value: "", label: "-- Không chọn mốc (Chưa thiết lập) --" },
    ...people.map((p) => ({
      value: p.id,
      label: `${p.fullName} ${p.birthYear ? `(sinh năm ${p.birthYear})` : ""}`,
    })),
  ];

  return (
    <div className="max-w-3xl space-y-8">
      {/* 1. THÔNG TIN CHUNG (Tên & Mô tả) */}
      <section className="rounded-xl border border-neutral-200 bg-white p-6 shadow-xs">
        <h2 className="mb-5 border-b pb-3 text-base font-bold text-neutral-900">
          1. Thông tin dòng họ
        </h2>

        {basicsState?.error && (
          <div
            role="alert"
            className="mb-4 flex items-center space-x-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-800"
          >
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />
            <span>{basicsState.error}</span>
          </div>
        )}

        <form action={basicsAction} className="space-y-4">
          <input type="hidden" name="treeId" value={tree.id} />
          <input type="hidden" name="expectedVersion" value={tree.version} />

          <div>
            <label
              htmlFor="settings-name"
              className="mb-1 block text-xs font-semibold text-neutral-800"
            >
              Tên cây gia phả <span className="text-red-500">*</span>
            </label>
            <Input
              id="settings-name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isBasicsPending}
              required
              maxLength={100}
            />
          </div>

          <div>
            <label
              htmlFor="settings-desc"
              className="mb-1 block text-xs font-semibold text-neutral-800"
            >
              Mô tả tóm tắt
            </label>
            <textarea
              id="settings-desc"
              name="description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isBasicsPending}
              maxLength={1000}
              className="flex w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              loading={isBasicsPending}
              className="min-h-[44px] bg-emerald-700 text-white hover:bg-emerald-800"
            >
              Lưu thông tin
            </Button>
          </div>
        </form>
      </section>

      {/* 2. MỐC SỐ ĐỜI (Generation Anchor Person) */}
      <section className="rounded-xl border border-neutral-200 bg-white p-6 shadow-xs">
        <div className="mb-5 flex items-center space-x-2 border-b pb-3">
          <Anchor className="h-5 w-5 text-emerald-700" aria-hidden="true" />
          <h2 className="text-base font-bold text-neutral-900">2. Mốc số đời (Đời 1)</h2>
        </div>

        {anchorState?.error && (
          <div
            role="alert"
            className="mb-4 flex items-center space-x-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-800"
          >
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />
            <span>{anchorState.error}</span>
          </div>
        )}

        <form action={anchorAction} className="space-y-4">
          <input type="hidden" name="treeId" value={tree.id} />
          <input type="hidden" name="expectedVersion" value={tree.version} />

          <p className="text-xs leading-relaxed text-neutral-500">
            Chọn một cụ Tổ/nhân vật làm mốc Đời 1 để hệ thống tự động tính toán số đời tương đối cho
            các thế hệ con cháu.
          </p>

          {people.length === 0 ? (
            <div className="flex items-center space-x-2 rounded-lg border border-dashed border-neutral-200 bg-neutral-50 p-4 text-xs text-neutral-500">
              <Info className="h-4 w-4 shrink-0 text-neutral-400" aria-hidden="true" />
              <span>
                Chưa có nhân vật nào trong cây gia phả. Tính năng chọn mốc sẽ sẵn sàng sau khi thêm
                nhân vật (Phase P12).
              </span>
            </div>
          ) : (
            <div>
              <label
                htmlFor="settings-anchor"
                className="mb-1 block text-xs font-semibold text-neutral-800"
              >
                Nhân vật mốc Đời 1
              </label>
              <Select
                id="settings-anchor"
                name="generationAnchorPersonId"
                value={anchorId}
                onChange={(e) => setAnchorId(e.target.value)}
                disabled={isAnchorPending}
                options={personOptions}
              />
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              loading={isAnchorPending}
              disabled={people.length === 0}
              className="min-h-[44px] bg-emerald-700 text-white hover:bg-emerald-800"
            >
              Lưu mốc số đời
            </Button>
          </div>
        </form>
      </section>

      {/* 3. QUYỀN RIÊNG TƯ (Privacy Level) */}
      <section className="rounded-xl border border-neutral-200 bg-white p-6 shadow-xs">
        <div className="mb-5 flex items-center space-x-2 border-b pb-3">
          <Shield className="h-5 w-5 text-emerald-700" aria-hidden="true" />
          <h2 className="text-base font-bold text-neutral-900">3. Quyền riêng tư</h2>
        </div>

        {privacyState?.error && (
          <div
            role="alert"
            className="mb-4 flex items-center space-x-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-800"
          >
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />
            <span>{privacyState.error}</span>
          </div>
        )}

        <form action={privacyAction} className="space-y-4">
          <input type="hidden" name="treeId" value={tree.id} />
          <input type="hidden" name="expectedVersion" value={tree.version} />

          <div>
            <label
              htmlFor="settings-privacy"
              className="mb-1 block text-xs font-semibold text-neutral-800"
            >
              Chế độ hiển thị
            </label>
            <Select
              id="settings-privacy"
              name="privacyLevel"
              value={privacyLevel}
              onChange={(e) => setPrivacyLevel(e.target.value as "private" | "public")}
              disabled={isPrivacyPending}
              options={[
                {
                  value: "private",
                  label: "Riêng tư (Chỉ thành viên được cấp quyền mới có thể xem)",
                },
                {
                  value: "public",
                  label: "Công khai (Bất kỳ ai cũng có thể tìm kiếm và xem cây)",
                },
              ]}
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              loading={isPrivacyPending}
              className="min-h-[44px] bg-emerald-700 text-white hover:bg-emerald-800"
            >
              Cập nhật quyền riêng tư
            </Button>
          </div>
        </form>
      </section>

      {/* 4. VÙNG THAO TÁC NGUY HIỂM (Danger Zone) */}
      <section className="rounded-xl border border-red-200 bg-red-50/40 p-6 shadow-xs">
        <h2 className="mb-3 border-b border-red-200 pb-3 text-base font-bold text-red-900">
          4. Vùng nguy hiểm
        </h2>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900">Xóa cây gia phả này</h3>
            <p className="mt-0.5 text-xs text-neutral-600">
              Cây gia phả sẽ được chuyển vào thùng rác. Dữ liệu nhân vật không bị mất và có thể khôi
              phục lại sau.
            </p>
          </div>

          <Button
            type="button"
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
            className="min-h-[44px] shrink-0 bg-red-600 text-white hover:bg-red-700"
          >
            <Trash2 className="mr-1.5 h-4 w-4" aria-hidden="true" />
            Xóa cây gia phả
          </Button>
        </div>
      </section>

      <DeleteFamilyTreeDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        treeId={tree.id}
        treeName={tree.name}
        version={tree.version}
      />
    </div>
  );
}
