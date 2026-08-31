import { NextRequest, NextResponse } from "next/server";
import { getPublicPersonProfile } from "@/features/public-trees/services/get-public-person";
import {
  PublicTreeError,
  PUBLIC_TREE_ERROR_CODES,
} from "@/features/public-trees/errors/public-tree.errors";

export const dynamic = "force-dynamic";

const PUBLIC_CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
};

export async function GET(
  _request: NextRequest,
  props: { params: Promise<{ slug: string; personId: string }> }
) {
  try {
    const { slug, personId } = await props.params;
    const person = await getPublicPersonProfile(slug, personId);

    return NextResponse.json(
      {
        success: true,
        data: person,
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
          code: PUBLIC_TREE_ERROR_CODES.PERSON_NOT_AVAILABLE,
          message: "Thông tin nhân vật này không khả dụng.",
        },
      },
      {
        status: 404,
        headers: { "Cache-Control": "no-store" },
      }
    );
  }
}
