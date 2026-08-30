import * as React from "react";
import { GitFork } from "lucide-react";
import { EmptyState } from "@/components/feedback/empty-state";

export function FamilyTreeEmptyState() {
  return (
    <EmptyState
      icon={<GitFork className="h-7 w-7" />}
      title="Chưa có cây gia phả nào"
      description="Bạn chưa tạo hoặc chưa được mời tham gia vào cây gia phả nào. Hãy tạo cây gia phả đầu tiên để bắt đầu kết nối các thế hệ."
      primaryAction={{
        label: "Tạo cây gia phả mới",
        href: "/trees/new",
      }}
    />
  );
}
