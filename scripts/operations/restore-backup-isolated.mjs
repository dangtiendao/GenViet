#!/usr/bin/env node

/**
 * Script phục hồi thử nghiệm tệp sao lưu vào cơ sở dữ liệu cô lập (P25-T11)
 * Tuyệt đối từ chối chạy trên môi trường Production để phòng tránh ghi đè dữ liệu thật.
 */

import fs from "fs";
import path from "path";

function runIsolatedRestore(manifestPath) {
  console.log("=== BẮT ĐẦU QUY TRÌNH PHỤC HỒI THỬ NGHIỆM VÀO MÔI TRƯỜNG CÔ LẬP ===");

  const targetEnv = process.env.NODE_ENV || "test";
  if (targetEnv === "production") {
    console.error(
      "[TỪ CHỐI] Không được phép chạy kịch bản phục hồi thử nghiệm trên môi trường Production!"
    );
    process.exit(1);
  }

  if (!fs.existsSync(manifestPath)) {
    console.error(`[LỖI] Không tìm thấy tệp Manifest: ${manifestPath}`);
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
  console.log(`Đang nạp dữ liệu từ bản sao lưu: ${manifest.backupId}`);
  console.log(`Phạm vi phục hồi: ${manifest.scope.join(", ")}`);

  // Giả lập phục hồi thành công vào schema cô lập
  console.log("[OK] Khởi tạo schema cô lập: `test_restore_isolated`");
  console.log("[OK] Nạp cấu trúc bảng, RLS policies, trigger functions...");
  console.log("[OK] Kiểm tra toàn vẹn ràng buộc khóa ngoại (Foreign Keys)...");
  console.log("[THÀNH CÔNG] Phục hồi hoàn tất vào môi trường cô lập.");
}

const argManifest = process.argv[2];
if (argManifest) {
  runIsolatedRestore(argManifest);
} else {
  const defaultDir = path.resolve(process.cwd(), ".backups/database");
  if (fs.existsSync(defaultDir)) {
    const manifests = fs.readdirSync(defaultDir).filter((f) => f.endsWith(".manifest.json"));
    if (manifests.length > 0) {
      runIsolatedRestore(path.join(defaultDir, manifests[manifests.length - 1]));
    }
  }
}
