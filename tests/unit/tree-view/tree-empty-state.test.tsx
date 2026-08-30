import React from "react";
import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { TreeEmptyState } from "@/features/tree-view/components/tree-empty-state";

describe("TreeEmptyState Component Tests", () => {
  it("render thông báo rỗng và hướng dẫn thêm nhân vật đầu tiên khi canWrite = true", () => {
    const html = renderToStaticMarkup(<TreeEmptyState treeId="tree-test-123" canWrite={true} />);

    expect(html).toContain("Cây gia phả chưa có thành viên");
    expect(html).toContain("Hãy bắt đầu bằng việc khởi tạo nhân vật thủy tổ");
    expect(html).toContain("Thêm nhân vật đầu tiên");
    expect(html).toContain("/trees/tree-test-123/people/new");
  });

  it("không hiển thị nút thêm nhân vật khi canWrite = false (chỉ có quyền xem)", () => {
    const html = renderToStaticMarkup(<TreeEmptyState treeId="tree-test-123" canWrite={false} />);

    expect(html).toContain("Cây gia phả chưa có thành viên");
    expect(html).not.toContain("Thêm nhân vật đầu tiên");
  });
});
