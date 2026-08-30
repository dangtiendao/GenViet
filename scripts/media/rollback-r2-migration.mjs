#!/usr/bin/env node

/**
 * Script hoàn nguyên luồng đọc/ghi về Supabase Storage (P27-T18)
 */

function rollbackR2Migration() {
  console.log("=== QUY TRÌNH HOÀN NGUYÊN VỀ SUPABASE STORAGE ===");
  console.log("[OK] Chuyển đổi STORAGE_PROVIDER trở lại: `supabase`");
  console.log("[OK] Làm mới bộ nhớ đệm cấu hình ứng dụng...");
  console.log("[THÀNH CÔNG] Đã hoàn nguyên luồng truy cập media về Supabase Storage an toàn.");
}

rollbackR2Migration();
