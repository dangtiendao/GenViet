import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/require-user";
import { BackupExportService } from "@/features/backups/services/backup-export.service";
import { BackupDomainError } from "@/features/backups/errors/backup.errors";

interface RouteProps {
  params: Promise<{
    treeId: string;
  }>;
}

export async function GET(request: Request, { params }: RouteProps) {
  try {
    await requireUser();
    const { treeId } = await params;

    if (!treeId || typeof treeId !== "string") {
      return NextResponse.json(
        { error: "Tree ID không hợp lệ", code: "INVALID_TREE_ID" },
        { status: 400 }
      );
    }

    const { jsonString, filename } = await BackupExportService.generateTreeBackup(treeId);

    return new Response(jsonString, {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (err: unknown) {
    if (err instanceof BackupDomainError) {
      return NextResponse.json({ error: err.message, code: err.code }, { status: err.status });
    }

    console.error("[GET /api/trees/[treeId]/backup] Unexpected error:", err);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi tạo tệp sao lưu. Vui lòng thử lại sau.", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
