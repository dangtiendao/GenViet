#!/usr/bin/env node

/**
 * Script kiểm tra tính toàn vẹn và phân tách hợp đồng biến môi trường (P24-T04, P24-T05)
 * Kiểm tra các biến bắt buộc cho Preview và Production mà không hiển thị giá trị nhạy cảm.
 */

const REQUIRED_PUBLIC_VARS = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"];

const REQUIRED_SERVER_VARS = ["SUPABASE_SERVICE_ROLE_KEY", "HEARTBEAT_SECRET"];

function checkEnvironmentContract() {
  console.log("=== KIỂM TRA HỢP ĐỒNG BIẾN MÔI TRƯỜNG GENVIET ===");
  const targetEnv = process.env.VERCEL_ENV || process.env.NODE_ENV || "development";
  console.log(`Môi trường đang kiểm tra: ${targetEnv}`);

  const missingPublic = [];
  for (const key of REQUIRED_PUBLIC_VARS) {
    if (!process.env[key]) {
      missingPublic.push(key);
    }
  }

  const missingServer = [];
  for (const key of REQUIRED_SERVER_VARS) {
    if (!process.env[key]) {
      missingServer.push(key);
    }
  }

  if (missingPublic.length > 0) {
    console.warn(`[CẢNH BÁO] Thiếu biến môi trường Client: ${missingPublic.join(", ")}`);
  } else {
    console.log("[OK] Toàn bộ biến môi trường Client bắt buộc đã được cấu hình.");
  }

  if (missingServer.length > 0) {
    console.warn(`[CẢNH BÁO] Thiếu biến môi trường Server: ${missingServer.join(", ")}`);
  } else {
    console.log("[OK] Toàn bộ biến môi trường Server bắt buộc đã được cấu hình.");
  }

  console.log("=== HOÀN TẤT KIỂM TRA HỢP ĐỒNG MÔI TRƯỜNG ===");
}

checkEnvironmentContract();
