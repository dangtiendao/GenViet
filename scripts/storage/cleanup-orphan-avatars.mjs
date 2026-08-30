#!/usr/bin/env node

/**
 * ==============================================================================
 * Script: cleanup-orphan-avatars.mjs
 * Phase: P17 (Avatar Storage Orphan Cleanup Utility)
 * Author: Principal Full-stack Engineer & Supabase Storage Architect
 * Usage:
 *   node scripts/storage/cleanup-orphan-avatars.mjs [--dry-run] [--force] [--safe-age-hours=24]
 * ==============================================================================
 */

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.resolve(__dirname, "../../.env.local") });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "http://127.0.0.1:54321";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error("❌ SUPABASE_SERVICE_ROLE_KEY is required to run maintenance storage cleanup.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const args = process.argv.slice(2);
const isDryRun = !args.includes("--force");
const safeAgeHoursArg = args.find((a) => a.startsWith("--safe-age-hours="));
const safeAgeHours = safeAgeHoursArg ? parseInt(safeAgeHoursArg.split("=")[1], 10) : 24;

async function runCleanup() {
  console.log("🧹 =========================================================");
  console.log("🔍 GenViet Avatar Storage Orphan Cleanup Utility");
  console.log(`⚙️ Mode: ${isDryRun ? "DRY RUN (No files will be deleted)" : "LIVE CLEANUP"}`);
  console.log(`⏱️ Safe Age Threshold: ${safeAgeHours} hours`);
  console.log("🧹 =========================================================\n");

  const cutoffDate = new Date(Date.now() - safeAgeHours * 60 * 60 * 1000).toISOString();

  // 1. Quét các bản ghi temporary hoặc replaced cũ
  const { data: orphanMetadata, error: metaErr } = await supabase
    .from("person_avatars")
    .select("id, tree_id, person_id, object_path, thumbnail_path, status, created_at")
    .or(`status.eq.temporary,status.eq.replaced,status.eq.deleted`)
    .lt("created_at", cutoffDate);

  if (metaErr) {
    console.error("❌ Lỗi truy vấn metadata:", metaErr.message);
    process.exit(1);
  }

  const candidatePaths = [];
  for (const row of orphanMetadata || []) {
    if (row.object_path) candidatePaths.push(row.object_path);
    if (row.thumbnail_path) candidatePaths.push(row.thumbnail_path);
  }

  console.log(`📊 Tìm thấy ${candidatePaths.length} tệp tin mồ côi/cũ cần dọn dẹp.`);

  if (candidatePaths.length === 0) {
    console.log("✅ Không có tệp mồ côi nào vượt quá ngưỡng an toàn. Hoàn tất!");
    return;
  }

  if (isDryRun) {
    console.log("\n📋 Danh sách tệp ứng viên (DRY RUN):");
    candidatePaths.forEach((p, idx) => console.log(`  [${idx + 1}] ${p}`));
    console.log("\n💡 Để thực thi xóa thật, chạy lệnh với cờ --force:");
    console.log("   node scripts/storage/cleanup-orphan-avatars.mjs --force\n");
    return;
  }

  // Live Cleanup: Xóa file khỏi Storage và cập nhật trạng thái
  console.log("\n🚀 Đang tiến hành xóa các tệp mồ côi...");
  const { error: delErr } = await supabase.storage.from("person-avatars").remove(candidatePaths);

  if (delErr) {
    console.error("❌ Lỗi khi xóa tệp trên Storage:", delErr.message);
  } else {
    console.log(`✅ Đã xóa thành công ${candidatePaths.length} tệp khỏi bucket person-avatars.`);
  }
}

runCleanup().catch((err) => {
  console.error("❌ Lỗi không xác định:", err);
  process.exit(1);
});
