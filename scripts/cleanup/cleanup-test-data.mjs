#!/usr/bin/env node

/**
 * GenViet Test Data Cleanup Script (Phase P21)
 *
 * MỤC ĐÍCH:
 * - Dọn dẹp dữ liệu kiểm thử (test fixtures / e2e data) trong môi trường local / development / test.
 * - Mặc định chế độ DRY-RUN (chỉ quét và báo cáo, không xóa).
 * - Yêu cầu cờ `--execute` để thực thi xóa thật.
 * - CẤM TUYỆT ĐỐI thực thi trên môi trường production.
 * - BẢO VỆ TUYỆT ĐỐI bảng kỹ thuật `system_heartbeats` và dữ liệu người dùng thật.
 */

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { resolve } from "path";

// Nạp biến môi trường từ .env.local hoặc .env
config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

const NODE_ENV = process.env.NODE_ENV || "development";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// 1. GUARD: Chặn tuyệt đối thực thi trên production
function checkEnvironmentGuard() {
  if (NODE_ENV === "production") {
    console.error(
      "❌ [CLEANUP ABORTED] Script bị chặn: Không được phép thực thi khi NODE_ENV=production."
    );
    process.exit(1);
  }

  if (SUPABASE_URL && (SUPABASE_URL.includes("prod") || SUPABASE_URL.includes("genviet.app"))) {
    console.error(
      "❌ [CLEANUP ABORTED] Script bị chặn: URL máy chủ có dấu hiệu production:",
      SUPABASE_URL
    );
    process.exit(1);
  }

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    console.error(
      "❌ [CLEANUP ABORTED] Thiếu biến môi trường NEXT_PUBLIC_SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY."
    );
    process.exit(1);
  }
}

// 2. Parse arguments
const args = process.argv.slice(2);
const isExecuteMode = args.includes("--execute");
const isDryRun = !isExecuteMode;

const TEST_NAME_PREFIXES = [
  "[TEST]",
  "[FIXTURE]",
  "[E2E]",
  "[SEED]",
  "Test Tree",
  "Cây gia phả thử nghiệm",
];

async function main() {
  checkEnvironmentGuard();

  console.log("=================================================");
  console.log("   GenViet Test Data Cleanup Tool (Phase P21)   ");
  console.log("=================================================");
  console.log(
    `Chế độ thực thi: ${isDryRun ? "🔍 DRY-RUN (Chỉ quét, không xóa)" : "⚠️ EXECUTE (Xóa thật)"}`
  );
  console.log(`Môi trường: ${NODE_ENV}`);
  console.log(`Supabase URL: ${SUPABASE_URL}`);
  console.log("=================================================\n");

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const report = {
    scannedTrees: 0,
    eligibleTrees: 0,
    deletedUnions: 0,
    deletedRelationships: 0,
    deletedPersons: 0,
    deletedMemberships: 0,
    deletedTrees: 0,
  };

  // 1. Quét danh sách family_trees
  const { data: trees, error: treesErr } = await supabase
    .from("family_trees")
    .select("id, name, created_at");

  if (treesErr) {
    console.error("❌ Lỗi truy vấn bảng family_trees:", treesErr.message);
    process.exit(1);
  }

  report.scannedTrees = trees?.length || 0;

  // Lọc cây có tiền tố kiểm thử
  const eligibleTrees = (trees || []).filter((tree) => {
    return TEST_NAME_PREFIXES.some((prefix) =>
      tree.name.toLowerCase().startsWith(prefix.toLowerCase())
    );
  });

  report.eligibleTrees = eligibleTrees.length;

  console.log(
    `Đã quét ${report.scannedTrees} cây gia phả. Tìm thấy ${report.eligibleTrees} cây kiểm thử thỏa điều kiện dọn dẹp.\n`
  );

  if (eligibleTrees.length === 0) {
    console.log("✅ Không tìm thấy dữ liệu kiểm thử cần dọn dẹp.");
    return;
  }

  const eligibleTreeIds = eligibleTrees.map((t) => t.id);

  if (isDryRun) {
    console.log("📋 [DRY-RUN] Danh sách cây kiểm thử dự kiến xóa:");
    eligibleTrees.forEach((t) => console.log(`  - [ID: ${t.id}] ${t.name}`));
    console.log(
      "\n💡 Để thực thi xóa thật, chạy lệnh với cờ: node scripts/cleanup/cleanup-test-data.mjs --execute\n"
    );
    return;
  }

  // 2. EXECUTE: Xóa an toàn theo đúng thứ tự Foreign Key
  console.log("🚀 Bắt đầu xóa dữ liệu kiểm thử...");

  for (const treeId of eligibleTreeIds) {
    // 2.1 Xóa Union Members & Unions
    const { count: unionCount } = await supabase
      .from("unions")
      .delete({ count: "exact" })
      .eq("tree_id", treeId);
    report.deletedUnions += unionCount || 0;

    // 2.2 Xóa Parent-Child Relationships
    const { count: relCount } = await supabase
      .from("relationships")
      .delete({ count: "exact" })
      .eq("tree_id", treeId);
    report.deletedRelationships += relCount || 0;

    // 2.3 Xóa Persons
    const { count: personCount } = await supabase
      .from("persons")
      .delete({ count: "exact" })
      .eq("tree_id", treeId);
    report.deletedPersons += personCount || 0;

    // 2.4 Xóa Memberships
    const { count: memberCount } = await supabase
      .from("memberships")
      .delete({ count: "exact" })
      .eq("tree_id", treeId);
    report.deletedMemberships += memberCount || 0;

    // 2.5 Xóa Family Tree
    const { count: treeCount } = await supabase
      .from("family_trees")
      .delete({ count: "exact" })
      .eq("id", treeId);
    report.deletedTrees += treeCount || 0;
  }

  console.log("\n=================================================");
  console.log("   BÁO CÁO KẾT QUẢ DỌN DẸP DỮ LIỆU KIỂM THỬ     ");
  console.log("=================================================");
  console.log(`- Cây gia phả đã xóa:       ${report.deletedTrees}`);
  console.log(`- Thành viên memberships đã xóa: ${report.deletedMemberships}`);
  console.log(`- Nhân vật persons đã xóa:    ${report.deletedPersons}`);
  console.log(`- Quan hệ cha-con đã xóa:     ${report.deletedRelationships}`);
  console.log(`- Hôn nhân unions đã xóa:     ${report.deletedUnions}`);
  console.log(`- Bảng system_heartbeats:     BẢO TỒN NGUYÊN VẸN (KHÔNG CHẠM)`);
  console.log("=================================================\n");
  console.log("✅ Dọn dẹp hoàn tất thành công!");
}

main().catch((err) => {
  console.error("❌ Lỗi thực thi script dọn dẹp:", err);
  process.exit(1);
});
