#!/usr/bin/env node

/**
 * Script kiểm tra các thành phần PWA trên môi trường triển khai (P24-T12)
 */

import fs from "fs";
import path from "path";

function verifyPwaAssets() {
  console.log("=== KIỂM TRA TỆP TÀI NGUYÊN PWA GENVIET ===");
  const publicDir = path.resolve(process.cwd(), "public");

  const requiredFiles = [
    "manifest.webmanifest",
    "sw.js",
    "icons/icon-192x192.png",
    "icons/icon-512x512.png",
    "icons/maskable-icon-512x512.png",
    "icons/apple-touch-icon.png",
  ];

  let missing = 0;
  for (const relPath of requiredFiles) {
    const fullPath = path.join(publicDir, relPath);
    if (fs.existsSync(fullPath)) {
      console.log(`[OK] Tìm thấy: public/${relPath}`);
    } else {
      console.error(`[THIẾU] Không tìm thấy: public/${relPath}`);
      missing++;
    }
  }

  if (missing > 0) {
    console.error(`[THẤT BẠI] Thiếu ${missing} tệp tài nguyên PWA.`);
    process.exit(1);
  } else {
    console.log("[THÀNH CÔNG] Toàn bộ tệp Manifest, Service Worker và Icons PWA đầy đủ.");
  }
}

verifyPwaAssets();
