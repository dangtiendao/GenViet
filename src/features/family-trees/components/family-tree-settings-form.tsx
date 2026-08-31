"use client";

import * as React from "react";
import { useActionState } from "react";
import {
  updateFamilyTreeBasicsAction,
  updateFamilyTreePrivacyAction,
  setGenerationAnchorAction,
  publishFamilyTreeAction,
  unpublishFamilyTreeAction,
} from "../actions/family-tree.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import { DeleteFamilyTreeDialog } from "./delete-family-tree-dialog";
import {
  AlertCircle,
  Trash2,
  Anchor,
  Shield,
  Info,
  Globe,
  Copy,
  ExternalLink,
  Check,
} from "lucide-react";
import type { FamilyTreeSettings, TreePersonOption } from "../types/family-tree.types";
import { normalizeSlug } from "@/features/public-trees/contracts/tree-visibility";

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
    publishFamilyTreeAction,
    null
  );
  const [unpublishState, unpublishAction, isUnpublishPending] = useActionState(
    unpublishFamilyTreeAction,
    null
  );
  const [anchorState, anchorAction, isAnchorPending] = useActionState(
    setGenerationAnchorAction,
    null
  );

  const [name, setName] = React.useState(tree.name);
  const [description, setDescription] = React.useState(tree.description || "");
  const [privacyLevel, setPrivacyLevel] = React.useState(tree.privacyLevel);
  const [slug, setSlug] = React.useState(tree.publicSlug || normalizeSlug(tree.name));
  const [livingPersonPolicy, setLivingPersonPolicy] = React.useState<"REDACTED" | "STRICT">(
    tree.livingPersonPolicy || "REDACTED"
  );
  const [searchEngineVisibility, setSearchEngineVisibility] = React.useState<"NOINDEX" | "INDEX">(
    tree.searchEngineVisibility || "NOINDEX"
  );
  const [anchorId, setAnchorId] = React.useState(tree.generationAnchorPersonId || "");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  // Toast notifications for success states
  React.useEffect(() => {
    if (basicsState?.success) {
      toast.success("Đã cập nhật thông tin cây gia phả thành công!");
    }
  }, [basicsState]);

  React.useEffect(() => {
    if (privacyState?.success) {
      toast.success("Đã công khai cây gia phả thành công!");
    }
  }, [privacyState]);

  React.useEffect(() => {
    if (unpublishState?.success) {
      toast.success("Đã chuyển cây gia phả về chế độ riêng tư!");
    }
  }, [unpublishState]);

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

      {/* 3. CHẾ ĐỘ CÔNG KHAI & KHÁCH XEM (Public Guest View - P30) */}
      <section className="rounded-xl border border-neutral-200 bg-white p-6 shadow-xs">
        <div className="mb-5 flex items-center justify-between border-b pb-3">
          <div className="flex items-center space-x-2">
            <Globe className="h-5 w-5 text-emerald-700" aria-hidden="true" />
            <h2 className="text-base font-bold text-neutral-900">
              3. Chế độ công khai cho khách xem (Public Guest View)
            </h2>
          </div>
          {tree.privacyLevel === "public" && (
            <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
              Đang công khai
            </span>
          )}
        </div>

        {(privacyState?.error || unpublishState?.error) && (
          <div
            role="alert"
            className="mb-4 flex items-center space-x-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-800"
          >
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />
            <span>{privacyState?.error || unpublishState?.error}</span>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label
              htmlFor="settings-privacy"
              className="mb-1 block text-xs font-semibold text-neutral-800"
            >
              Mức độ hiển thị
            </label>
            <Select
              id="settings-privacy"
              name="privacyLevelSelect"
              value={privacyLevel}
              onChange={(e) => setPrivacyLevel(e.target.value as "private" | "public")}
              options={[
                {
                  value: "private",
                  label: "Riêng tư (Chỉ thành viên được mời mới có thể xem)",
                },
                {
                  value: "public",
                  label: "Công khai (Khách chưa đăng nhập có thể xem bản chiếu bảo vệ riêng tư)",
                },
              ]}
            />
          </div>

          {privacyLevel === "public" ? (
            <form action={privacyAction} className="space-y-4 border-t border-neutral-100 pt-2">
              <input type="hidden" name="treeId" value={tree.id} />
              <input type="hidden" name="expectedVersion" value={tree.version} />

              <div>
                <label
                  htmlFor="settings-slug"
                  className="mb-1 block text-xs font-semibold text-neutral-800"
                >
                  Đường dẫn định danh công khai (Slug) <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center rounded-md border border-neutral-300 bg-neutral-50 px-3 py-1.5 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-600">
                  <span className="font-mono text-xs text-neutral-500 select-none">
                    /public/trees/
                  </span>
                  <input
                    id="settings-slug"
                    name="slug"
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(normalizeSlug(e.target.value))}
                    placeholder="dong-ho-nguyen-van"
                    className="flex-1 border-0 bg-transparent p-0 font-mono text-xs text-neutral-900 focus:outline-none"
                  />
                </div>
                <p className="mt-1 text-[11px] text-neutral-500">
                  Chỉ chấp nhận chữ cái thường không dấu, số và dấu gạch ngang (ví dụ:{" "}
                  <code className="font-mono text-emerald-800">ho-nguyen-dai-ton</code>).
                </p>
              </div>

              <div>
                <label
                  htmlFor="settings-living-policy"
                  className="mb-1 block text-xs font-semibold text-neutral-800"
                >
                  Chính sách bảo vệ thông tin người còn sống
                </label>
                <Select
                  id="settings-living-policy"
                  name="livingPersonPolicy"
                  value={livingPersonPolicy}
                  onChange={(e) => setLivingPersonPolicy(e.target.value as "REDACTED" | "STRICT")}
                  options={[
                    {
                      value: "REDACTED",
                      label:
                        "Rút gọn thông tin (Hiển thị tên, năm sinh; ẩn ngày sinh đầy đủ, nơi sinh, liên hệ, tiểu sử)",
                    },
                    {
                      value: "STRICT",
                      label: "Ẩn tuyệt đối (Hiển thị 'Thành viên gia đình', ẩn cả năm sinh)",
                    },
                  ]}
                />
              </div>

              <div>
                <label
                  htmlFor="settings-seo"
                  className="mb-1 block text-xs font-semibold text-neutral-800"
                >
                  Hiển thị trên công cụ tìm kiếm (Google, Bing)
                </label>
                <Select
                  id="settings-seo"
                  name="searchEngineVisibility"
                  value={searchEngineVisibility}
                  onChange={(e) => setSearchEngineVisibility(e.target.value as "NOINDEX" | "INDEX")}
                  options={[
                    {
                      value: "NOINDEX",
                      label:
                        "Không lập chỉ mục (NOINDEX - Khuyên dùng để bảo vệ quyền riêng tư dòng họ)",
                    },
                    {
                      value: "INDEX",
                      label: "Cho phép công cụ tìm kiếm lập chỉ mục (INDEX)",
                    },
                  ]}
                />
              </div>

              {slug && (
                <div className="space-y-2 rounded-lg border border-emerald-200 bg-emerald-50/70 p-4">
                  <p className="text-xs font-bold text-emerald-950">
                    Đường dẫn xem trực tiếp dành cho khách:
                  </p>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      readOnly
                      value={`${typeof window !== "undefined" ? window.location.origin : ""}/public/trees/${slug}`}
                      className="flex-1 rounded-md border border-emerald-300 bg-white px-3 py-1.5 font-mono text-xs text-emerald-900"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const fullUrl = `${window.location.origin}/public/trees/${slug}`;
                        navigator.clipboard.writeText(fullUrl);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                        toast.success("Đã sao chép đường link công khai!");
                      }}
                      className="h-8 border-emerald-300 bg-white text-emerald-900 hover:bg-emerald-100"
                    >
                      {copied ? (
                        <Check className="mr-1 h-3.5 w-3.5 text-emerald-700" />
                      ) : (
                        <Copy className="mr-1 h-3.5 w-3.5" />
                      )}
                      {copied ? "Đã chép" : "Sao chép"}
                    </Button>
                    <a
                      href={`/public/trees/${slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-8 items-center justify-center rounded-md bg-emerald-700 px-3 text-xs font-semibold text-white hover:bg-emerald-800"
                    >
                      <ExternalLink className="mr-1 h-3.5 w-3.5" />
                      Mở trang khách xem
                    </a>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  loading={isPrivacyPending}
                  className="min-h-[44px] bg-emerald-700 text-white hover:bg-emerald-800"
                >
                  Lưu & Công khai cây gia phả
                </Button>
              </div>
            </form>
          ) : (
            <form action={unpublishAction} className="space-y-4 border-t border-neutral-100 pt-2">
              <input type="hidden" name="treeId" value={tree.id} />
              <input type="hidden" name="expectedVersion" value={tree.version} />
              <input type="hidden" name="currentSlug" value={tree.publicSlug || ""} />

              <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-xs text-neutral-600">
                <Shield className="mr-1.5 inline h-4 w-4 text-neutral-500" />
                Cây gia phả đang ở chế độ <strong>Riêng tư</strong>. Chỉ thành viên được mời và cấp
                quyền mới có thể xem hoặc chỉnh sửa.
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  loading={isUnpublishPending}
                  className="min-h-[44px] bg-neutral-800 text-white hover:bg-neutral-900"
                >
                  Lưu chế độ riêng tư
                </Button>
              </div>
            </form>
          )}
        </div>
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
