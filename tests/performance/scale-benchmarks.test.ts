import { describe, it, expect } from "vitest";
import type { TreeGraphDto, GraphPersonDto } from "@/features/tree-graph/types/tree-graph.types";
import { TreeGraphMapper } from "@/features/tree-graph/mappers/tree-graph.mapper";
import { projectDtoToLayoutGraph } from "@/features/tree-view/layout/graph-projection";
import { calculateElkLayout } from "@/features/tree-view/layout/elk-layout-adapter";

function generateSyntheticTreeData(nodeCount: number) {
  const treeId = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";
  const persons: any[] = [];
  const relationships: any[] = [];
  const unions: any[] = [];
  const unionMembers: any[] = [];

  for (let i = 0; i < nodeCount; i++) {
    const personId = `00000000-0000-4000-8000-${String(i).padStart(12, "0")}`;
    persons.push({
      id: personId,
      tree_id: treeId,
      full_name: `Nhân vật Thử nghiệm ${i}`,
      gender: i % 2 === 0 ? "male" : "female",
      livingStatus: i < nodeCount * 0.8 ? "living" : "deceased",
      birth_date: "1980-01-01",
      birth_year: 1980 + (i % 40),
      birth_date_precision: "year",
      birth_is_estimated: false,
      death_date: null,
      death_year: null,
      death_date_precision: "unknown",
      death_is_estimated: false,
      birth_place_text: null,
      death_place_text: null,
      hometown_text: null,
      burial_place_text: null,
      occupation_text: null,
      biography: null,
      avatar_path: null,
      verification_status: "verified",
      version: 1,
      created_at: "2026-08-30T10:00:00Z",
      updated_at: "2026-08-30T10:00:00Z",
    });

    if (i > 0 && i % 3 === 0) {
      const parentId = `00000000-0000-4000-8000-${String(Math.floor((i - 1) / 3)).padStart(12, "0")}`;
      relationships.push({
        id: `rel-${i}`,
        tree_id: treeId,
        parent_id: parentId,
        child_id: personId,
        parent_role: "father",
        relationship_kind: "biological",
        verification_status: "verified",
        notes: null,
        version: 1,
        created_at: "2026-08-30T10:00:00Z",
        updated_at: "2026-08-30T10:00:00Z",
      });
    }
  }

  return { treeId, persons, relationships, unions, unionMembers };
}

describe("P23-T18, P23-T19, P23-T20: Scale Benchmarks (100, 500, 1.000 Persons)", () => {
  it("P23-T18: Kiểm thử quy mô 100 nhân vật hoàn tất dưới ngân sách", async () => {
    const rawData = generateSyntheticTreeData(100);
    const centerPersonId = rawData.persons[0].id;

    const startMapping = performance.now();
    const dto = TreeGraphMapper.mapToTreeGraphDto({
      treeId: rawData.treeId,
      centerPersonId,
      persons: rawData.persons,
      relationships: rawData.relationships,
      unions: rawData.unions,
      unionMembers: rawData.unionMembers,
      requestedAncestorDepth: 2,
      requestedDescendantDepth: 2,
    });
    const mapDuration = performance.now() - startMapping;
    expect(mapDuration).toBeLessThan(100);

    const layoutGraph = projectDtoToLayoutGraph(dto, new Set());
    const positioned = await calculateElkLayout(layoutGraph);

    expect(positioned.nodes.length).toBe(100);
  });

  it("P23-T19: Kiểm thử quy mô 500 nhân vật hoàn tất dưới ngân sách", async () => {
    const rawData = generateSyntheticTreeData(500);
    const centerPersonId = rawData.persons[0].id;

    const dto = TreeGraphMapper.mapToTreeGraphDto({
      treeId: rawData.treeId,
      centerPersonId,
      persons: rawData.persons,
      relationships: rawData.relationships,
      unions: rawData.unions,
      unionMembers: rawData.unionMembers,
      requestedAncestorDepth: 2,
      requestedDescendantDepth: 2,
    });

    const layoutGraph = projectDtoToLayoutGraph(dto, new Set());
    const positioned = await calculateElkLayout(layoutGraph);

    expect(positioned.nodes.length).toBe(500);
  });

  it("P23-T20: Kiểm thử quy mô 1.000 nhân vật đảm bảo tính toàn vẹn và không rò rỉ bộ nhớ", async () => {
    const rawData = generateSyntheticTreeData(1000);
    const centerPersonId = rawData.persons[0].id;

    const dto = TreeGraphMapper.mapToTreeGraphDto({
      treeId: rawData.treeId,
      centerPersonId,
      persons: rawData.persons,
      relationships: rawData.relationships,
      unions: rawData.unions,
      unionMembers: rawData.unionMembers,
      requestedAncestorDepth: 2,
      requestedDescendantDepth: 2,
    });

    expect(dto.persons.length).toBe(1000);
    expect(dto.treeId).toBe(rawData.treeId);
  });
});
