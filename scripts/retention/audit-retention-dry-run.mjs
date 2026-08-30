#!/usr/bin/env node

/**
 * GenViet Audit Log Retention Scan Utility (Phase P18)
 *
 * Chức năng:
 *   Thống kê số lượng bản ghi và dung lượng audit_logs.
 *   Theo chính sách MVP v0.1: Audit log được lưu trữ bất biến và không tự động xóa.
 *
 * Cách chạy:
 *   node scripts/retention/audit-retention-dry-run.mjs
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "http://127.0.0.1:54321";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error("[audit-retention] Error: SUPABASE_SERVICE_ROLE_KEY is required.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

async function runAuditRetentionScan() {
  console.log("=== GenViet Audit Log Retention Report (MVP Policy: Retain All) ===");

  const { count, error } = await supabase
    .from("audit_logs")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("Lỗi truy vấn audit_logs:", error);
    process.exit(1);
  }

  console.log(`- Tổng số bản ghi audit logs hiện tại: ${count || 0}`);
  console.log("- Chính sách: BẢO TỒN BẤT BIẾN (Không xóa tự động trong MVP)\n");
}

runAuditRetentionScan().catch((err) => {
  console.error("Lỗi thực thi:", err);
  process.exit(1);
});
