import React from "react";
import { describe, it, expect, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { PersonNode } from "@/features/tree-view/components/person-node";
import type { ReactFlowPersonNode } from "@/features/tree-view/types/tree-presentation.types";

// Mock React Flow Handles
vi.mock("@xyflow/react", () => ({
  Handle: () => <div data-testid="mock-handle" />,
  Position: {
    Top: "top",
    Bottom: "bottom",
    Left: "left",
    Right: "right",
  },
}));

describe("PersonNode Component Tests (P15-T02, P15-T19, P15-T20, P15-T26)", () => {
  const mockPerson = {
    id: "p1",
    fullName: "Nguyễn Văn Trưởng",
    gender: "male" as const,
    livingStatus: "living" as const,
    birthDate: null,
    birthYear: 1985,
    birthDatePrecision: "year" as const,
    birthIsEstimated: false,
    deathDate: null,
    deathYear: null,
    deathDatePrecision: "unknown" as const,
    deathIsEstimated: false,
    verificationStatus: "verified" as const,
    isCenter: true,
  };

  const createMockNodeProps = (overrides = {}): React.ComponentProps<typeof PersonNode> => {
    const node: ReactFlowPersonNode = {
      id: "p1",
      type: "person",
      position: { x: 0, y: 0 },
      data: {
        person: mockPerson,
        isCenter: true,
        isSelected: false,
        treeId: "t1",
        canWrite: true,
        ...overrides,
      },
    };

    return {
      id: node.id,
      data: node.data,
      selected: false,
      type: "person",
      zIndex: 1,
      isConnectable: false,
      positionAbsoluteX: 0,
      positionAbsoluteY: 0,
      dragging: false,
      deletable: false,
      selectable: true,
      draggable: false,
      parentId: undefined,
    };
  };

  it("render họ tên, năm sinh, huy hiệu Tâm điểm và trạng thái xác minh", () => {
    const props = createMockNodeProps();
    const html = renderToStaticMarkup(<PersonNode {...props} />);

    expect(html).toContain("Nguyễn Văn Trưởng");
    expect(html).toContain("Sinh 1985");
    expect(html).toContain("Xác thực");
    expect(html).toContain("Còn sống");
  });

  it("hiển thị nút mở rộng tổ tiên khi hasMoreAncestors = true", () => {
    const props = createMockNodeProps({
      expansion: {
        hasMoreAncestors: true,
        hasMoreDescendants: false,
        canAddFather: false,
        canAddMother: false,
        canExpandAncestors: true,
        canExpandDescendants: false,
        hasVerifiedBiologicalFather: true,
        hasVerifiedBiologicalMother: true,
      },
    });

    const html = renderToStaticMarkup(<PersonNode {...props} />);
    expect(html).toContain("Tải thêm tổ tiên");
    expect(html).toContain("+ Đời trước");
  });

  it("hiển thị nút mở rộng hậu duệ khi hasMoreDescendants = true và chưa có con trong slice", () => {
    const props = createMockNodeProps({
      childCount: 0,
      expansion: {
        hasMoreAncestors: false,
        hasMoreDescendants: true,
        canAddFather: false,
        canAddMother: false,
        canExpandAncestors: false,
        canExpandDescendants: true,
        hasVerifiedBiologicalFather: true,
        hasVerifiedBiologicalMother: true,
      },
    });

    const html = renderToStaticMarkup(<PersonNode {...props} />);
    expect(html).toContain("Tải thêm con cháu");
    expect(html).toContain("+ Đời sau");
  });

  it("hiển thị nút thu gọn / bung nhánh con khi childCount > 0", () => {
    const propsExpanded = createMockNodeProps({
      childCount: 3,
      isCollapsed: false,
    });
    const htmlExpanded = renderToStaticMarkup(<PersonNode {...propsExpanded} />);
    expect(htmlExpanded).toContain("Thu gọn nhánh con");
    expect(htmlExpanded).toContain("3 con");

    const propsCollapsed = createMockNodeProps({
      childCount: 3,
      isCollapsed: true,
    });
    const htmlCollapsed = renderToStaticMarkup(<PersonNode {...propsCollapsed} />);
    expect(htmlCollapsed).toContain("Hiện lại nhánh con");
    expect(htmlCollapsed).toContain("+3 con");
  });
});
