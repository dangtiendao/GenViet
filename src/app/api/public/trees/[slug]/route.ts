import { NextRequest, NextResponse } from "next/server";
import { getPublicTreeSummary } from "@/features/public-trees/services/get-public-tree";
import {
  PublicTreeError,
  PUBLIC_TREE_ERROR_CODES,
} from "@/features/public-trees/errors/public-tree.errors";

export const dynamic = "force-dynamic";

const PUBLIC_CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
};

export async function GET(_request: NextRequest, props: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await props.params;
    const tree = await getPublicTreeSummary(slug);

    return NextResponse.json(
      {
        success: true,
        data: tree,
      },
      {
        status: 200,
        headers: PUBLIC_CACHE_HEADERS,
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
          message: "Cây gia phả công khai không tồn tại hoặc đã được chuyển sang chế độ riêng tư.",
        },
      },
      {
        status: 404,
        headers: { "Cache-Control": "no-store" },
      }
    );
  }
}
