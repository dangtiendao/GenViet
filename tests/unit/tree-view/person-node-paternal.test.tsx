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

describe("PersonNode Paternal Line & Hidden Descendants UI Tests (P28-T34 -> P28-T41)", () => {
  const mockFemalePerson = {
    id: "p_female_1",
    fullName: "Nguyễn Thị Con Gái",
    gender: "female" as const,
    livingStatus: "living" as const,
    birthDate: null,
    birthYear: 1990,
    birthDatePrecision: "year" as const,
    birthIsEstimated: false,
    deathDate: null,
    deathYear: null,
    deathDatePrecision: "unknown" as const,
    deathIsEstimated: false,
    verificationStatus: "verified" as const,
    isCenter: false,
  };

  const createMockNodeProps = (overrides = {}): React.ComponentProps<typeof PersonNode> => {
    const node: ReactFlowPersonNode = {
      id: "p_female_1",
      type: "person",
      position: { x: 0, y: 0 },
      data: {
        person: mockFemalePerson,
        isCenter: false,
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

  it("hiển thị node con gái bình thường với họ tên và năm sinh", () => {
    const props = createMockNodeProps();
    const html = renderToStaticMarkup(<PersonNode {...props} />);

    expect(html).toContain("Nguyễn Thị Con Gái");
    expect(html).toContain("Sinh 1990");
    expect(html).toContain("Xác thực");
  });

  it("hiển thị HiddenDescendantsIndicator khi hasHiddenDescendants = true và childCount = 0", () => {
    const props = createMockNodeProps({
      childCount: 0,
      expansion: {
        hasMoreAncestors: false,
        hasMoreDescendants: true,
        hasHiddenDescendants: true,
        descendantsTruncated: true,
        truncationReason: "PATERNAL_LINE",
        canAddFather: false,
        canAddMother: false,
        canExpandAncestors: false,
        canExpandDescendants: false,
        hasVerifiedBiologicalFather: true,
        hasVerifiedBiologicalMother: true,
      },
    });

    const html = renderToStaticMarkup(<PersonNode {...props} />);

    // Kiểm tra có badge chỉ báo
    expect(html).toContain("Có hậu duệ đang ẩn");
    // Kiểm tra accessible label
    expect(html).toContain(
      "Hậu duệ qua nhánh nữ của Nguyễn Thị Con Gái đang được ẩn theo chế độ xem mặc định"
    );
    // Tuyệt đối không hiển thị nút '+ Đời sau' khi nhánh nữ bị dừng
    expect(html).not.toContain("+ Đời sau");
  });

  it("không hiển thị HiddenDescendantsIndicator khi node nữ không có con (hasHiddenDescendants = false)", () => {
    const props = createMockNodeProps({
      childCount: 0,
      expansion: {
        hasMoreAncestors: false,
        hasMoreDescendants: false,
        hasHiddenDescendants: false,
        descendantsTruncated: false,
        truncationReason: null,
        canAddFather: false,
        canAddMother: false,
        canExpandAncestors: false,
        canExpandDescendants: false,
        hasVerifiedBiologicalFather: true,
        hasVerifiedBiologicalMother: true,
      },
    });

    const html = renderToStaticMarkup(<PersonNode {...props} />);

    expect(html).not.toContain("Có hậu duệ đang ẩn");
    expect(html).not.toContain("+ Đời sau");
  });
});
