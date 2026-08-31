import { NextRequest, NextResponse } from "next/server";
import { getPublicTreeGraph } from "@/features/public-trees/services/get-public-graph";
import {
  PublicTreeError,
  PUBLIC_TREE_ERROR_CODES,
} from "@/features/public-trees/errors/public-tree.errors";

export const dynamic = "force-dynamic";

const PUBLIC_CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
};

export async function GET(request: NextRequest, props: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await props.params;
    const { searchParams } = new URL(request.url);

    const centerPersonId = searchParams.get("centerPersonId");
    const rawAncestorDepth = searchParams.get("ancestorDepth");
    const rawDescendantDepth = searchParams.get("descendantDepth");
    const rawIncludeSpouses = searchParams.get("includeSpouses");
    const rawIncludeUnverified = searchParams.get("includeUnverified");
    const rawTraversalMode = searchParams.get("descendantTraversalMode");
    const rawBoundary = searchParams.get("branchBoundaryPersonId");

    const queryInput = {
      slug,
      centerPersonId: centerPersonId || undefined,
      ancestorDepth: rawAncestorDepth !== null ? Number(rawAncestorDepth) : 15,
      descendantDepth: rawDescendantDepth !== null ? Number(rawDescendantDepth) : 15,
      includeSpouses: rawIncludeSpouses !== null ? rawIncludeSpouses !== "false" : true,
      includeUnverified: rawIncludeUnverified !== null ? rawIncludeUnverified !== "false" : true,
      descendantTraversalMode: rawTraversalMode || "PATERNAL_LINE",
      branchBoundaryPersonId: rawBoundary || undefined,
    };

    const { data, cacheKey } = await getPublicTreeGraph(queryInput);

    return NextResponse.json(
      {
        success: true,
        data,
      },
      {
        status: 200,
        headers: {
          ...PUBLIC_CACHE_HEADERS,
          "X-Public-Graph-Cache-Key": cacheKey,
        },
      }
    );
  } catch (error) {
    if (error instanceof PublicTreeError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: error.code,
            message: error.message,
          },
        },
        {
          status: error.httpStatus,
          headers: { "Cache-Control": "no-store" },
        }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: PUBLIC_TREE_ERROR_CODES.NOT_AVAILABLE,
          message: "Lát cắt đồ thị không khả dụng.",
        },
      },
      {
        status: 404,
        headers: { "Cache-Control": "no-store" },
      }
    );
  }
}
