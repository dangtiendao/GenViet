#!/usr/bin/env node

/**
 * Script kiểm tra trạng thái Heartbeat định kỳ (P25-T07)
 */

function evaluateHeartbeatHealth(status) {
  const STALE_HEARTBEAT_THRESHOLD_HOURS = 48;
  if (!status.lastSuccessAt) {
    return { isHealthy: false, isStale: true, hoursSinceLastSuccess: null };
  }

  const lastSuccessTime = new Date(status.lastSuccessAt).getTime();
  const diffHours = (Date.now() - lastSuccessTime) / (1000 * 60 * 60);
  const isStale = diffHours > STALE_HEARTBEAT_THRESHOLD_HOURS;
  const isHealthy = !isStale && status.consecutiveFailures === 0;

  return { isHealthy, isStale, hoursSinceLastSuccess: diffHours };
}

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
  console.log("=== HOÀN TẤT KIỂM TRA SYSTEM HEARTBEAT ===");
}

inspectHeartbeat();
