import { describe, it, expect } from "vitest";
import {
  buildTreeGraphCacheKey,
  TREE_GRAPH_SCHEMA_VERSION,
  TREE_GRAPH_INVALIDATION_EVENTS,
} from "@/features/tree-graph/cache/tree-graph-cache-key";

describe("TreeGraph Cache Key Builder Tests (P14-T15)", () => {
  const treeId = "11111111-1111-1111-1111-111111111111";
  const centerPersonId = "22222222-2222-2222-2222-222222222222";
  const userScope = "u_owner_123";

  it("sinh cache key tất định với cùng một tập tham số", () => {
    const key1 = buildTreeGraphCacheKey(userScope, {
      treeId,
      centerPersonId,
      ancestorDepth: 2,
      descendantDepth: 2,
      includeSpouses: true,
      includeUnverified: true,
    });

    const key2 = buildTreeGraphCacheKey(userScope, {
      treeId,
      centerPersonId,
      ancestorDepth: 2,
      descendantDepth: 2,
      includeSpouses: true,
      includeUnverified: true,
    });

    expect(key1).toBe(key2);
    expect(key1).toBe(
      `tree-graph:${userScope}:${treeId}:${centerPersonId}:a2:d2:s1:u1:v${TREE_GRAPH_SCHEMA_VERSION}`
    );
  });

  it("thay đổi cache key khi thay đổi độ sâu hoặc tùy chọn includeSpouses", () => {
    const keyA = buildTreeGraphCacheKey(userScope, {
      treeId,
      centerPersonId,
      ancestorDepth: 2,
      descendantDepth: 2,
      includeSpouses: true,
      includeUnverified: true,
    });

    const keyB = buildTreeGraphCacheKey(userScope, {
      treeId,
      centerPersonId,
      ancestorDepth: 3,
      descendantDepth: 2,
      includeSpouses: true,
      includeUnverified: true,
    });

    const keyC = buildTreeGraphCacheKey(userScope, {
      treeId,
      centerPersonId,
      ancestorDepth: 2,
      descendantDepth: 2,
      includeSpouses: false,
      includeUnverified: true,
    });

    expect(keyA).not.toBe(keyB);
    expect(keyA).not.toBe(keyC);
  });

  it("phân lập cache key giữa các userScope khác nhau", () => {
    const keyUser1 = buildTreeGraphCacheKey("user_1", {
      treeId,
      centerPersonId,
      ancestorDepth: 2,
      descendantDepth: 2,
      includeSpouses: true,
      includeUnverified: true,
    });

    const keyUser2 = buildTreeGraphCacheKey("user_2", {
      treeId,
      centerPersonId,
      ancestorDepth: 2,
      descendantDepth: 2,
      includeSpouses: true,
      includeUnverified: true,
    });

    expect(keyUser1).not.toBe(keyUser2);
  });

  it("chứa đầy đủ danh mục sự kiện invalidation matrix", () => {
    expect(TREE_GRAPH_INVALIDATION_EVENTS).toContain("person.created");
    expect(TREE_GRAPH_INVALIDATION_EVENTS).toContain("relationship.created");
    expect(TREE_GRAPH_INVALIDATION_EVENTS).toContain("union.created");
    expect(TREE_GRAPH_INVALIDATION_EVENTS).toContain("tree.soft_deleted");
  });
});
