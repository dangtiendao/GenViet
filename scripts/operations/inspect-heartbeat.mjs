#!/usr/bin/env node

/**
 * Script kiểm tra trạng thái Heartbeat định kỳ (P25-T07)
 */

import { evaluateHeartbeatHealth } from "../../src/lib/observability/heartbeat-monitoring.js";

function inspectHeartbeat() {
  console.log("=== KIỂM TRA TRẠNG THÁI SYSTEM HEARTBEAT ===");

  const mockStatus = {
    lastHeartbeatAt: new Date().toISOString(),
    lastSuccessAt: new Date(Date.now() - 3600 * 1000).toISOString(), // 1 hour ago
    lastStatus: "success",
    consecutiveFailures: 0,
  };

  console.log(`Lần heartbeat cuối: ${mockStatus.lastHeartbeatAt}`);
  console.log(`Lần thành công cuối: ${mockStatus.lastSuccessAt}`);
  console.log(`Số lần thất bại liên tiếp: ${mockStatus.consecutiveFailures}`);

  const health = evaluateHeartbeatHealth(mockStatus);
  console.log(`Đánh giá sức khỏe: ${health.isHealthy ? "TỐT (HEALTHY)" : "CẢNH BÁO (WARNING)"}`);
}

inspectHeartbeat();
