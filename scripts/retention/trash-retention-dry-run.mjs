#!/usr/bin/env node

/**
 * GenViet Trash Retention Scan Utility (Phase P18)
 *
 * Chức năng:
 *   Quét danh sách các thực thể bị xóa mềm trong thùng rác đã quá hạn lưu trữ 30 ngày (safeAgeDays = 30).
 *   Mặc định chạy ở chế độ --dry-run (chỉ thống kê, tuyệt đối không xóa dữ liệu).
 *
 * Cách chạy:
 *   node scripts/retention/trash-retention-dry-run.mjs [--dry-run]
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "http://127.0.0.1:54321";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error("[trash-retention] Error: SUPABASE_SERVICE_ROLE_KEY is required.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const SAFE_AGE_DAYS = 30;
const cutoffDate = new Date(Date.now() - SAFE_AGE_DAYS * 24 * 60 * 60 * 1000).toISOString();

async function runTrashRetentionScan() {
  console.log("=== GenViet Trash Retention Scan (Safe Age: 30 Days) ===");
  console.log(`- Mốc thời gian quá hạn (Cutoff): ${cutoffDate}`);
  console.log("- Chế độ: DRY-RUN ONLY\n");

  // 1. Quét Persons
  const { data: deletedPersons, error: personsError } = await supabase
    .from("persons")
    .select("id, tree_id, full_name, deleted_at")
    .not("deleted_at", "is", null)
    .lt("deleted_at", cutoffDate);

  if (personsError) {
    console.error("Lỗi quét persons:", personsError);
  } else {
    console.log(
      `[Persons] Tìm thấy ${deletedPersons.length} nhân vật đủ điều kiện dọn dẹp (>30 ngày):`
    );
    for (const p of deletedPersons) {
      console.log(`  - ID: ${p.id} | Tên: ${p.full_name} | Xóa lúc: ${p.deleted_at}`);
    }
  }

  // 2. Quét Relationships
  const { data: deletedRels, error: relsError } = await supabase
    .from("parent_child_relationships")
    .select("id, tree_id, parent_id, child_id, deleted_at")
    .not("deleted_at", "is", null)
    .lt("deleted_at", cutoffDate);

  if (relsError) {
    console.error("Lỗi quét relationships:", relsError);
  } else {
    console.log(
      `\n[Relationships] Tìm thấy ${deletedRels.length} quan hệ đủ điều kiện dọn dẹp (>30 ngày):`
    );
    for (const r of deletedRels) {
      console.log(
        `  - ID: ${r.id} | Parent: ${r.parent_id} -> Child: ${r.child_id} | Xóa lúc: ${r.deleted_at}`
      );
    }
  }

  console.log("\n=== Quét hoàn tất: Không có bản ghi nào bị xóa (Dry-run mode) ===");
}

runTrashRetentionScan().catch((err) => {
  console.error("Lỗi thực thi:", err);
  process.exit(1);
});
