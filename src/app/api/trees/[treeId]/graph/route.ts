import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/require-user";
import { TreeGraphService } from "@/features/tree-graph/services/tree-graph.service";
import {
  TreeGraphDomainError,
  TREE_GRAPH_ERROR_CODES,
} from "@/features/tree-graph/errors/tree-graph.errors";

export const dynamic = "force-dynamic";

const NO_CACHE_HEADERS = {
  "Cache-Control": "private, no-cache, no-store, must-revalidate",
};

export async function GET(request: NextRequest, props: { params: Promise<{ treeId: string }> }) {
  try {
    let userId: string;
    try {
      const authCtx = await requireUser();
      userId = authCtx.user.id;
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: TREE_GRAPH_ERROR_CODES.UNAUTHORIZED,
            message: "Yêu cầu đăng nhập để truy cập dữ liệu đồ thị.",
          },
        },
        {
          status: 401,
          headers: NO_CACHE_HEADERS,
        }
      );
    }

    const { treeId } = await props.params;
    const { searchParams } = new URL(request.url);

    const centerPersonId = searchParams.get("centerPersonId");
    const rawAncestorDepth = searchParams.get("ancestorDepth");
    const rawDescendantDepth = searchParams.get("descendantDepth");
    const rawIncludeSpouses = searchParams.get("includeSpouses");
    const rawIncludeUnverified = searchParams.get("includeUnverified");

    const queryInput = {
      treeId,
      centerPersonId: centerPersonId || undefined,
      ancestorDepth: rawAncestorDepth !== null ? Number(rawAncestorDepth) : undefined,
      descendantDepth: rawDescendantDepth !== null ? Number(rawDescendantDepth) : undefined,
      includeSpouses: rawIncludeSpouses !== null ? rawIncludeSpouses !== "false" : true,
      includeUnverified: rawIncludeUnverified !== null ? rawIncludeUnverified !== "false" : true,
    };

    const { data, cacheKey } = await TreeGraphService.getTreeGraphSlice(userId, queryInput);

    return NextResponse.json(
      {
        success: true,
        data,
      },
      {
        status: 200,
        headers: {
          ...NO_CACHE_HEADERS,
          "X-Graph-Cache-Key": cacheKey,
        },
      }
    );
  } catch (error) {
    if (error instanceof TreeGraphDomainError) {
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
          headers: NO_CACHE_HEADERS,
        }
      );
    }

    const err = error as Error;
    return NextResponse.json(
      {
        success: false,
        error: {
          code: TREE_GRAPH_ERROR_CODES.UNKNOWN_ERROR,
          message: err?.message || "Đã xảy ra lỗi không xác định khi tải đồ thị.",
        },
      },
      {
        status: 500,
        headers: NO_CACHE_HEADERS,
      }
    );
  }
}
