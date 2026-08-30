import { describe, it, expect, beforeEach } from "vitest";
import { TreeRegionCache } from "@/features/tree-graph/cache/tree-region-cache";
import { buildTreeGraphCacheKey } from "@/features/tree-graph/cache/tree-graph-cache-key";
import { handleSelectiveCacheInvalidation } from "@/features/tree-graph/cache/tree-region-invalidation";
import type { TreeGraphDto } from "@/features/tree-graph/types/tree-graph.types";

describe("P23-T10 & P23-T11: Bộ nhớ Cache Vùng Cây & Vô hiệu hóa có chọn lọc (Tree Region Cache & Selective Invalidation)", () => {
  const userScope = "user-123";
  const treeId = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";
  const centerPersonId = "11111111-1111-4111-a111-111111111111";

  const fakeDto: TreeGraphDto = {
    schemaVersion: 1,
    treeId,
    centerPersonId,
    persons: [
      {
        id: centerPersonId,
        fullName: "Nguyễn Văn A",
        gender: "male",
        livingStatus: "living",
        birthDate: "1990-01-01",
        birthYear: 1990,
        birthDatePrecision: "exact",
        birthIsEstimated: false,
        deathDate: null,
        deathYear: null,
        deathDatePrecision: "unknown",
        deathIsEstimated: false,
        verificationStatus: "verified",
        avatarPath: null,
        isCenter: true,
      },
    ],
    parentChildRelationships: [],
    unions: [],
    unionMembers: [],
    expansion: {
      [centerPersonId]: {
        hasMoreAncestors: false,
        hasMoreDescendants: false,
        canAddFather: false,
        canAddMother: false,
        canExpandAncestors: false,
        canExpandDescendants: false,
        hasVerifiedBiologicalFather: false,
        hasVerifiedBiologicalMother: false,
      },
    },
    limits: {
      requestedAncestorDepth: 2,
      requestedDescendantDepth: 2,
      appliedAncestorDepth: 2,
      appliedDescendantDepth: 2,
      maxAncestorDepth: 5,
      maxDescendantDepth: 5,
      maxPersonsBudget: 250,
      maxRelationshipsBudget: 500,
      maxUnionsBudget: 150,
      returnedPersonCount: 1,
      returnedRelationshipCount: 0,
      returnedUnionCount: 0,
      truncated: false,
      truncatedReason: null,
    },
    truncated: false,
    warnings: [],
  };

  beforeEach(() => {
    TreeRegionCache.resetInstance();
  });

  it("lưu trữ và lấy dữ liệu thành công khi cache hit", () => {
    const cache = TreeRegionCache.getInstance();
    const key = buildTreeGraphCacheKey(userScope, {
      treeId,
      centerPersonId,
      ancestorDepth: 2,
      descendantDepth: 2,
      includeSpouses: true,
      includeUnverified: true,
    });

    expect(cache.get(key)).toBeNull();

    cache.set(key, fakeDto);
    const retrieved = cache.get(key);
    expect(retrieved).not.toBeNull();
    expect(retrieved?.centerPersonId).toBe(centerPersonId);
  });

  it("khử trùng lặp (deduplicate) các yêu cầu mạng đồng thời giống nhau", async () => {
    const cache = TreeRegionCache.getInstance();
    const key = "test-dedupe-key";
    let fetchCount = 0;

    const fetcher = async () => {
      fetchCount++;
      return fakeDto;
    };

    const [res1, res2] = await Promise.all([
      cache.deduplicate(key, fetcher),
      cache.deduplicate(key, fetcher),
    ]);

    expect(res1).toBe(fakeDto);
    expect(res2).toBe(fakeDto);
    expect(fetchCount).toBe(1); // Chỉ gọi fetcher đúng 1 lần
  });

  it("vô hiệu hóa chính xác khi có mutation nhân vật hoặc quan hệ", () => {
    const cache = TreeRegionCache.getInstance();
    const key = buildTreeGraphCacheKey(userScope, {
      treeId,
      centerPersonId,
      ancestorDepth: 2,
      descendantDepth: 2,
      includeSpouses: true,
      includeUnverified: true,
    });

    cache.set(key, fakeDto);
    expect(cache.get(key)).not.toBeNull();

    // Thực hiện selective invalidation
    handleSelectiveCacheInvalidation({
      event: "person.updated",
      treeId,
      personId: centerPersonId,
    });

    expect(cache.get(key)).toBeNull();
  });

  it("xóa toàn bộ cache người dùng khi logout", () => {
    const cache = TreeRegionCache.getInstance();
    const key1 = `tree-graph:user-A:${treeId}:${centerPersonId}:a2:d2:s1:u1:v1`;
    const key2 = `tree-graph:user-B:${treeId}:${centerPersonId}:a2:d2:s1:u1:v1`;

    cache.set(key1, fakeDto);
    cache.set(key2, fakeDto);

    cache.clearUserCache("user-A");

    expect(cache.get(key1)).toBeNull();
    expect(cache.get(key2)).not.toBeNull();
  });
});
