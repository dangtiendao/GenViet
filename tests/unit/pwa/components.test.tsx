import React from "react";
import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { OfflineEditingNotice } from "@/features/pwa/components/offline-editing-notice";
import { IosInstallInstructions } from "@/features/pwa/components/ios-install-instructions";

describe("PWA UI Components", () => {
  it("render OfflineEditingNotice hiển thị rõ thông báo chưa hỗ trợ chỉnh sửa offline", () => {
    const html = renderToStaticMarkup(<OfflineEditingNotice />);
    expect(html).toContain("Yêu cầu kết nối mạng:");
    expect(html).toContain("chưa hỗ trợ lưu trữ hoặc tạo hàng đợi thao tác khi ngoại tuyến");
  });

  it("render IosInstallInstructions khi mở hiển thị đầy đủ 3 bước thêm vào MH chính", () => {
    const html = renderToStaticMarkup(<IosInstallInstructions isOpen={true} onClose={() => {}} />);
    expect(html).toContain("Cài Đặt GenViet Trên iPhone / iPad");
    expect(html).toContain("Chia sẻ");
    expect(html).toContain("Thêm vào Màn hình chính");
    expect(html).toContain("Đã hiểu");
  });

  it("không render IosInstallInstructions khi isOpen là false", () => {
    const html = renderToStaticMarkup(<IosInstallInstructions isOpen={false} onClose={() => {}} />);
    expect(html).toBe("");
  });
});
