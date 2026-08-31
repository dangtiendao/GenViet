import { describe, it, expect } from "vitest";
import { buildPublicTreeCacheKey } from "@/features/public-trees/cache/public-tree-cache-key";
import { CURRENT_PUBLIC_PROJECTION_VERSION } from "@/features/public-trees/privacy/public-projection-version";

describe("P30-T42: Public Cache Isolation & Cache Key Tests", () => {
  it("tạo khóa cache bắt đầu bằng tiền tố cô lập public:tree-graph:", () => {
    const key = buildPublicTreeCacheKey({
      slug: "ho-nguyen",
      publicationVersion: 1,
      centerPersonId: "person-123",
      ancestorDepth: 2,
      descendantDepth: 2,
    });

    expect(key.startsWith("public:tree-graph:ho-nguyen:")).toBe(true);
    expect(key).toContain(`proj-v${CURRENT_PUBLIC_PROJECTION_VERSION}`);
    expect(key).toContain("pub-v1");
    expect(key).toContain("c-person-123");
    expect(key).toContain("a2:d2");
    expect(key).toContain("m-PATERNAL_LINE");
  });

  it("thay đổi khóa cache khi publicationVersion thay đổi (Invalidation on publish/unpublish)", () => {
    const keyV1 = buildPublicTreeCacheKey({
      slug: "ho-nguyen",
      publicationVersion: 1,
    });

    const keyV2 = buildPublicTreeCacheKey({
      slug: "ho-nguyen",
      publicationVersion: 2,
    });

    expect(keyV1).not.toBe(keyV2);
  });

  it("thay đổi khóa cache khi traversalMode thay đổi", () => {
    const keyPaternal = buildPublicTreeCacheKey({
      slug: "ho-nguyen",
      publicationVersion: 1,
      traversalMode: "PATERNAL_LINE",
    });

    const keyAll = buildPublicTreeCacheKey({
      slug: "ho-nguyen",
      publicationVersion: 1,
      traversalMode: "ALL_DESCENDANTS",
    });

    expect(keyPaternal).not.toBe(keyAll);
  });
});
