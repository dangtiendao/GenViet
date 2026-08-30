#!/usr/bin/env node

/**
 * Script kiểm tra nhanh (Smoke Test) môi trường Production/Preview (P24-T13)
 * Tuyệt đối phi phá hủy (Read-only), an toàn 100% với dữ liệu người dùng.
 */

import https from "https";
import http from "http";

async function fetchRoute(url) {
  return new Promise((resolve) => {
    const client = url.startsWith("https") ? https : http;
    const req = client.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve({ status: res.statusCode, data }));
    });

    req.on("error", (err) => resolve({ status: 0, error: err.message }));
    req.setTimeout(8000, () => {
      req.destroy();
      resolve({ status: 408, error: "Timeout" });
    });
  });
}

async function runProductionSmoke(
  baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
) {
  console.log(`=== BẮT ĐẦU SMOKE TEST PRODUCTION: ${baseUrl} ===`);

  const tests = [
    { name: "Health Check API", path: "/api/health", expectStatus: 200 },
    { name: "Web App Manifest", path: "/manifest.webmanifest", expectStatus: 200 },
    { name: "Service Worker File", path: "/sw.js", expectStatus: 200 },
    { name: "Offline Fallback Page", path: "/offline", expectStatus: 200 },
    { name: "Login Page", path: "/login", expectStatus: 200 },
    { name: "Sign Up Page", path: "/sign-up", expectStatus: 200 },
  ];

  let passed = 0;
  for (const t of tests) {
    const fullUrl = `${baseUrl.replace(/\/+$/, "")}${t.path}`;
    const res = await fetchRoute(fullUrl);
    if (res.status === t.expectStatus) {
      console.log(`[PASS] ${t.name} (${t.path}) -> HTTP ${res.status}`);
      passed++;
    } else {
      console.warn(
        `[WARN] ${t.name} (${t.path}) -> HTTP ${res.status} (Kỳ vọng: ${t.expectStatus}) - ${res.error || ""}`
      );
    }
  }

  console.log(`=== KẾT QUẢ SMOKE TEST: ${passed}/${tests.length} KIỂM TRA ĐẠT ===`);
}

const targetUrl = process.argv[2];
runProductionSmoke(targetUrl);
