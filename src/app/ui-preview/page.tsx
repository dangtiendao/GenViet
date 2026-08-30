"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Dialog } from "@/components/ui/dialog";
import { Drawer } from "@/components/ui/drawer";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { toast, Toaster } from "@/components/ui/toast";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { AppBreadcrumb } from "@/components/layout/app-breadcrumb";
import { PartialDateInput, type PartialDateValue } from "@/components/forms/partial-date-input";

export default function UiPreviewPage() {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  const [dateValue, setDateValue] = React.useState<PartialDateValue>({
    precision: "exact",
    year: 1950,
    month: 5,
    day: 19,
    isEstimated: false,
  });

  return (
    <div className="mx-auto min-h-screen max-w-6xl space-y-8 overflow-x-hidden bg-neutral-50/50 p-4 sm:space-y-12 sm:p-6 md:p-10">
      <header className="border-b pb-4">
        <AppBreadcrumb
          items={[{ label: "Trang chủ", href: "/dashboard" }, { label: "UI Component Showcase" }]}
        />
        <h1 className="mt-2 text-2xl font-bold text-neutral-900">
          GenViet Design System &amp; UI Components (Phase P10)
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Trang kiểm toán trực quan các UI primitives và components dùng lại cho dự án GenViet.
        </p>
      </header>

      {/* 1. Buttons */}
      <section className="space-y-4 rounded-xl border bg-white p-6 shadow-xs">
        <h2 className="border-b pb-2 text-lg font-semibold text-neutral-900">
          1. Button Variants &amp; Sizes
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="default">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button variant="destructive">Destructive Button</Button>
          <Button variant="link">Link Button</Button>
          <Button loading>Loading...</Button>
          <Button disabled>Disabled Button</Button>
        </div>
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button size="sm">Small Size</Button>
          <Button size="default">Default Size</Button>
          <Button size="lg">Large Size</Button>
        </div>
      </section>

      {/* 2. Inputs & Select */}
      <section className="space-y-4 rounded-xl border bg-white p-6 shadow-xs">
        <h2 className="border-b pb-2 text-lg font-semibold text-neutral-900">
          2. Form Inputs &amp; Select
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-700">
              Standard Input
            </label>
            <Input placeholder="Nhập họ và tên..." />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-700">
              Input with Error
            </label>
            <Input defaultValue="Dữ liệu sai định dạng" error />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-700">
              Accessible Select
            </label>
            <Select
              options={[
                { value: "nam", label: "Nam giới" },
                { value: "nu", label: "Nữ giới" },
                { value: "khac", label: "Khác / Chưa rõ" },
              ]}
            />
          </div>
        </div>
      </section>

      {/* 3. Partial Date Input */}
      <section className="space-y-4 rounded-xl border bg-white p-6 shadow-xs">
        <h2 className="border-b pb-2 text-lg font-semibold text-neutral-900">
          3. Partial Date Input (Nghiệp vụ Phả hệ)
        </h2>
        <div className="max-w-xl">
          <PartialDateInput
            label="Ngày sinh nhân vật"
            description="Hỗ trợ nhập ngày chính xác, chỉ biết tháng/năm, chỉ biết năm hoặc chưa rõ."
            value={dateValue}
            onChange={setDateValue}
          />
          <div className="mt-3 overflow-x-auto rounded bg-neutral-100 p-3 font-mono text-xs break-all text-neutral-800">
            Serialized Value: {JSON.stringify(dateValue)}
          </div>
        </div>
      </section>

      {/* 4. Overlays: Dialog, Drawer, Bottom Sheet */}
      <section className="space-y-4 rounded-xl border bg-white p-6 shadow-xs">
        <h2 className="border-b pb-2 text-lg font-semibold text-neutral-900">
          4. Overlays &amp; Modals
        </h2>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => setIsDialogOpen(true)} variant="outline">
            Mở Dialog Modal
          </Button>
          <Button onClick={() => setIsDrawerOpen(true)} variant="outline">
            Mở Side Drawer
          </Button>
          <Button onClick={() => setIsSheetOpen(true)} variant="outline">
            Mở Mobile Bottom Sheet
          </Button>
        </div>

        <Dialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          title="Hộp thoại Xác nhận"
          description="Đây là hộp thoại Modal accessible có Focus Trap và phím Escape."
        >
          <p className="text-sm text-neutral-600">
            Nội dung trong hộp thoại được quản lý an toàn và làm nền ngoài inert.
          </p>
          <div className="mt-6 flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Hủy bỏ
            </Button>
            <Button onClick={() => setIsDialogOpen(false)}>Đồng ý</Button>
          </div>
        </Dialog>

        <Drawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          title="Bảng điều khiển cạnh (Drawer)"
          description="Bảng thông tin trượt từ cạnh phải cho màn hình Desktop / Tablet."
        >
          <p className="text-sm text-neutral-600">Nội dung chi tiết hoặc bộ lọc nâng cao.</p>
        </Drawer>

        <BottomSheet
          isOpen={isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
          title="Bảng thao tác Mobile (Bottom Sheet)"
          description="Bảng thao tác trượt từ đáy màn hình với nút đóng rõ ràng."
        >
          <div className="space-y-2">
            <Button className="w-full" variant="default" onClick={() => setIsSheetOpen(false)}>
              Hành động 1
            </Button>
            <Button className="w-full" variant="outline" onClick={() => setIsSheetOpen(false)}>
              Hành động 2
            </Button>
          </div>
        </BottomSheet>
      </section>

      {/* 5. Toasts */}
      <section className="space-y-4 rounded-xl border bg-white p-6 shadow-xs">
        <h2 className="border-b pb-2 text-lg font-semibold text-neutral-900">
          5. Toast Notifications
        </h2>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => toast.success("Đã lưu thay đổi thành công!")}>
            Toast Success
          </Button>
          <Button
            onClick={() => toast.error("Không thể kết nối máy chủ.", "Lỗi hệ thống")}
            variant="destructive"
          >
            Toast Error
          </Button>
          <Button
            onClick={() => toast.warning("Cảnh báo: Dữ liệu chưa được lưu.", "Cảnh báo")}
            variant="outline"
          >
            Toast Warning
          </Button>
          <Button
            onClick={() => toast.info("Có một bản cập nhật mới sẵn sàng.", "Thông báo")}
            variant="secondary"
          >
            Toast Info
          </Button>
        </div>
      </section>

      {/* 6. Feedback States */}
      <section className="space-y-6 rounded-xl border bg-white p-6 shadow-xs">
        <h2 className="border-b pb-2 text-lg font-semibold text-neutral-900">
          6. Empty State &amp; Error State
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <EmptyState
            title="Chưa có cây gia phả nào"
            description="Bạn chưa tạo hoặc được mời tham gia vào cây gia phả nào. Hãy bắt đầu ngay hôm nay."
            primaryAction={{
              label: "Tạo cây gia phả đầu tiên",
              onClick: () => toast.info("Tính năng tạo cây sẽ có trong Phase P11"),
            }}
          />

          <ErrorState
            title="Không thể tải dữ liệu"
            message="Đã xảy ra lỗi khi tải danh sách thành viên. Vui lòng kiểm tra lại kết nối mạng."
            errorCode="ERR_NETWORK_TIMEOUT"
            onRetry={() => toast.info("Đang thử kết nối lại...")}
          />
        </div>
      </section>

      {/* 7. Skeletons */}
      <section className="space-y-4 rounded-xl border bg-white p-6 shadow-xs">
        <h2 className="border-b pb-2 text-lg font-semibold text-neutral-900">
          7. Skeleton Loading Placeholders
        </h2>
        <div className="flex items-center space-x-4">
          <Skeleton variant="avatar" />
          <div className="max-w-sm flex-1 space-y-2">
            <Skeleton variant="line" className="h-4 w-3/4" />
            <Skeleton variant="line" className="h-3 w-1/2" />
          </div>
        </div>
      </section>

      <Toaster />
    </div>
  );
}
