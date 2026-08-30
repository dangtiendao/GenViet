import { describe, it, expect } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";

describe("Feedback States Components Tests (P10-T14..T15 / AC-P10-106..113)", () => {
  it("should render empty state title, description and action", () => {
    const html = renderToStaticMarkup(
      <EmptyState
        title="Chưa có cây gia phả"
        description="Bắt đầu tạo cây đầu tiên"
        primaryAction={{ label: "Tạo cây mới" }}
      />
    );
    expect(html).toContain("Chưa có cây gia phả");
    expect(html).toContain("Bắt đầu tạo cây đầu tiên");
    expect(html).toContain("Tạo cây mới");
  });

  it("should render error state with role alert and error code", () => {
    const html = renderToStaticMarkup(
      <ErrorState title="Lỗi máy chủ" message="Không thể kết nối" errorCode="ERR_500" />
    );
    expect(html).toContain('role="alert"');
    expect(html).toContain("Lỗi máy chủ");
    expect(html).toContain("Mã lỗi: ERR_500");
  });
});
