import { describe, it, expect } from "vitest";
import { findShortestKinshipPath } from "@/features/kinship/relationship-path/relationship-path-engine";

describe("P27-T13: Relationship Path Engine Tests", () => {
  const persons = {
    p1: { id: "p1", fullName: "Ông Tổ" },
    p2: { id: "p2", fullName: "Người Cha" },
    p3: { id: "p3", fullName: "Người Con" },
  };

  const edges = [
    { fromId: "p1", toId: "p2", type: "parent" as const },
    { fromId: "p2", toId: "p3", type: "parent" as const },
  ];

  it("tìm thấy đường quan hệ phả hệ ngắn nhất giữa Ông và Cháu", () => {
    const result = findShortestKinshipPath("p1", "p3", persons, edges);
    expect(result.found).toBe(true);
    expect(result.distance).toBe(2);
    expect(result.steps).toHaveLength(2);
    expect(result.explanation).toContain("Ông Tổ");
    expect(result.explanation).toContain("Người Con");
  });

  it("xử lý đúng khi 2 đối tượng là cùng một người", () => {
    const result = findShortestKinshipPath("p1", "p1", persons, edges);
    expect(result.found).toBe(true);
    expect(result.distance).toBe(0);
  });
});
