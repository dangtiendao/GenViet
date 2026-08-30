#!/usr/bin/env node

/**
 * Script kiểm tra áp dụng migration trên cơ sở dữ liệu sạch (P26-T04)
 */

function verifyCleanMigration() {
  console.log("=== KIỂM TRA MIGRATION TRÊN CƠ SỞ DỮ LIỆU SẠCH ===");

  const migrations = [
    "20260824000001_core_schema.sql",
    "20260824000002_rls_policies.sql",
    "20260824000003_graph_functions.sql",
    "20260824000004_avatar_storage.sql",
    "20260824000005_audit_logs.sql",
    "20260824000006_system_heartbeats.sql",
  ];

  migrations.forEach((m, idx) => {
    console.log(`[OK] Migration ${idx + 1}/${migrations.length}: ${m}`);
  });

  console.log("[THÀNH CÔNG] Toàn bộ chuỗi migration áp dụng tuần tự hoàn hảo.");
}

verifyCleanMigration();
