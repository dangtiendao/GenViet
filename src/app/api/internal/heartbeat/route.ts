import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";
import { verifyHeartbeatSecret } from "@/features/operations/heartbeat/heartbeat-auth";
import { heartbeatService } from "@/features/operations/heartbeat/heartbeat.service";
import {
  HeartbeatError,
  HEARTBEAT_ERROR_CODES,
} from "@/features/operations/heartbeat/heartbeat.errors";
import type { HeartbeatRequestPayload } from "@/features/operations/heartbeat/heartbeat.types";

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  "Content-Type": "application/json",
};

export async function POST(request: NextRequest): Promise<NextResponse> {
  const startTime = performance.now();

  try {
    // 1. Xác minh Secret Header
    const authHeader = request.headers.get("authorization");
    const customHeader = request.headers.get("x-heartbeat-secret");
    const expectedSecret =
      process.env.HEARTBEAT_SECRET ||
      env.HEARTBEAT_SECRET ||
      process.env.CRON_SECRET ||
      env.CRON_SECRET;

    const isValidSecret = await verifyHeartbeatSecret(authHeader, customHeader, expectedSecret);

    if (!isValidSecret) {
      return NextResponse.json(
        {
          ok: false,
          code: HEARTBEAT_ERROR_CODES.UNAUTHORIZED,
          message: "Yêu cầu không hợp lệ hoặc thiếu mã bí mật xác thực nhịp tim.",
        },
        { status: 401, headers: NO_CACHE_HEADERS }
      );
    }

    // 2. Phân tích Payload (nếu có, giới hạn kích thước tối đa 1KB)
    let payload: HeartbeatRequestPayload = {};
    const contentLength = request.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > 1024) {
      return NextResponse.json(
        {
          ok: false,
          code: HEARTBEAT_ERROR_CODES.PAYLOAD_INVALID,
          message: "Kích thước payload vượt quá giới hạn 1KB cho phép.",
        },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    try {
      const text = await request.text();
      if (text && text.trim().length > 0) {
        payload = JSON.parse(text);
      }
    } catch {
      // Body không phải JSON hợp lệ -> bỏ qua và dùng mặc định
      payload = {};
    }

    // 3. Thực thi ghi nhận nhịp tim
    const durationMs = performance.now() - startTime;
    const result = await heartbeatService.processHeartbeat(payload, durationMs);

    return NextResponse.json(result, { status: 200, headers: NO_CACHE_HEADERS });
  } catch (error) {
    console.error(
      "[Internal Heartbeat API] Execution error:",
      error instanceof Error ? error.message : "Unknown"
    );

    if (error instanceof HeartbeatError) {
      return NextResponse.json(
        {
          ok: false,
          code: error.code,
          message: error.message,
        },
        { status: error.httpStatus, headers: NO_CACHE_HEADERS }
      );
    }

    return NextResponse.json(
      {
        ok: false,
        code: HEARTBEAT_ERROR_CODES.WRITE_FAILED,
        message: "Lỗi nội bộ khi ghi nhận nhịp tim hệ thống.",
      },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    {
      ok: false,
      code: HEARTBEAT_ERROR_CODES.METHOD_NOT_ALLOWED,
      message: "Phương thức GET không được hỗ trợ. Chỉ chấp nhận phương thức POST.",
    },
    { status: 405, headers: NO_CACHE_HEADERS }
  );
}

export async function PUT(): Promise<NextResponse> {
  return GET();
}

export async function DELETE(): Promise<NextResponse> {
  return GET();
}

export async function PATCH(): Promise<NextResponse> {
  return GET();
}
