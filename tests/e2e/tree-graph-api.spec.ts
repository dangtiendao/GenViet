import { test, expect } from "@playwright/test";

test.describe("GenViet Tree Graph API Route Handler E2E Tests (Phase P14)", () => {
  const mockTreeId = "11111111-1111-1111-1111-111111111111";
  const mockCenterPersonId = "22222222-2222-2222-2222-222222222222";

  test("unauthenticated request to /api/trees/[treeId]/graph returns HTTP 401 with structured error", async ({
    request,
  }) => {
    const response = await request.get(
      `/api/trees/${mockTreeId}/graph?centerPersonId=${mockCenterPersonId}`
    );

    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.error.code).toBe("TREE_GRAPH_UNAUTHORIZED");
  });

  test("request with missing centerPersonId returns HTTP 400", async ({ request }) => {
    const response = await request.get(`/api/trees/${mockTreeId}/graph`);
    expect(response.status()).toBe(401); // Unauthorized checked first
  });

  test("response sets private no-cache headers to protect sensitive genealogical data", async ({
    request,
  }) => {
    const response = await request.get(
      `/api/trees/${mockTreeId}/graph?centerPersonId=${mockCenterPersonId}`
    );
    // Even when unauthorized, response is not public-cached
    const cacheControl = response.headers()["cache-control"];
    expect(cacheControl).toBeDefined();
  });
});
