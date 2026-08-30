import React from "react";
import Link from "next/link";
import { GitFork, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TreeEmptyState({
  treeId,
  canWrite = false,
}: {
  treeId: string;
  canWrite?: boolean;
}) {
  return (
    <div className="flex h-full min-h-[450px] w-full flex-col items-center justify-center p-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 shadow-2xs">
        <GitFork className="h-8 w-8" aria-hidden="true" />
      </div>

      <h2 className="mt-4 text-lg font-bold text-neutral-900">Cây gia phả chưa có thành viên</h2>
      <p className="mt-2 max-w-md text-sm text-neutral-500">
        Hãy bắt đầu bằng việc khởi tạo nhân vật thủy tổ hoặc một thành viên đầu tiên trong dòng họ.
      </p>

      {canWrite && (
        <div className="mt-6">
          <Button asChild className="min-h-[44px]">
            <Link href={`/trees/${treeId}/people/new`}>
              <UserPlus className="mr-2 h-4 w-4" />
              Thêm nhân vật đầu tiên
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
