#!/usr/bin/env node

/**
 * Script quét kiểm tra rò rỉ secret trong source code và static chunks (P24-T06)
 */

import fs from "fs";
import path from "path";

const SENSITIVE_PATTERNS = [
  /NEXT_PUBLIC_.*SERVICE_ROLE/i,
  /NEXT_PUBLIC_.*SECRET/i,
  /NEXT_PUBLIC_.*PASSWORD/i,
  /eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.[a-zA-Z0-9_-]*c2VydmljZV9yb2xl[a-zA-Z0-9_-]*\.[a-zA-Z0-9_-]+/g, // JWT containing "service_role" in base64
];

function scanDirectory(dir, issues = []) {
  if (!fs.existsSync(dir)) return issues;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== "node_modules" && entry.name !== ".git") {
        scanDirectory(fullPath, issues);
      }
    } else if (entry.isFile() && /\.(js|ts|tsx|mjs|json)$/.test(entry.name)) {
      const content = fs.readFileSync(fullPath, "utf-8");
      for (const pattern of SENSITIVE_PATTERNS) {
        if (
          pattern.test(content) &&
          !fullPath.includes("scan-client-secrets") &&
          !fullPath.includes("service-role-exposure.test")
        ) {
          issues.push({ file: fullPath, pattern: pattern.toString() });
        }
      }
    }
  }
  return issues;
}

function runScan() {
  console.log("=== BẮT ĐẦU QUÉT BẢO MẬT KHÔNG LỘ SERVICE ROLE & SECRETS ===");
  const srcDir = path.resolve(process.cwd(), "src");
  const publicDir = path.resolve(process.cwd(), "public");

  const issues = [];
  scanDirectory(srcDir, issues);
  scanDirectory(publicDir, issues);

  if (issues.length > 0) {
    console.error("[THẤT BẠI] Phát hiện nghi vấn rò rỉ secret:");
    for (const issue of issues) {
      console.error(` - File: ${issue.file}`);
    }
    process.exit(1);
  } else {
    console.log(
      "[THÀNH CÔNG] Không phát hiện thấy Service Role hoặc Secret nào bị phơi lộ trong client/source assets."
    );
  }
}

runScan();
