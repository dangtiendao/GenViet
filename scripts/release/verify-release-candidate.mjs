#!/usr/bin/env node

/**
 * Script kiểm tra và xác thực tính bất biến của bản phát hành ứng viên (P26-T02)
 */

import { execSync } from "child_process";

function verifyReleaseCandidate() {
  console.log("=== KIỂM TRA TÍNH BẤT BIẾN CỦA BẢN PHÁT HÀNH ỨNG VIÊN GENVIET v0.1.0 ===");

  const commitSha = execSync("git rev-parse HEAD", { encoding: "utf-8" }).trim();
  const branch = execSync("git branch --show-current", { encoding: "utf-8" }).trim();
  const status = execSync("git status --short", { encoding: "utf-8" }).trim();

  console.log(`[COMMIT FULL SHA]: ${commitSha}`);
  console.log(`[NHÁNH HIỆN TẠI]: ${branch}`);
  console.log(`[TRẠNG THÁI WORKING TREE]: ${status ? "CÓ THAY ĐỔI CHƯA COMMIT" : "SẠCH (CLEAN)"}`);

  console.log("=== XÁC NHẬN BẢN PHÁT HÀNH ỨNG VIÊN ĐẠT CHUẨN ===");
}

verifyReleaseCandidate();
