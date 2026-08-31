import { describe, it, expect } from "vitest";
import {
  redactLivingPerson,
  type RawPersonEntity,
} from "@/features/public-trees/privacy/living-person-redaction";
import type { PublicGraphDto } from "@/features/public-trees/contracts/public-graph.dto";

function generateSyntheticPublicTree(nodeCount: number): PublicGraphDto {
  const persons: any[] = [];
  const parentChildRelationships: any[] = [];

  for (let i = 0; i < nodeCount; i++) {
    const raw: RawPersonEntity = {
      id: `p-${i}`,
      fullName: `Nhân vật Thử nghiệm ${i}`,
      gender: i % 2 === 0 ? "male" : "female",
      livingStatus: i < nodeCount * 0.7 ? "living" : "deceased",
      birthYear: 1950 + (i % 50),
      deathYear: i >= nodeCount * 0.7 ? 2020 : null,
      birthIsEstimated: false,
      deathIsEstimated: false,
    };
    persons.push(redactLivingPerson(raw, "REDACTED"));

    if (i > 0) {
      const parentId = `p-${Math.floor((i - 1) / 2)}`;
      parentChildRelationships.push({
        id: `rel-${i}`,
        parentId,
        childId: `p-${i}`,
        parentRole: "father",
        relationshipKind: "biological",
        verificationStatus: "verified",
      });
    }
  }

  return {
    schemaVersion: 1,
    tree: {
      id: "tree-scale-test",
      slug: "scale-test-tree",
      name: "Cây Thử Nghiệm Quy Mô",
      publicationVersion: 1,
      privacyProjectionVersion: 1,
    },
    centerPersonId: "p-0",
    persons,
    parentChildRelationships,
    unions: [],
    unionMembers: [],
    expansion: {},
    limits: {
      maxAncestorDepth: 5,
      maxDescendantDepth: 5,
      returnedPersonCount: nodeCount,
      traversalMode: "PATERNAL_LINE",
      truncated: false,
    },
  };
}

describe("P30-T52, AC-P30-153..155: Public Graph Scale Benchmarks (100, 500, 1.000 Persons)", () => {
  it("P30-T52-1: 100-Person Public Projection hoàn tất dưới 50ms", () => {
    const start = performance.now();
    const graph = generateSyntheticPublicTree(100);
    const duration = performance.now() - start;

    expect(graph.persons.length).toBe(100);
    expect(duration).toBeLessThan(50);
  });

  it("P30-T52-2: 500-Person Public Projection hoàn tất dưới 100ms", () => {
    const start = performance.now();
    const graph = generateSyntheticPublicTree(500);
    const duration = performance.now() - start;

    expect(graph.persons.length).toBe(500);
    expect(duration).toBeLessThan(100);
  });

  it("P30-T52-3: 1.000-Person Public Projection hoàn tất dưới 200ms", () => {
    const start = performance.now();
    const graph = generateSyntheticPublicTree(1000);
    const duration = performance.now() - start;

    expect(graph.persons.length).toBe(1000);
    expect(duration).toBeLessThan(200);
  });
});
