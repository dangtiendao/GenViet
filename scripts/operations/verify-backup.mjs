#!/usr/bin/env node

/**
 * Script kiểm tra tính toàn vẹn của tệp sao lưu so với Manifest (P25-T10)
 */

import fs from "fs";
import path from "path";
import crypto from "crypto";

const BACKUP_DIR = path.resolve(process.cwd(), ".backups/database");

function verifyBackupIntegrity(manifestPath) {
  console.log("=== KIỂM TRA TÍNH TOÀN VẸN TỆP SAO LƯU DATABASE ===");

  if (!fs.existsSync(manifestPath)) {
    console.error(`[LỖI] Không tìm thấy tệp Manifest: ${manifestPath}`);
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
  const backupFile = path.join(path.dirname(manifestPath), `${manifest.backupId}.sql`);

  if (!fs.existsSync(backupFile)) {
    console.error(`[LỖI] Không tìm thấy tệp dữ liệu backup tương ứng: ${backupFile}`);
    process.exit(1);
  }

  const fileBuffer = fs.readFileSync(backupFile);
  const calculatedChecksum = crypto.createHash("sha256").update(fileBuffer).digest("hex");

  if (calculatedChecksum !== manifest.checksumSha256) {
    console.error("[LỖI] Mã băm SHA-256 không khớp! Tệp có dấu hiệu bị hỏng hoặc giả mạo.");
    process.exit(1);
  }

  console.log(`[OK] Backup ID: ${manifest.backupId}`);
  console.log(`[OK] Mã băm SHA-256 khớp 100%: ${calculatedChecksum}`);
  console.log("[THÀNH CÔNG] Tệp sao lưu hợp lệ và sẵn sàng phục hồi.");
}

const argManifest = process.argv[2];
if (argManifest) {
  verifyBackupIntegrity(argManifest);
} else {
  // Tìm tệp manifest gần nhất trong thư mục .backups/database
  if (fs.existsSync(BACKUP_DIR)) {
    const manifests = fs.readdirSync(BACKUP_DIR).filter((f) => f.endsWith(".manifest.json"));
    if (manifests.length > 0) {
      verifyBackupIntegrity(path.join(BACKUP_DIR, manifests[manifests.length - 1]));
    } else {
      console.log("[THÔNG BÁO] Chưa có tệp sao lưu nào trong .backups/database.");
    }
  }
}
