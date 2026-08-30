import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const migrationsDir = path.resolve(__dirname, "../../supabase/migrations");
const outputFile = path.resolve(__dirname, "../../supabase/full_schema.sql");

if (!fs.existsSync(migrationsDir)) {
  console.error("❌ Thư mục migrations không tồn tại:", migrationsDir);
  process.exit(1);
}

const files = fs
  .readdirSync(migrationsDir)
  .filter((f) => f.endsWith(".sql"))
  .sort();

if (files.length === 0) {
  console.error("❌ Không tìm thấy migration SQL nào trong thư mục migrations.");
  process.exit(1);
}

console.log(`📦 Đang gom ${files.length} file migration SQL thành file triển khai duy nhất...`);

let combinedContent = "";

// Header
combinedContent +=
  "-- ==============================================================================\n";
combinedContent += "-- PROJECT: GenViet - Responsive Web App Quản Lý Cây Gia Phả\n";
combinedContent += "-- FILE: supabase/full_schema.sql\n";
combinedContent +=
  "-- MỤC ĐÍCH: Hợp nhất toàn bộ các file migration SQL để triển khai 1 lần duy nhất.\n";
combinedContent +=
  "-- GHI CHÚ: File này được tổng hợp tuần tự từ tất cả migration trong supabase/migrations/.\n";
combinedContent +=
  "--          Các file migration gốc vẫn được giữ nguyên đầy đủ để quản lý theo version.\n";
combinedContent += `-- TỔNG SỐ MIGRATION: ${files.length}\n`;
combinedContent +=
  "-- ==============================================================================\n\n";

combinedContent +=
  "-- ==============================================================================\n";
combinedContent += "-- DANH SÁCH CÁC MIGRATION ĐƯỢC HỢP NHẤT (THEO THỨ TỰ THỜI GIAN):\n";
files.forEach((file, idx) => {
  combinedContent += `--   ${String(idx + 1).padStart(2, "0")}. ${file}\n`;
});
combinedContent +=
  "-- ==============================================================================\n\n";

// Body
files.forEach((file, idx) => {
  const filePath = path.join(migrationsDir, file);
  const content = fs.readFileSync(filePath, "utf-8");

  combinedContent +=
    "/*******************************************************************************\n";
  combinedContent += ` * [${String(idx + 1).padStart(2, "0")}/${String(files.length).padStart(2, "0")}] MIGRATION: ${file}\n`;
  combinedContent +=
    " *******************************************************************************/\n\n";

  combinedContent += content.trim() + "\n\n";
});

combinedContent +=
  "-- ==============================================================================\n";
combinedContent += "-- HOÀN TẤT TRIỂN KHAI TOÀN BỘ SCHEMA GENVIET\n";
combinedContent +=
  "-- ==============================================================================\n";

fs.writeFileSync(outputFile, combinedContent, "utf-8");

console.log(`✅ Đã tạo thành công: ${outputFile}`);
console.log(
  `📊 Tổng kích thước: ${(combinedContent.length / 1024).toFixed(2)} KB (${combinedContent.split("\n").length} dòng)`
);
