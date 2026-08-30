import React from "react";
import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { AuditDiffSummary } from "@/features/audit/components/audit-diff-summary";
import { AuditHistoryItem } from "@/features/audit/components/audit-history-item";
import { AuditEmptyState } from "@/features/audit/components/audit-empty-state";
import type { AuditLogDto } from "@/features/audit/types/audit.types";

describe("Audit UI Components", () => {
  const sampleLog: AuditLogDto = {
    id: "11111111-1111-4111-a111-111111111111",
    treeId: "22222222-2222-4222-a222-222222222222",
    actorUserId: "33333333-3333-4333-a333-333333333333",
    actorName: "Đặng Tiến Đạo",
    entityType: "person",
    entityTypeLabel: "Nhân vật",
    entityId: "44444444-4444-4444-a444-444444444444",
    actionType: "update",
    actionTypeLabel: "Cập nhật",
    beforeData: { full_name: "Nguyễn Văn Cũ" },
    afterData: { full_name: "Nguyễn Văn Mới" },
    changedFields: ["full_name"],
    reason: "Sửa họ tên",
    source: "direct_rpc",
    createdAt: "2026-08-30T09:00:00.000Z",
  };

  it("render AuditDiffSummary hiển thị giá trị cũ gạch ngang và giá trị mới", () => {
    const html = renderToStaticMarkup(<AuditDiffSummary log={sampleLog} />);
    expect(html).toContain("Nguyễn Văn Cũ");
    expect(html).toContain("Nguyễn Văn Mới");
    expect(html).toContain("Họ và tên");
  });

  it("render AuditHistoryItem hiển thị tên actor và nhãn thao tác", () => {
    const html = renderToStaticMarkup(<AuditHistoryItem log={sampleLog} />);
    expect(html).toContain("Đặng Tiến Đạo");
    expect(html).toContain("Nhân vật");
    expect(html).toContain("Cập nhật");
  });

  it("render AuditEmptyState hiển thị thông báo thân thiện", () => {
    const html = renderToStaticMarkup(<AuditEmptyState isFiltered={false} />);
    expect(html).toContain("Chưa có lịch sử biến động");
  });
});
