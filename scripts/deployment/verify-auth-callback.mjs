#!/usr/bin/env node

/**
 * Script kiểm tra và xác minh URL Redirect Auth Callback (P24-T11)
 */

import { getAuthCallbackUrl, getAppOrigin } from "../../src/config/env.js";

function verifyAuthCallback() {
  console.log("=== XÁC MINH CẤU HÌNH SUPABASE AUTH CALLBACK URL ===");
  const origin = getAppOrigin();
  const callbackUrl = getAuthCallbackUrl("/dashboard");

  console.log(`Application Origin: ${origin}`);
  console.log(`Auth Callback Target: ${callbackUrl}`);

  // Kiểm tra tính hợp lệ
  const parsed = new URL(callbackUrl);
  if (parsed.pathname !== "/auth/callback") {
    console.error("[LỖI] Đường dẫn callback phải là /auth/callback");
    process.exit(1);
  }

  if (!parsed.searchParams.has("next")) {
    console.error("[LỖI] Callback URL phải chứa tham số next");
    process.exit(1);
  }

  console.log("[THÀNH CÔNG] Auth Callback URL được tạo chuẩn mực theo hợp đồng.");
}

verifyAuthCallback();
